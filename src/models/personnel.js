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

      loginTime:{
        type: String,
        default:""
      },

      logoutTime:{
        type: String,
        default:""
      },

      isKeyUsed:{
        type: Boolean,
        default:false
      },
      
      issuedDate:{
        type: Date,
        default:new Date()
      },

      isActive: {
        type: Boolean,
        default:true
      },

      createdAt: {
        type: Date,
        default: new Date()
      },
      
      companyId: {
        type: String,
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Personnel = mongoose.model("personnel", personnel);

module.exports = Personnel;
