const mongoose = require("mongoose");

const ratings = new mongoose.Schema(
  {
    customerInfo: {
        type: Object,
        required: [true, "Customer details must be provided"],
      },

      driverInfo: {
        type: Object,
        required: [true, "Driver details must be provided"],
      },

      message: {
        type: Array,
        required: [true, "Message must be provided"],
      },
      companyID:{
        type: String,
        required: [true, "company Id must be provided"],
      },
      
      driverId:{
        type: String,
        required: [true, "driver's Id must be provided"],
      },

      dateAdded:{
        type: String,
        default: new Date().toLocaleString()
      }


  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Ratings = mongoose.model("ratings", ratings);

module.exports = Ratings;
