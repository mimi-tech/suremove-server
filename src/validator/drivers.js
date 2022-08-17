const Joi = require("joi");

module.exports = {
  
    createDriversAccount: {
        authId: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        username: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        gender: Joi.string().required(),
        profilePicure: Joi.string().required(),
        homeAddress: Joi.string().required(),
        currentLocation: Joi.string().required(),
        currentLocationLat: Joi.number().required(),
        currentLocationLog: Joi.number().required(),

        lincense: Joi.object({
            number: Joi.number().required(),
            issuedDate: Joi.string().required(),
            expringDate: Joi.string().required(),
        }).required(),
        owner: Joi.boolean().required(),
        companyId:Joi.string().required(),
        companyName:Joi.string().required(),
        year:Joi.number().required(),
        month:Joi.number().required(),
        monthName:Joi.string().required(),
        day:Joi.number().required(),
        week:Joi.number().required(),
        bookingCount:Joi.object({
            year: Joi.number().required(),
            month: Joi.number().required(),
            week: Joi.number().required(),
            day: Joi.number().required(),
        }).required(),
        walletBalance:Joi.number().required(),
        country:Joi.string().required(),
        state:Joi.string().required(),
        

  },

  rateDriver: {
    customerInfo:Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        profilePicture: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        gender:Joi.string().required(),
    }).required(),

    driverInfo:Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        profilePicture: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        gender:Joi.string().required(),
        companyId: Joi.string().required(),
        companyName: Joi.string().required(),
        companyOwner: Joi.boolean().required()
    }).required(),
    message: Joi.string(),
    companyID: Joi.string().required(),
    rate: Joi.number().required(),
  },

  getAllDriversOfACompany: {
    page: Joi.number().required(),
    companyId: Joi.string().required(),
  },

  getAllDrivers: {
    page: Joi.number().required(),
  },

  getADriver: {
    driverId: Joi.string().required(),
  },

  deleteADriverAccount: {
    driverId: Joi.string().required(),
  },

  suspendADriver: {
    driverId: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("suspend", "unsuspend"),

  },
  
  driverStatus: {
    driverId: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("online", "transit"),

  },
  matchDrivers:{
    latitude: Joi.number().required(),
    logitude: Joi.number().required(),
    amount: Joi.number().required(),
    customerName: Joi.string().required(),
    sourceAddress: Joi.string().required(),
    destinationAddress: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    customerName: Joi.string().required(),
    item: Joi.object({
      size: Joi.number().required(),
      number: Joi.number().required(),
      name: Joi.string().required()
  }).required(),
  paymentMethod: Joi.string()
      .required()
      .valid("cash", "wallet"),
  },

  updateDriversCurrentLocation:{
    latitude: Joi.number().required(),
    logitude: Joi.number().required(),
    driverId: Joi.string().required(),
  },
  
  driverBookingDecision:{
    driverId: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("accept", "decline"),
  
  },

  createRejectedBooking:{
    driverId: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    profilePicure: Joi.string().required(),
    companyId: Joi.string().required(),
    customerInfo:Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      profilePicture: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      amount: Joi.number().required(),
  }).required(),

  companyInfo:Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
}).required(),
  },

  getAllRejectedBooking: {
    page: Joi.number().required(),
  },

  deleteRejectedBooking: {
    id: Joi.string().required(),
  },
  
  getAllCompanyRejectedBooking: {
    companyId: Joi.string().required(),
  },


};
