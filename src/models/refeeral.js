const mongoose = require("mongoose");

const refeeral = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "user must have an email"],
    },

    profileImageUrl: {
      type: String,
    },

    firstName: {
      type: String,
      required: [true, "user must have a last name"],
    },

    lastName: {
      type: String,
      required: [true, "user must have first name"],
    },

    date: {
        type: String,
        required: [true, "Date is required"],
      },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Refeeral = mongoose.model("refeeral", refeeral);

module.exports = Refeeral;
