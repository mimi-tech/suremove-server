const Joi = require("joi");

module.exports = {
  softMoveAccountRegistration: {
    email: Joi.string().required(),
    password: Joi.string().required(),
    profileImageUrl: Joi.string(),
    username: Joi.string().lowercase({ force: true }).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string()
      .required()
      .valid("Male", "Female"),
    phoneNumber: Joi.string().required(),
    referralId: Joi.string(),
    txnPin: Joi.string().required(),
    
    
  },
  
  generalLogin: {
    email: Joi.string(),
    phoneNumber: Joi.string(),
    password: Joi.string().required(),
  },

  validateUserToken: {
    token: Joi.string().required(),
  },

  forgotPassword: {
    emailAddress: Joi.string().required(),
  },

  validateForgotPasswordCode: {
    email: Joi.string().required(),
    emailCode: Joi.number().required(),
  },

  updatePassword: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },

  updateAccountData: {
    updateEmail: Joi.string(),
    updateUsername: Joi.string().lowercase({ force: true }),
    profileImageUrl: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    gender: Joi.string().valid("male", "female"),
    accountType: Joi.string()
      .valid("customer", "driver","company","admin","contributor","owner"),
  },
  
  sendEmailVerificationCode:{
    emailAddress : Joi.string().required(),
    newEmailAddress:Joi.string().required()
  },
  verifyEmailVerificationCode: {},
};
