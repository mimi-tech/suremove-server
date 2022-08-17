const Joi = require("joi");

module.exports = {
  
    
  createCompany: {
    companyName: Joi.string().required(),
    owner: Joi.boolean().required(),
    ownerId: Joi.string().required(),
    email: Joi.string().required(),
    bykeCount: Joi.number().required(),
    address: Joi.string().required(),
  },
  
  getAllCompanies: {
    page: Joi.number().required(),
  },

  getACompany: {
    companyId: Joi.string().required(),
  },
  
  deleteACompany: {
    companyId: Joi.string().required(),
  },
  
  suspendACompany: {
    companyId: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("suspend", "unsuspend"),

  }
};
