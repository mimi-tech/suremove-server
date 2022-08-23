const mongoose = require("mongoose");

const companies = new mongoose.Schema(
  {
    companyName: {
        type: String,
        unique: true,
        required: [true, "Comapny name must be provided"],
      },

      bykeCount: {
        type: Number,
        default:0  
      
      },

      driversCount: {
        type: Number,
        default:0
      },

      owner: {
        type: Boolean,
        default:false
      },

      ownerId: {
        type: String,
        required: [true, "Comapny owner Id must be provided"],

      },

      email: {
        type: String,
        required: [true, "Comapny email must be provided"],

      },

      suspended: {
        type: Boolean,
        default:false
      },

      address: {
        type: String,
        
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Companies = mongoose.model("companies", companies);

module.exports = Companies;
