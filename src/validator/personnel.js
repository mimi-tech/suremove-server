const Joi = require("joi");

module.exports = {
    createPersonnel: {
    email: Joi.string().required(),
    companyInfo:Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
    }).required(),
  },
  
  getAllPersonnel: {
    page: Joi.number().required(),
  },

  getAPersonnel: {
    personalAuthId: Joi.string().required(),
    key: Joi.string(),
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
