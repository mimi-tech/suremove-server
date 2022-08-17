/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const { constants } = require("../configs");
const { bookingAnalysis,
    yearly,
    monthly,
    weekly,
    daily
} = require("../models");
const { generalHelperFunctions } = require("../helpers");

/**
 * for fetching all daily booking
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllAnalysis = async (params) => {
  try {
    const { page, companyId } = params;

    const pageCount = 15;
    if(companyId){
    const allBookings = await bookingAnalysis.find({companyId: companyId})
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .exec();

      return {
        status: true,
        data: allBookings,
      };
    }
    const allBookings = await bookingAnalysis.find()
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
      message: constants.SERVER_ERROR("ALL Daily bookings"),
    };
  }
};

/**
 * for fetching current month of the year
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

const getCurrentMonth = async (params) => {
    try {
        const { page,companyId } = params;
    
        const pageCount = 15;
        const month = generalHelperFunctions.generateMonth();
        const year = generalHelperFunctions.generateYear();

        if(companyId){
            const allBookings = await bookingAnalysis.find({
                month: month,
                year:year
            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec();
        
            return {
              status: true,
              data: allBookings,
            };  
        }

        const allBookings = await bookingAnalysis.find({
            month: month,
            year:year
        })
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
          message: constants.SERVER_ERROR("ALL MONTHLY BOOKING"),
        };
      }
};

/**
 * for fetching current month of the year
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const getCurrentWeek = async (params) => {
    try {
        const { page, companyId} = params;
    
        const pageCount = 15;
        const week = generalHelperFunctions.generateWeek();
        const year = generalHelperFunctions.generateYear();

         if(companyId){
            const allBookings = await bookingAnalysis.find({
                week: week,
                year:year
            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec(); 

              return {
                status: true,
                data: allBookings,
              };
         }

        const allBookings = await bookingAnalysis.find({
            week: week,
            year:year
        })
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
          message: constants.SERVER_ERROR("ALL WEEKLY BOOKING"),
        };
      }
};

/**
 * for fetching current month of the year
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const getCurrentYearBooking = async (params) => {
    try {
        const { page,companyId } = params;
    
        const pageCount = 15;
        const year = generalHelperFunctions.generateYear();
        
        if(companyId){
            const allBookings = await bookingAnalysis.find({
                year:year,
                companyId:companyId
            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec();
        
            return {
              status: true,
              data: allBookings,
            };
        }

        const allBookings = await bookingAnalysis.find({
            year:year
        })
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
          message: constants.SERVER_ERROR("ALL YEARLY BOOKING"),
        };
      }
};

/**
 * for fetching today's of the year
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const getCurrentDailyBooking = async (params) => {
    try {
        const { page, companyId} = params;
    
        const pageCount = 15;
        const year = generalHelperFunctions.generateYear();
        const month = generalHelperFunctions.generateMonth();
        const week = generalHelperFunctions.generateWeek();
        const day = generalHelperFunctions.generateDay();

         if(companyId){
            const allBookings = await bookingAnalysis.find({
                year:year,
                month:month,
                week:week,
                day:day,
                companyId: companyId
            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec();
        
            return {
              status: true,
              data: allBookings,
            };
         }

        const allBookings = await bookingAnalysis.find({
            year:year,
            month:month,
            week:week,
            day:day
        })
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
          message: constants.SERVER_ERROR("ALL YEARLY BOOKING"),
        };
      }
};


/**
 * for fetching drivers and customers booking
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getUsersBooking = async (params) => {
    try {
        const { page, driverId, customerId } = params;
    
        const pageCount = 15;
        
        if(driverId){
            const allBookings = await bookingAnalysis.find({
                
                driverId:driverId
            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec();
        
            return {
              status: true,
              data: allBookings,
            };
        }

        const allBookings = await bookingAnalysis.find({
            authId:customerId
        })
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
          message: constants.SERVER_ERROR("ALL DRIVER AND CUSTOMER BOOKING"),
        };
      }
};


/**
 * for fetching all booking analysis count
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getBookingAnalysisCount = async (params) => {
    try {
        const { page, companyId, type } = params;
    
        const pageCount = 15;
        
        if(type === "year"){
            const allBookings = await yearly.find({
                companyId:companyId,

            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec();
        
            return {
              status: true,
              data: allBookings,
            };
        }

        if(type === "month"){
            const allBookings = await monthly.find({
                companyId:companyId,

            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec();
        
            return {
              status: true,
              data: allBookings,
            };
        }

        if(type === "week"){
            const allBookings = await weekly.find({
                companyId:companyId,

            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec();
        
            return {
              status: true,
              data: allBookings,
            };
        }
        if(type === "daily"){
            const allBookings = await daily.find({
                companyId:companyId,

            })
              .limit(pageCount)
              .skip(pageCount * (page - 1))
              .exec();
        
            return {
              status: true,
              data: allBookings,
            };
        }
       
      } catch (e) {
        return {
          status: false,
          message: constants.SERVER_ERROR("ALL DRIVER AND CUSTOMER BOOKING"),
        };
      }
};

module.exports = {
    getAllAnalysis,
    getCurrentMonth,
    getCurrentWeek,
    getCurrentYearBooking,
    getCurrentDailyBooking,
    getUsersBooking,
    getBookingAnalysisCount
};
