const Joi = require("joi");

module.exports = {
  
      bookingDetails: {
        sourceLatitude: Joi.number().required(),
        sourceLogitude: Joi.number().required(),
        destinationLatitude: Joi.number().required(),
        destinationLogitude: Joi.number().required(),
        item: Joi.object({
            size: Joi.string().required(),
            number: Joi.number().required(),
            name: Joi.string().required()
        }).required(),

        receiver: Joi.object({
            name: Joi.string().required(),
            profilePicture: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            address: Joi.string().required(),
            gender:Joi.string().required(),
        }).required(),

        sender: Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            profilePicture: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            address: Joi.string().required(),
            gender:Joi.string().required(),
        }).required(),

        driverInfo: Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            profilePicture: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            gender:Joi.string().required(),
        }).required(),
        amount: Joi.number().required(),
        sourceAddress:Joi.string().required(),
        destinationAddress:Joi.string().required(),
        totalAmount:Joi.number().required(),
        companyDetails:Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            owner: Joi.boolean().required()
        }).required(),
        distance:Joi.number().required(),
        timeTaken:Joi.string().required(),
        country:Joi.string().required(),
        state:Joi.string().required(),
       
        methodOfPayment: Joi.string()
      .required()
      .valid("cash", "wallet"),
        driverId: Joi.string().required(),
        driverAuthId: Joi.string().required()

  },

  cancelBooking: {
    message: Joi.string().required()
  },

  getAllBookings: {
    page: Joi.number().required(),
  },

  getABooking: {
    bookingId: Joi.string(),
    customerId: Joi.string(),
  },

  customerConfirmBooking:{
  bookingId: Joi.string(),
  customerAuth: Joi.string(),
  },


  driverConfirmBooking:{
  companyId: Joi.string().required(),
  driverId: Joi.string().required(),
  },
  
  getAwaitingBooking:{
  page: Joi.number().required(),
  },
  
  deleteAwaitingBooking:{
  id: Joi.string().required(),
  },
  
  calculateCost:{
    itemNumber: Joi.number().required(),
    itemSize: Joi.number().required(),
    distance: Joi.number().required(),
  },

  updateBooking:{
    bookingId: Joi.string().required(),
    item: Joi.object({
      size: Joi.string().required(),
      number: Joi.number().required(),
      name: Joi.string().required()
  }).required(),

  methodOfPayment: Joi.string()
      .valid("cash", "wallet"),
  }
};
