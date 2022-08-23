const mongoose = require("mongoose");

const yearly = new mongoose.Schema(
  {
    count: {
        type: Number,
        default: 1
      },

      year: {
        type: Number,
        required: [true, "Yearly must be provided"],
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

const Yearly = mongoose.model("yearly", yearly);

module.exports = Yearly;
