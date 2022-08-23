const mongoose = require("mongoose");

const awaitingBooking = new mongoose.Schema(
  {
    customerAuthId: {
        type: String,
        required: [true, "AuthId must be provided"],
      },

      customerName: {
        type: String,
        equired: [true, "Full name must be provided"],
      
      },

      sourceAddress: {
        type: String,
        required: [true, "Source address must be provided"],
      },

      destinationAddress: {
        type: String,
        required: [true, "Destination address must be provided"],
      },

      phoneNumber: {
        type: String,
        required: [true, "Phone number must be provided"],

      },

      item: {
        type: Object,
        required: [true, "Item must be provided"],
      },

      dateAdded: {
        type:String,
        default: new Date().toLocaleString()
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const AwaitingBooking = mongoose.model("awaitingBooking", awaitingBooking);

module.exports = AwaitingBooking;
