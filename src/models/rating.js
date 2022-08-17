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
        type: String,
        required: [true, "Message must be provided"],
      },
      companyID:{
        type: String,
        required: [true, "company Id must be provided"],
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Ratings = mongoose.model("ratings", ratings);

module.exports = Ratings;
