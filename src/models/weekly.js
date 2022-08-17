const mongoose = require("mongoose");

const weekly = new mongoose.Schema(
  {
    count: {
        type: Number,
        default: 1
      },

      week: {
        type: Number,
        required: [true, "Week number must be provided"],
      },

      year: {
        type: Number,
        required: [true, "Year number must be provided"],
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

const Weekly = mongoose.model("weekly", weekly);

module.exports = Weekly;
