/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const admin = require("firebase-admin");
const { constants } = require("../configs");
const { drivers,companies ,ratings,usersAccount,rejectedBooking, awaitingBooking} = require("../models");
const serviceAccount = require("../../serviceAccountKey.json");

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

    //check if the company is already existing
    const isCompanyExisting = await companies.findOne({
      _id: companyId,
      suspended:false
    });

    if (isCompanyExisting) {
      return {
        status: false,
        message: "This company is not valid",
      };
    }

    //check if driver has an account
    const isDriverAccountExisting = await usersAccount.findOne({
      email: dataparams.email,
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

    //go ahead and create driver account
    const createDrivers = await drivers.create({
        companyId: companyId,
        ...dataparams
    });


    isDriverAccountExisting.whoAreYou = "driver";
    isDriverAccountExisting.save();

    //create driver mini account in firebase
 
    
    const data = {
      uid: createDrivers._id,
      online: false,
      connect: false,
      customerId:"",
      cancel:false,
      transit: false
    };
    
    await db.collection('drivers').doc(createDrivers._id).set(data);
  

    return {
      status: true,
      message: "Driver's account created successfully",
    };
  } catch (e) {
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
      .exec();

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
  const { authId, driverId } = params;
  try {
    const driver = await drivers.findOne({ 
        authId: authId,
        $or:  { _id:driverId },
    
    });

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
     await db.collection('drivers').doc(driverId).delete();

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
 drivers.suspended = true;
 drivers.save();

 return {
   status: true,
   message: "Driver account suspended successfully",
 };
    }

     //go ahead and unsuspend the account
     drivers.suspended = false;
     drivers.save();
 
     return {
       status: true,
       message: "Drivers account unsuspended successfully",
     };
   
  } catch (e) {
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
    drivers.rating = rate;
    await drivers.save();

    //go ahead and create rating message if any
    if(message){
        await ratings.create({
            driverId: driverId,
            message:message,
            customerInfo:customerInfo,
            driverInfo:driverInfo,
            companyID:companyID
          });
    }
   

    return {
      status: true,
      message: "Thank you for rating our driver",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("RATING DRIVER"),
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
    
        if(drivers.onlineStatus === true){
            drivers.onlineStatus = false;
        }else{
            drivers.onlineStatus = true;
        }
   
        driver.save();
  
   return {
     status: true,
     message: "Driver online status saved successfully",
   };
      }
  
       //go ahead and update transit status
     
        if(drivers.onTransit === true){
            drivers.onTransit = false;
        }else{
            drivers.onTransit = true;
        }
        driver.save();
   
       return {
         status: true,
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
    const booking = await drivers.aggregate([
      {
         $geoNear: {
            near: { type: "Point", coordinates: [ latitude , longitude  ] },
            distanceField: "dist.calculated",
            maxDistance: 1000,
            query: { walletBalance: {$gte:amount}, onTransit:false,onlineStatus:true, suspended:false},
            includeLocs: "dist.location",
            spherical: true,
            key:loc
         }
      },
      { $limit: 5 }
   ] )
   if (!booking) {

    //create a awaiting booking
       await awaitingBooking.create({
        authId:authId,
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
            maxDistance: 1000,
            query: { onTransit:false,onlineStatus:true, suspended:false},
            includeLocs: "dist.location",
            spherical: true,
            key:loc
         }
      },
      { $limit: 5 }
   ] )
  
   if (!walletBooking) {

    //create a awaiting booking
       await awaitingBooking.create({
        authId:authId,
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
  const {latitude, longitude,driverId} = params;

  try {
    
    const filter ={ _id: driverId}
    const currentLocation = await drivers.findByIdAndUpdate(filter,
      {
        currentLocationLat:latitude,
         currentLocationLog:longitude,
         loc: { 
          type: "Point",
          coordinates: [latitude, longitude]
      }
        },


      {
        new: true,
      }
      )
  
    if (!currentLocation) {
      return {
        status: false,
        message: "Error occured getting your current location",
      };
    }

    return {
      status: true,
      message:"Location updated successfully"
    };
  } catch (e) {
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
  const { driverId, type } = params;
  try {

    if(type === "accept"){
      //the driver accepted the booking
      const data = {
        accept: true,
        reject:false,
        connect:false,
        transit:true
      }
      
      
      const res = await db.collection('drivers').doc(driverId).set(data,
         { merge: true }
        );

        const filter = {_id: driverId}
         await drivers.findByIdAndUpdate(filter,
          {onTransit:true},
          {
            new: true,
          }
          )

        if(res){
          return {
            status: true,
            message: `Driver ${type} the booking`,
          };
        }
    }
    

    const data = {
      accept: false,
      reject:true,
      connect:false,
      transit: false
      
    }
    
    const res = await db.collection('drivers').doc(driverId).set(data,
       { merge: true }
      );

      if(res){
        return {
          status: false,
          message: `Driver ${type} the booking `,
        };
      }

   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING A DRIVER"),
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
    return {
      status: false,
      message: constants.SERVER_ERROR("RATING DRIVER"),
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
  getAllCompanyRejectedBooking
  
};
