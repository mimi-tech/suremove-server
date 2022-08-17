const mongoose = require("mongoose");

const cancelledBooking = new mongoose.Schema(
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const CancelledBooking = mongoose.model("cancelledBooking", cancelledBooking);

module.exports = CancelledBooking;
