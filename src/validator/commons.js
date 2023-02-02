const Joi = require("joi");

module.exports = {
  
  addCommons: {
    sizeRange: Joi.array().required(),
    weightRange: Joi.array().required(),
  },

  getCommons:{
    page:Joi.number().required()
  }

}