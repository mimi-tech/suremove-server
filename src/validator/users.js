const Joi = require("joi");

module.exports = {
  
  deleteAUser: {
    
  },

  blockAndUnblockUser: {
    authId: Joi.string().required(),
  },

  getAllUsers: {
    page: Joi.number().required(),
  },

  getAUser: {
    authId: Joi.string(),
    email: Joi.string()
  },
  
  updatePhoneNumber: {
    phoneNumber: Joi.string().required(),
  },
  
  updateWallet: {
    type: Joi.string()
      .required()
      .valid("fund", "withdrawal"),
    amount: Joi.number().required(),
  },
  
  searchUsers: {
    accountType: Joi.string()
      .required()
      .valid("customer", "driver","company","admin","contributor","owner"),
      page: Joi.number().required(),
      searchQuery: Joi.string().required(),
  },

  getTransactionHistory: {
    page: Joi.number().required(),
  },
  
  deleteATransaction: {
    clearAll: Joi.boolean().required(),
    history: Joi.string(),
  },

  getUserReferrals: {
    page: Joi.number().required(),
  },

};
