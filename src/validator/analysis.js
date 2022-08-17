const Joi = require("joi");

module.exports = {
    getAllAnalysis: {
    page: Joi.number().required(), 
    companyId: Joi.string()
  },

  getCurrentMonth: {
    page: Joi.number().required(), 
    companyId: Joi.string()
  },

  getCurrentWeek: {
    page: Joi.number().required(), 
    companyId: Joi.string()
  },

  getCurrentYearBooking: {
    page: Joi.number().required(), 
    companyId: Joi.string()
  },

  getCurrentDailyBooking: {
    page: Joi.number().required(), 
    companyId: Joi.string()
  },

  getUsersBooking: {
    page: Joi.number().required(), 
    driverId: Joi.string(),
    customerId: Joi.string(),

  },
  
  getBookingAnalysisCount: {
    page: Joi.number().required(), 
    companyId: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("year", "month", "week", "daily"),

  },

}