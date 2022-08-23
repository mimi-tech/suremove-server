const Joi = require("joi");

module.exports = {
    createPersonnel: {
      personnelEmail: Joi.string().required(),
    companyInfo:Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
    }).required(),
    companyId:Joi.string().required()
  },
  
  getAllPersonnel: {
    page: Joi.number().required(),
    companyId: Joi.string(),
   
  },

  getAPersonnel: {
    personalAuthId: Joi.string().required(),
    key: Joi.string(),
    accountType: Joi.string().required(),
  },
  
  deleteAPersonnel: {
    personnelId: Joi.string().required(),
  },

  createPersonnelNewKey: {
    personnelId: Joi.string().required(),
  },
  
  suspendAPersonnel: {
    personnelId: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("suspend", "unsuspend"),

  }
};
