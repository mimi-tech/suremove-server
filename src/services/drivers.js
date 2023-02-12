/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const admin = require("firebase-admin");
const { constants } = require("../configs");
const { drivers,companies ,ratings,usersAccount,rejectedBooking, awaitingBooking,bookingCollection, bookingConnection} = require("../models");
const serviceAccount = require("../../serviceAccountKey.json");
const { generalHelperFunctions } = require("../helpers");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

/**
 * for creating drivers account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const createDriversAccount = async (params) => {
  try {
    const {companyId, ...dataparams } = params;
    const year = generalHelperFunctions.generateYear();
    const month = generalHelperFunctions.generateMonth();
    const week = generalHelperFunctions.generateWeek();
    const day = generalHelperFunctions.generateDay();


    //check if the company is already existing
    const isCompanyExisting = await companies.findOne({
      _id: companyId,
      suspended:false
    });

    if (!isCompanyExisting) {
      return {
        status: false,
        message: "This company is not valid",
      };
    }

    //check if driver has an account
    const isDriverAccountExisting = await usersAccount.findOne({
      email: dataparams.driversEmail,
      isActive:true
    });
  
    if (!isDriverAccountExisting) {
      return {
        status: false,
        message: "This user does not have a valid account",
      };
    }
    
    if(isDriverAccountExisting.isEmailVerified != true){
      return {
          status: false,
          message: "This user email in not verified.",
        };
    }

    if(isDriverAccountExisting.whoAreYou === "driver"){
      return {
          status: false,
          message: "This user is already a driver",
        };
    }
    
    //go ahead and create driver account
    const createDrivers = await drivers.create({
        companyId: companyId,
        year: year,
        month:month,
        day:day,
        week:week,
        driverAuthId:isDriverAccountExisting._id,
        firstName:isDriverAccountExisting.firstName,
        lastName:isDriverAccountExisting.lastName,
        driverEmail:isDriverAccountExisting.email,
        driverUsername:isDriverAccountExisting.username,
        driverPhoneNumber:isDriverAccountExisting.phoneNumber,
        gender:isDriverAccountExisting.gender,
        profileImageUrl:isDriverAccountExisting.profileImageUrl,
        walletBalance:isDriverAccountExisting.walletBalance,
        companyId:isCompanyExisting._id,
        companyName:isCompanyExisting.companyName,
        ...dataparams
    });


    if(createDrivers){
    
 //create driver mini account in firebase
//check if driver has an account
const res = await bookingConnection.create({
  driverId:createDrivers._id,
  bookingId:"",
  reject:false,
  accept:false,
  connect: false,
  customerId:"",
  cancel:false,
  transit: false
});


  if(res){
    isDriverAccountExisting.whoAreYou = "driver";
  isDriverAccountExisting.save();
  
  return {
    status: true,
    data:createDrivers,
    message: "Driver's account created successfully",
  };
  }
  return {
    status: false,
    message: "Error occurred creating drivers account",
  };
    }
    return {
      status: false,
      message: "Error occurred creating drivers account",
    };
  } catch (e) {
    console.log(e)
    return {
      status: false,
      message: constants.SERVER_ERROR("CREATING DRIVER'S ACCOUNT"),
    };
  }
};

/**
 * for fetching all drivers
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllDrivers = async (params) => {
  try {
    const { page } = params;

    const pageCount = 15;

    const allDrivers = await drivers.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .sort({ dateAdded: "asc" });

    return {
      status: true,
      data: allDrivers,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL DRIVERS"),
    };
  }
};

/**
 * for fetching all drivers FOR A COMPANY
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllDriversOfACompany = async (params) => {
    try {
      const { companyId } = params;
  
     
  
      const allDrivers = await drivers.find({ companyId: companyId})
  
      return {
        status: true,
        data: allDrivers,
      };
    } catch (e) {
      return {
        status: false,
        message: constants.SERVER_ERROR("ALL COMPANY DRIVERS"),
      };
    }
  };

/**
 * for fetching a driver
 * @param {Object} params  company id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

const getADriver = async (params) => {
  const { driverAuthId, driverId } = params;
  try {
    const driver = await drivers.findOne(
      { $or: [{ driverAuthId: driverAuthId }, { _id:driverId }] });

    if (!driver) {
      return {
        status: false,
        message: "Driver not found",
      };
    }

    return {
      status: true,
      data: driver,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING A DRIVER"),
    };
  }
};

/**
 * for deleting a company account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const deleteADriverAccount = async (params) => {
  try {
    const { driverId } = params;

    //check if the driver is already existing
    const driver = await drivers.findOne({
      _id: driverId,
    });

    if (!driver) {
      return {
        status: false,
        message: "Driver does not exist",
      };
    }

    //go ahead and delete the account
    await drivers.deleteOne({
      _id: driverId,
    });
    const filter = { _id: driver.authId };
    await usersAccount.findOneAndUpdate(
      filter,
      { whoAreYou: "customer"},
      {
        new: true,
      }
    );

    //delete the driver from firestore
     await bookingConnection.deleteOne({driverId: driverId});

    return {
      status: true,
      message: "Driver account deleted successfully",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("DELETING A DRIVER ACCOUNT"),
    };
  }
};

/**
 * for suspending a DRIVER account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const suspendADriver = async (params) => {
  try {
    const { driverId, type } = params;

    //check if the driver is already existing
    const driver = await drivers.findOne({
      _id: driverId,
    });

    if (!driver) {
      return {
        status: false,
        message: "Driver does not exist",
      };
    }
    if(type === "suspend"){
 //go ahead and suspend the account
 driver.suspended = true;
 driver.approved = false;
 driver.save();

 return {
   status: true,
   message: "Driver account suspended successfully",
 };
    }else if(type === "approve"){
      driver.approved = true;
      driver.save();  
      return {
        status: true,
        message: "Drivers account approved successfully",
      };
    }else{
 //go ahead and unsuspend the account
 driver.suspended = false;
 driver.save();

 return {
   status: true,
   message: "Drivers account unsuspended successfully",
 };
    }

    
   
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: constants.SERVER_ERROR("SUSPENDING A DRIVER ACCOUNT"),
    };
  }
};


 const rateDriver = async (params) => {
  try {
    const { driverId, message, rate,customerInfo,driverInfo,companyID } = params;

    //check if the driver is already existing
    const driver = await drivers.findOne({
      _id: driverId,
    });

    if (!driver) {
      return {
        status: false,
        message: "Driver does not exist",
      };
    }
     //go ahead and rate the driver
    driver.rating = rate;
    await driver.save();

    //go ahead and create rating message if any
    if(message.length !== 0){
      //check if driver has been rated with message before

      const isRated = await ratings.findOne({
        driverId: driverId,
      });

      if(isRated){
        let arr = isRated.message
        let newArr = arr.includes(message);
        const filter ={ _id: driverId}
         await drivers.findByIdAndUpdate(filter,
          {message: newArr});
          return {
            status: true,
            message: "Thank you for rating our driver",
          };
      }
  
        await ratings.create({
            driverId: driverId,
            message:message,
            customerInfo:customerInfo,
            driverInfo:driverInfo,
            companyID:companyID
          });
          return {
            status: true,
            message: "Thank you for rating our driver",
          };
    }
   

    return {
      status: true,
      message: "Thank you for rating our driver",
    };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: constants.SERVER_ERROR("RATING DRIVER"),
    };
  }
};


const getAllDriversRatings = async (params) => {
  try {
    const { page,companyId } = params;

    const pageCount = 15;

     if(companyId){
      const allRatings = await ratings.find({ companyID: companyId})
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .sort({ dateAdded: "asc" });

    return {
      status: true,
      data: allRatings,
    };
     }
    const allRatings = await ratings.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .sort({ dateAdded: "asc" });

    return {
      status: true,
      data: allRatings,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL RATINGS"),
    };
  }
};

/**
 * for updating drivers status
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const driverStatus = async (params) => {
    try {
      const { driverId, type } = params;
  
      //check if the driver is already existing
      const driver = await drivers.findOne({
        _id: driverId,
      });
  
      if (!driver) {
        return {
          status: false,
          message: "Driver does not exist",
        };
      }
      if(type === "online"){
    
        if(driver.onlineStatus === true){
            driver.onlineStatus = false;
        }else{
            driver.onlineStatus = true;
        }
   
        driver.save();
  
   return {
     status: true,
     data: driver,
     message: "Driver online status saved successfully",
   };
      }
  
       //go ahead and update transit status
     
        if(driver.onTransit === true){
            driver.onTransit = false;
        }else{
            driver.onTransit = true;
        }
        driver.save();
   
       return {
         status: true,
         data: driver,
         message: "Drivers transit status saved successfully",
       };
     
    } catch (e) {
      return {
        status: false,
        message: constants.SERVER_ERROR("UPDATING Driver STATUS"),
      };
    }
  };

  /**
 * for matching drivers
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const matchDrivers = async (params) => {
  const {latitude, longitude, amount, authId, ...dataToUpload} = params;

  try {
    
    if(dataToUpload.paymentMethod === "cash"){
      console.log("Cash");
    const booking = await drivers.aggregate([
      {
         $geoNear: {
            near: { type: "Point", coordinates: [ latitude , longitude  ] },
            distanceField: "dist.calculated",
            maxDistance: 100000,
            query: { walletBalance: {$gte:amount}, onTransit:false,onlineStatus:true, suspended:false, approved:true, isActive:true},
            includeLocs: "dist.location",
            spherical: true,
            key:"loc"
         }
      },
      { $limit: 5 }
   ] )
   if (!booking) {

    //create a awaiting booking
       await awaitingBooking.create({
        customerAuthId:authId,
        customerName:dataToUpload.customerName,
        sourceAddress:dataToUpload.sourceAddress,
        destinationAddress:dataToUpload.destinationAddress,
        phoneNumber:dataToUpload.phoneNumber,
        item:dataToUpload.item,
      })


    return {
      status: false,
      message: "Driver not found",
    };
  }

 //create the booking details in app
   
if(booking.length === 0){
//create a awaiting booking
await awaitingBooking.create({
  customerAuthId:authId,
  customerName:dataToUpload.customerName,
  sourceAddress:dataToUpload.sourceAddress,
  destinationAddress:dataToUpload.destinationAddress,
  phoneNumber:dataToUpload.phoneNumber,
  item:dataToUpload.item,
})

return {
  status: false,
  message: "Driver not found",
};
}
  return {
    status: true,
    data: booking,
    message:"A driver have been found"
  };
  
  }

  
    const walletBooking = await drivers.aggregate([
      {
         $geoNear: {
            near: { type: "Point", coordinates: [ latitude , longitude  ] },
            distanceField: "dist.calculated",
            maxDistance: 1000000,
            query: { onTransit:false,onlineStatus:true,suspended:false,approved:true,isActive:true},
            includeLocs: "dist.location",
            spherical: true,
            key:"loc"
         }
      },
      { $limit: 5 }
   ] )
  
   if (!walletBooking) {
        
    //create a awaiting booking
       await awaitingBooking.create({
        customerAuthId:authId,
        customerName:dataToUpload.customerName,
        sourceAddress:dataToUpload.sourceAddress,
        destinationAddress:dataToUpload.destinationAddress,
        phoneNumber:dataToUpload.phoneNumber,
        item:dataToUpload.item,
      })
    return {
      status: false,
      message: "Driver not found",
    };
  }
//console.log(walletBooking)
 //create the booking details in app
   
if(walletBooking.length === 0){
  await awaitingBooking.create({
    customerAuthId:authId,
    customerName:dataToUpload.customerName,
    sourceAddress:dataToUpload.sourceAddress,
    destinationAddress:dataToUpload.destinationAddress,
    phoneNumber:dataToUpload.phoneNumber,
    item:dataToUpload.item,
  })
return {
  status: false,
  message: "Driver not found",
};
}

  return {
    
    status: true,
    data: walletBooking,
    message:"A driver have been found"
  };
    
  } catch (e) {
  
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING A BOOKING"),
    };
  }
};


/**
 * for updating drivers current location
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const updateDriversCurrentLocation = async (params) => {
  const {latitude, logitude,driverId,currentLocationAddress} = params;

  try {
    //check if the driver is already existing
    const driver = await drivers.findOne({
      _id: driverId,
    });

    if (!driver) {
      return {
        status: false,
        message: "Driver does not exist",
      };
    }
    const filter ={ _id: driverId}
    const currentLocation = await drivers.findByIdAndUpdate(filter,
      {
        currentLocationLat:latitude,
         currentLocationLog:logitude,
         currentLocation:currentLocationAddress,
         loc: { 
          type: "Point",
          coordinates: [latitude, logitude]
      }
        },


      {
        new: true,
      }
      )
  
    if (!currentLocation) {
      return {
        status: false,
        message: "Error in location",
      };
    }

    return {
      status: true,
      data: currentLocation,
      message:"Location updated successfully"
    };
  } catch (e) {
    console.log(e)
    return {
      status: false,
      message: constants.SERVER_ERROR("UPDATING CURRENT LOCATION"),
    };
  }
};

/**
 * for accepting or rejecting booking
 * @param {Object} params  company id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const driverBookingDecision = async (params) => {
  const { driverId, type,customerId } = params;
  try {

    if(type === "accept"){
      //the driver accepted the booking
      const res = await bookingConnection.findOne({driverId:driverId});
   
      if(!res){
      
         return {
          status: false,
          message: "Error occurred while fetching driver connection",
        };
       
      }
        res.connect = false;
        res.customerId = customerId;
        res.reject = false;
        res.accept = true;
        res.transit = true;
         res.save();

        const filter = {_id: driverId}
        const details =  await drivers.findByIdAndUpdate(filter,
          {onTransit:true},
          {
            new: true,
          }
          )
          //update driver user account ongoing booking true
          const filterUser = {_id: details.driverAuthId}

          await usersAccount.findByIdAndUpdate(filterUser,
            {isOngoingBooking:true},
            {
              new: true,
            }
            );

          //   //update customer user account ongoing booking true
          const filterConstumer = {_id: customerId}

          await usersAccount.findByIdAndUpdate(filterConstumer,
            {isOngoingBooking:true},
            {
              new: true,
            }
            );

        if(res){
          return {
            status: true,
            message: `Driver ${type} the booking`,
          };
        }
    }
    

    
    const res = await bookingConnection.findOne({driverId:driverId});
   
      if(!res){
      
         return {
          status: false,
          message: "Error occurred while fetching driver connection",
        };
       
      }
        res.connect = false;
        res.customerId = customerId;
        res.reject = true;
        res.accept = true;
        res.transit = false;
         res.save();

         return {
          status: true,
          message: `Driver ${type} the booking `,
        };

   
  } catch (e) {
   
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING UPDATING DRIVER DECISION"),
    };
  }
};


/**
 * for creating rejected booking
 * @param {Object} params  company id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
const createRejectedBooking = async (params) => {
  try {
    const { driverId, ...dataToUpload} = params;

  
    
        const rejectBookings = await rejectedBooking.create({
            driverId: driverId,
            ...dataToUpload
          });
    
   if(rejectBookings){
    return {
      status: true,
      message: "Data created successfully",
    };
   }

    return {
      status: false,
      message: "Data not created successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: constants.SERVER_ERROR("BOOKING REJECTION UPDATE"),
    };
  }
};

/**
 * for fetching all rejected bookings
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllRejectedBooking = async (params) => {
  try {
    const { page } = params;

    const pageCount = 15;

    const allRejectedBookings = await rejectedBooking.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .exec();

    return {
      status: true,
      data: allRejectedBookings,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL REJECTED BOOKING"),
    };
  }
};

/**
 * for deleting a rejected booking
 * @param {Object} params  {rejectedBookingId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const deleteRejectedBooking = async (params) => {
  try {
    const { id } = params;
    const deleteData = await rejectedBooking.deleteOne({_id:id})
     
    return {
      status: true,
      data: deleteData,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL REJECTED BOOKING"),
    };
  }
};


/**
 * for fetching all company rejected bookings
 * @param {Object} params  companyId
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllCompanyRejectedBooking = async (params) => {
  try {
    const { companyId } = params;

    const rejected = await rejectedBooking.find({ companyId: companyId})

    if(rejected){
      return {
        status: true,
        data: rejected,
      };
    }
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL COMPANY REJECTED BOOKINGS"),
    };
  }
};


/**
 * for fetching DRIVER  booking decision
 * @param {Object} params  companyId
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
const getDriverBookingConnection = async (params) => {
  try {
    const { driverId, type } = params;
    const res = await bookingConnection.findOne({driverId:driverId});
    if(!res){
     
      return {
       status: false,
       message: "Driver does not exist",
     };
    
   }
    
     if(type === "connection"){
    if(res.connect === true) {
    
      return {
        status: true,
        data: doc.data(),
        message: "You got a booking"
      };
    }
  }


  if(type === "accept"){
    if(res.accept === true) {
    
      return {
        status: true,
        data: doc.data(),
        message: "Driver accepted the request"
      };
    }
  }

    return {
      status: false,
      message: "No booking found"
    };

    
  } catch (e) {
    console.log(e)
    return {
      status: false,
      message: constants.SERVER_ERROR("GET DRIVER DECISION BOOKING"),
    };
  }
};




module.exports = {
  createDriversAccount,
  getAllDrivers,
  getAllDriversOfACompany,
  getADriver,
  deleteADriverAccount,
  suspendADriver,
  rateDriver,
  driverStatus,
  matchDrivers,
  updateDriversCurrentLocation,
  driverBookingDecision,
  createRejectedBooking,
  getAllRejectedBooking,
  deleteRejectedBooking,
  getAllCompanyRejectedBooking,
  getAllDriversRatings,
  getDriverBookingConnection
  
};
