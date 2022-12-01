/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { constants } = require("../configs");
const serviceAccount = require("../../serviceAccountKey.json");

const {bookingCollection,
   cancelledBooking,
   usersAccount, 
   bookingAnalysis, 
   drivers,
   yearly,
   monthly,
   weekly,
   daily,
   awaitingBooking,companies
  
  } = require("../models");
const { updateWallet} = require("./users");
const { generalHelperFunctions } = require("../helpers");


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

/**
 * for customers booking details
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const bookingDetails = async (params) => {
  try {
    const { authId, ...dataToUpload} = params;

    const year = generalHelperFunctions.generateYear();
    const month = generalHelperFunctions.generateMonth();
    const week = generalHelperFunctions.generateWeek();
    const day = generalHelperFunctions.generateDay();
    const monthName = generalHelperFunctions.generateMonthName();


     //Check customer method of payment
     if(dataToUpload.methodOfPayment === "wallet"){
      const isUserExisting = await usersAccount.findOne({
        _id: authId,
      });
  
      if (isUserExisting) {
        if(isUserExisting.walletBalance < dataToUpload.totalAmount){
          return {
            status: false,
            message: "Insufficient fund. Please fund your wallet or change to cash for your payment",
          };
        }
        
      }
     }


     //Check customer method of payment is promo
     if(dataToUpload.methodOfPayment === "promo"){
      const isUserExisting = await usersAccount.findOne({
        _id: authId,
      });
  
      if (isUserExisting) {
        if(isUserExisting.promoBalance < dataToUpload.totalAmount){
          return {
            status: false,
            message: "Insufficient fund. Please fund your wallet or change to cash for your payment",
          };
        }
        
      }
     }


     //check if user has a booking collection
     const isUserExisting = await bookingCollection.findOne({
        authId: authId,
      });
  
      if (isUserExisting) {
        
        const filter = { customerAuthId: authId };
      
     const addBooking = await bookingCollection.findOneAndUpdate(filter, {
        year:year,
      month:month,
      week:week,
      day:day,
      monthName:monthName,
      customerAuthId:authId,
      cancelBooking:false,
      ongoing:true,
      isPaymentSuccessful:false,
      confirmDelivery:false,
        ...dataToUpload}, {
        new: true,
      });

      //Update the user collection isOngoingBooking to true
      
      await usersAccount.findOneAndUpdate(filter, {isOngoingBooking:true}, {
        new: true,
      });
    //This will let the driver to know that he has gotten a booking

    const data = {
      connect: true,
      customerId:dataToUpload.sender.id,
      bookingId:addBooking._id
    }
    
    const res = await db.collection('drivers').doc(`${dataToUpload.driverId}`).set(JSON.parse(JSON.stringify(data,
       { merge: true })
      ));
  
      if(res){
        return {
          status: true,
          data:addBooking,
          message: "Booking details saved successfully",
        };
      }
       
      }
      

    const details = await bookingCollection.create({
      year:year,
      month:month,
      week:week,
      day:day,
      monthName:monthName,
      customerAuthId:authId,
      ...dataToUpload});


     //This will let the driver to know that he has gotten a booking

     const data = {
      connect: true,
      customerId:dataToUpload.sender.id,
      reject:false,
      accept:false
    }
    
    const res = await db.collection('drivers').doc(`${dataToUpload.driverId}`).set(JSON.parse(JSON.stringify(data,
       { merge: true }
      )));
  
      if(res){
        return {
          status: true,
          data:details,
          message: "Booking details saved successfully",
        };
      }
       
      
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: constants.SERVER_ERROR("CREATING BOOKING APP ACCOUNT"),
    };
  }
};


/**
 * for customers booking details
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const updateBooking = async (params) => {
  try {
    const { authId, bookingId, ...dataToUpdate} = params;
    
      
    const filter = { $or: [{ _id: bookingId }, { customerAuthId:authId }] };
      
    const updateBooking = await bookingCollection.findOneAndUpdate(filter, {
       ...dataToUpdate}, {
       new: true,
     });     
    
     
     if(updateBooking){
      return {
        status: true,
        data:updateBooking,
        message: "Booking updated successfully",
      };
     }
     return {
      status: false,
      message: "Error occurred updating booking",
    };

  }catch(e){
    console.log(e)
    return {
      status: false,
      message: constants.SERVER_ERROR("UPDATING BOOKING"),
    };
  }
}

/**
 * for customers cancelling booking
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const cancelBooking = async (params) => {
    try {
      const { authId, message } = params;
  
      //check if booking collection is existing
      const isBookingExisting = await bookingCollection.findOne({
        customerAuthId: authId,
      });
  
      if (isBookingExisting) {

        isBookingExisting.ongoing = false;
        isBookingExisting.cancelBooking = true;
        isBookingExisting.save();
        
        const customerInfo = {
          id:isBookingExisting.sender.id,
          name:isBookingExisting.sender.name,
          profilePicture:isBookingExisting.sender.profilePicture ,
          phoneNumber:isBookingExisting.sender.phoneNumber,
          gender:isBookingExisting.sender.gender,
          address:isBookingExisting.sender.address,

        }

        const driverInfo = {
          id:isBookingExisting.driverInfo.id,
          name:isBookingExisting.driverInfo.name,
          profilePicture:isBookingExisting.driverInfo.profilePicture ,
          phoneNumber:isBookingExisting.driverInfo.phoneNumber,
          gender:isBookingExisting.driverInfo.gender,
          companyId: isBookingExisting.companyDetails.id,
          companyName: isBookingExisting.companyDetails.name,
          companyOwner: isBookingExisting.companyDetails.owner

        }

        await cancelledBooking.create({
            customerInfo:customerInfo,
            driverInfo:driverInfo,
            message:message
        });

         //This will let the driver to know that booking has been cancelled by the customer
        //Update the user collection isOngoingBooking to true
        const filter = { _id: authId };
        await usersAccount.findOneAndUpdate(filter, {isOngoingBooking:false}, {
        new: true,
        });

       

     const data = {
      connect: false,
      cancel:true,
      accept: false,
      transit:false,
      customerId:""
    }
    
    await db.collection('drivers').doc(`${driverInfo.id}`).update(JSON.parse(JSON.stringify(data)));
   
        return {
          status: false,
          message: "This booking is now cancelled",
        };
      }
     
  
      return {
        status: false,
        message: "Sorry there is an error cancelling your booking",
      };
    } catch (e) {
      return {
        status: false,
        message: constants.SERVER_ERROR("CANCELLING BOOKING"),
      };
    }
  };


/**
 * for fetching all BOOKINGS
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllBookings = async (params) => {
  try {
    const { page } = params;

    const pageCount = 15;

    const allBookings = await bookingCollection.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .exec();

    return {
      status: true,
      data: allBookings,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL BOOKINGS"),
    };
  }
};

/**
 * for fetching a user
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

const getABooking = async (params) => {
  const { bookingId,customerId } = params;
  try {
    const booking = await bookingCollection.findOne(
      { $or: [{ _id: bookingId }, {customerAuthId:customerId }] });

    if (!booking) {
      return {
        status: false,
        message: "booking not found",
      };
    }

    return {
      status: true,
      data: booking,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING A BOOKING"),
    };
  }
};

/**
 * for customer confirming booking is successful
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const customerConfirmBooking = async (params) => {
  const { authId, bookingId } = params;
  try {
    const booking = await bookingCollection.findOne(
      { $or: [{ _id: bookingId}, { customerAuth:authId }] });

    if (!booking) {
      return {
        status: false,
        message: "booking not found",
      };
    }
    booking.ongoing = false;
    booking.confirmDelivery = true;
    booking.isPaymentSuccessful = true;
    booking.save();

    let ownerAmount;
    let partnersAmount ;
    let contributorAmount;
    let driversAmount;
   
    //share percentages
     if(booking.companyDetails.owner === true){
      
      if(booking.methodOfPayment === "cash"){
        
        ownerAmount = 20/100 * booking.totalAmount;
        partnersAmount = 0;
        contributorAmount = 10/100 * booking.totalAmount;
        driversAmount =  70/100 * booking.totalAmount;
       
      }else{
        ownerAmount = 20/100 * booking.totalAmount;
        partnersAmount = 0;
        contributorAmount = 10/100 * booking.totalAmount;
        driversAmount = 70/100 * booking.totalAmount;
      }
     
     }else{
      
      if(booking.methodOfPayment === "cash"){
        ownerAmount = 10/100 * booking.totalAmount;
        partnersAmount = 20/100 * booking.totalAmount;
        contributorAmount = 10/100 * booking.totalAmount;
        driversAmount = 60/100 * booking.totalAmount; 
      }else{
        ownerAmount = 10/100 * booking.totalAmount;
        partnersAmount = 20/100 * booking.totalAmount;
        contributorAmount = 10/100 * booking.totalAmount;
        driversAmount = 60/100 * booking.totalAmount; 
      }

       
     }

    //get owner and contributor id
    const secretRef = db.collection('secret').doc("Pnf7UykV4bWxDWLCaBwK");
    const doc = await secretRef.get();
    if (!doc.exists) {
      return {
        status: false,
        message: "An error occurred getting owner and contributor",
      };
    } 

    //get the company authId
    const companyDetails = await companies.findOne({ _id:booking.companyDetails.id })

    if(!companyDetails){
      return {
        status: false,
        message: "An error occurred getting company information",
      }; 
    }
  
    
    

    //check the method of payment
    if(booking.methodOfPayment === "cash"){
       

      //Take the amount from driver account
      const body = { amount:booking.totalAmount, userAuthId:booking.driverAuthId, type:"withdrawal" };
      const data = await updateWallet(body);
      if (data.status === false) {
        console.log("sjbdjwhdbwjhbd");
        return {
          status: false,
          message: data.message,
        };
      }

    //Fund the owner account
    const ownerBody = { amount:ownerAmount, userAuthId:doc.data().ownerId, type:"fund" };
    const ownerData = await updateWallet(ownerBody);
    if (ownerData.status === false) {
      console.log("ppppppp")
      console.log(ownerData.message)
      return {
        status: false,
        message: ownerData.message,
      };
    }

    //Fund the partner account
    const partnerBody = { amount:partnersAmount, userAuthId:companyDetails.ownerId, type:"fund" };
    const partnerData = await updateWallet(partnerBody);
    if (partnerData.status === false) {
      return {
        status: false,
        message: "An error occurred while updating partner's ccount",
      };
    }

    //Fund the contributor account
    const contributorsBody = { amount:contributorAmount, userAuthId:doc.data().contributorId, type:"fund" };
    const contributorsData = await updateWallet(contributorsBody);
    if (contributorsData.status === false) {
      return {
        status: false,
        message: "An error occurred while updating contributors's ccount",
      };
    }

  }else{
     //Take the money from customer wallet
  const body = { amount:booking.totalAmount, userAuthId:booking.customerAuthId, type:"withdrawal" };
  const data = await updateWallet(body);
  if (data.status === false) {
    return {
      status: false,
      message: "Insufficient fund found",
    };
  }

  //Fund the owner account
  const ownerBody = { amount:ownerAmount, userAuthId:doc.data().ownerId, type:"fund" };
  const ownerData = await updateWallet(ownerBody);
  if (ownerData.status === false) {
    return {
      status: false,
      message: "An error occurred while updating owner's ccount",
    };
  }

  //Fund the partner account
  const partnerBody = { amount:partnersAmount, userAuthId:companyDetails.ownerId, type:"fund" };
  const partnerData = await updateWallet(partnerBody);
  if (partnerData.status === false) {
    return {
      status: false,
      message: "An error occurred while updating partner's ccount",
    };
  }

  //Fund the contributor account
  const contributorsBody = { amount:contributorAmount, userAuthId:doc.data().contributorId, type:"fund" };
  const contributorsData = await updateWallet(contributorsBody);
  if (contributorsData.status === false) {
    return {
      status: false,
      message: "An error occurred while updating contributors's ccount",
    };
  }

  //Fund the contributor account
  const driverBody = { amount:driversAmount, userAuthId:booking.driverAuthId, type:"fund" };
  const driverData = await updateWallet(driverBody);
  if (driverData.status === false) {
    return {
      status: false,
      message: "An error occurred while updating drivers's ccount",
    };
  }


  }
  const year = generalHelperFunctions.generateYear();
  const month = generalHelperFunctions.generateMonth();
  const week = generalHelperFunctions.generateWeek();
  const day = generalHelperFunctions.generateDay();
  const monthName = generalHelperFunctions.generateMonthName();



  const saveAnalysis = await bookingAnalysis.create({
    sourceAddress: booking.sourceAddress,
    destinationAddress: booking.destinationAddress,
    item: booking.item,
    driverId: booking.driverId,
    receiver: booking.receiver,
    sender: booking.sender,
    driverInfo: booking.driverInfo,
    sender: booking.sender,
    methodOfPayment: booking.methodOfPayment,
    companyDetails: booking.companyDetails,
    totalAmount: booking.totalAmount,
    distance: booking.distance,
    timeTaken: booking.timeTaken,
    country: booking.country,
    state: booking.state,
    customerAuthId:authId,
    year: year,
    month: month,
    week: week,
    day: day,
    monthName:monthName,
    companyId:booking.companyDetails.id,
    distance: booking.distance,
    ownerId:doc.data().ownerId,
    contributorId:doc.data().contributorId,
    ownerAmount:ownerAmount,
    driversAmount:driversAmount,
    partnersAmount: partnersAmount,
    contributorAmount:contributorAmount,
    
  });

     //Update the user collection isOngoingBooking to false
     const filter = { _id: authId };
     await usersAccount.findOneAndUpdate(filter, {isOngoingBooking:false}, {
      new: true,
    });
//update the driver collection in firebase that customer have confirm delivery
const data = { 
  confirm:true
}
await db.collection('drivers').doc(`${booking.driverId}`).update(JSON.parse(JSON.stringify(data)));

    
 
    if(saveAnalysis){
      return {
        status: true,
        message: "Successful",
        data:saveAnalysis
      };
    }
    
    return {
      status: false,
      message: "Error creating analysis account",
    };
    
  } catch (e) {
    
    return {
      status: false,
      message: constants.SERVER_ERROR("CUSTOMER CONFIRMING BOOKING"),
    };
  }
};


/**
 * for driver confirming booking has been delivered
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const driverConfirmBooking = async (params) => {
  const { authId,companyId,driverId } = params;
  try {
    
    const year = generalHelperFunctions.generateYear();
    const month = generalHelperFunctions.generateMonth();
    const week = generalHelperFunctions.generateWeek();
    const day = generalHelperFunctions.generateDay();
    const monthName = generalHelperFunctions.generateMonthName();


 //Update the user collection isOngoingBooking to true
 const filter = { _id: driverId };
 const userFilter = { _id: authId };
 await usersAccount.findOneAndUpdate(userFilter, {isOngoingBooking:false}, {
  new: true,
});

const data = {
  accept: false,
  reject:false,
  connect:false,
  transit:false,
  confirm:false
}


await db.collection('drivers').doc(driverId).update(JSON.parse(JSON.stringify(data)));


  const isDriver = await drivers.findOne({ _id: driverId});

  if(isDriver) {
    
    isDriver.year === year?isDriver.yearlyCount += 1:1
    isDriver.month === month?isDriver.monthlyCount += 1:1
    isDriver.week === week?isDriver.weeklyCount += 1:1
    isDriver.day === day && isDriver.month === month?isDriver.dailyCount += 1:1
   
    await isDriver.save();
  }


//update the analysis count yearly
const isYearlyAnalysis = await yearly.findOne({ year: year,companyId:companyId});
if(isYearlyAnalysis){
  isYearlyAnalysis.count = isYearlyAnalysis.count +=1;
  await isYearlyAnalysis.save();
}else{
 await yearly.create({
    year:year,
    companyId:companyId,
   });

}

//update the analysis count monthly
const isMonthlyAnalysis = await monthly.findOne({ year: year,month:month,companyId:companyId});
if(isMonthlyAnalysis){
  isMonthlyAnalysis.count = isMonthlyAnalysis.count +=1;
  await isMonthlyAnalysis.save();
}else{
 await monthly.create({
    year:year,
    companyId:companyId,
    month: month,
    monthName:monthName
   });

}

//update the analysis count weekly
const isWeeklyAnalysis = await weekly.findOne({ year: year,week:week,companyId:companyId});
if(isWeeklyAnalysis){
  isWeeklyAnalysis.count = isWeeklyAnalysis.count +=1;
  await isWeeklyAnalysis.save();
}else{
 await weekly.create({
    week:week,
    companyId:companyId,
    year: year,
   
   });

}

//update the analysis count weekly
const isDailyAnalysis = await daily.findOne({ year: year,month:month,companyId:companyId,year:year});
if(isDailyAnalysis){
  isDailyAnalysis.count = isDailyAnalysis.count +=1;
  await isDailyAnalysis.save();
}else{
 await daily.create({
    day:day,
    companyId:companyId,
    year: year,
    month: month,
   
   });

}

   const driverDetails = await drivers.findOneAndUpdate(filter,
    {
      onTransit:false,
      year: year,
      month: month,
      week: week,
      day: day,
      monthName:monthName
    },
    {
      new: true,
    })

    if(driverDetails){
      return {
        status: true,
        message: "Successful",
      };
    }
    return {
      status: false,
      message: "Not successful",
    };
    
  

  } catch (e) {
    console.log(e)
    return {
      status: false,
      message: constants.SERVER_ERROR("DRIVER CONFIRMING BOOKING"),
    };
  }
};


/**
 * for getting awaiting booking
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const getAwaitingBooking = async (params) => {
  const {page} = params;
  try {
    const pageCount = 15;

    const isAwaitingBooking = await awaitingBooking.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .exec();
    if (!isAwaitingBooking) {
      return {
        status: false,
        message: "No Awaiting booking not found",
      };
    }
    return {
      status: true,
      data: isAwaitingBooking,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("AWAITING BOOKING BOOKING"),
    };
  }
};

/**
 * for getting awaiting booking
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const deleteAwaitingBooking = async (params) => {
  const { id } = params;
  try {
    const isAwaitingBooking = await awaitingBooking.deleteOne({
      _id: id,
    });
    if (!isAwaitingBooking) {
      return {
        status: false,
        message: "No Awaiting booking not found",
      };
    }
    return {
      status: true,
      message: "Booking deleted successfully",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("DELETING AWAITING BOOKING BOOKING"),
    };
  }
};

/**
 * for calculating booking cost
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const calculateCost = async (params) => {
  const {itemNumber, itemSize, distance } = params;
  try {
    const kiloMeter = 100;
    const loadPrize = 100;
    let loadCost = 0;
    let speed = 0;
    let finalCost = 0;
    if(itemSize > 10){
      loadCost = itemNumber * loadPrize;
    
    }
    speed = distance * kiloMeter;
    finalCost = speed + loadCost;
    return {
      status: true,
      data:finalCost
    };
  } catch (e) {
    
    return {
      status: false,
      message: constants.SERVER_ERROR("CALCULATING BOOKING COST"),
    };
  }
};


module.exports = {
    bookingDetails,
    cancelBooking,
    getAllBookings,
    getABooking,
    customerConfirmBooking,
    driverConfirmBooking,
    getAwaitingBooking,
    deleteAwaitingBooking,
    calculateCost,
    updateBooking
  
};
