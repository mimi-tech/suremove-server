const Joi = require("joi");

module.exports = {
  
    createDriversAccount: {
        companyId: Joi.string().required(),
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
        country:Joi.string().required(),
        state:Joi.string().required(),
        driversEmail:Joi.string().required(),
        

  },

  rateDriver: {
    customerInfo:Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        profileImageUrl: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        gender:Joi.string().required(),
    }).required(),

    driverInfo:Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        profileImageUrl: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        gender:Joi.string().required(),
        companyId: Joi.string().required(),
        companyName: Joi.string().required(),
        companyOwner: Joi.boolean().required()
    }).required(),
    message: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        profileImageUrl: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        gender:Joi.string().required(),
        message: Joi.string().required(),
      })
    ),
    companyID: Joi.string().required(),
    driverId: Joi.string().required(),
    rate: Joi.number().required(),
  },

  getAllDriversOfACompany: {
    page: Joi.number().required(),
    companyId: Joi.string().required(),
  },

  getAllDrivers: {
    page: Joi.number().required(),
  },
  
  getAllDriversRatings: {
    page: Joi.number().required(),
    companyId: Joi.string()
  },

  getADriver: {
    driverId: Joi.string(),
    driverAuthId:Joi.string()
  },

  deleteADriverAccount: {
    driverId: Joi.string().required(),
  },

  suspendADriver: {
    driverId: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("suspend", "unsuspend", "approve"),

  },
  
  driverStatus: {
    driverId: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("online", "transit"),

  },
  matchDrivers:{
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    amount: Joi.number().required(),
    customerName: Joi.string().required(),
    sourceAddress: Joi.string().required(),
    destinationAddress: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    item: Joi.object({
      size: Joi.string().required(),
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
    currentLocationAddress: Joi.string().required(),
  },
  
  driverBookingDecision:{
    driverId: Joi.string().required(),
    customerId: Joi.string(),
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

  getDriverBookingDecision: {
    driverId: Joi.string().required(),
  }


};
