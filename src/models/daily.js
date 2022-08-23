const mongoose = require("mongoose");

const daily = new mongoose.Schema(
  {
    count: {
        type: Number,
        default: 1
      },

      day: {
        type: Number,
        required: [true, "Day number must be provided"],
      },

      month: {
        type: Number,
        required: [true, "Month number must be provided"],
      },

      year: {
        type: Number,
        required: [true, "Year number must be provided"],
      },

      companyId:{
        type: String,
        required: [true, "company Id must be provided"],
      },
      dateAdded:{
        type: Date,
        default: new Date()
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Daily = mongoose.model("daily", daily);

module.exports = Daily;
