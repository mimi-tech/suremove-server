const mongoose = require("mongoose");

const history = new mongoose.Schema(
  {
    authId: {
        type: String,
        required: [true, "Customer authId must be provided"],
      },

      transaction: {
        type: String,
        required: [true, "Transaction types must be provided"],
      },

      amount: {
        type: Number,
        required: [true, "Message must be provided"],
      },
      sign:{
        type: String,
        required: [true, "Sign must be provided"],
      },

      date:{
        type: String,
        required: [true, "Date must be provided"],
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const History = mongoose.model("history", history);

module.exports = History;
