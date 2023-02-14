const Joi = require("joi");

module.exports = {
  
  addCommons: {
    sizeRange: Joi.array().required(),
    weightRange: Joi.array().required(),
    contributorId:Joi.string(),
    ownerId:Joi.string(),
    companyName: Joi.string(),
    companyAddress: Joi.string(),
  },

  getCommons:{
    page:Joi.number().required()
  },

  createNotification:{
    message: Joi.string().required(),
    accountType: Joi.array().required()
  },
  getNotification: {
    page:Joi.number().required()
  },

  deleteNotification:{
    perWeek: Joi.boolean().required(),
    notificationId: Joi.string().required()
  }
}