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

      ownerID: {
        type: String,
        required: [true, "Comapny owner ID must be provided"],

      },

      suspended: {
        type: Boolean,
        default:false
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Companies = mongoose.model("companies", companies);

module.exports = Companies;
