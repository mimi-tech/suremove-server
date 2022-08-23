const mongoose = require("mongoose");

const monthly = new mongoose.Schema(
  {
    count: {
        type: Number,
        default: 1
      },

      month: {
        type: Number,
        required: [true, "Monthly must be provided"],
      },

      monthName: {
        type: String,
        required: [true, "Month name must be provided"],
      },
      year: {
        type: Number,
        required: [true, "Year number must be provided"],
      },

      companyId:{
        type: String,
        required: [true, "company Id must be provided"],
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Monthly = mongoose.model("monthly", monthly);

module.exports = Monthly;
