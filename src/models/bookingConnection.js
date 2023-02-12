const mongoose = require("mongoose");

const bookingConnection = new mongoose.Schema(
  {
    driverId: {
        type: String,
        required: [true, "Id must be provided"],
      },

      connect: {
        type: Boolean,
        default: false,
      },

      customerId: {
        type: String,
        required: [true, "customer id must be provided"],
      },

      bookingId: {
        type: String,
        required: [true, "booking id must be provided"],
      },

      reject:{
        type:Boolean,
        default: false,
      },

      accept:{
        type:Boolean,
        default: false,
      },

      transit:{
        type:Boolean,
        default: false,
      },

      cancel:{
        type:Boolean,
        default: false,
      },

      confirm:{
        type:Boolean,
        default: false,
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const BookingConnection = mongoose.model("bookingConnection", bookingConnection);

module.exports = BookingConnection;
