const mongoose = require("mongoose");

const personnel = new mongoose.Schema(
  {
    personalAuthId: {
        type: String,
        unique: true,
        required: [true, "Personnel Id must be provided"],
      },

      email: {
        type: String,
        unique: true,
        required: [true, "Personnel email must be provided"],
      },

      profileImageUrl: {
        type: String,
      },
  
      username: {
        type: String,
        unique: true,
        required: [true, "user must have a username"],
      },
  
      firstName: {
        type: String,
        required: [true, "user must have a last name"],
      },
  
      lastName: {
        type: String,
        required: [true, "user must have first name"],
      },
      
      onlineStatus:{
        type: Boolean,
        default:false
      },
      
      companyInfo: {
        type: Object,
      },

      key:{
        type: String,
        required: [true, "Key is required"],
      },

      isKeyUsed:{
        type: Boolean,
        default:false
      },
      
      issuedDate:{
        type: Date,
        required: [true, "key issued date is required"],
      },

      isActive: {
        type: Boolean,
        default:true
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Personnel = mongoose.model("personnel", personnel);

module.exports = Personnel;
