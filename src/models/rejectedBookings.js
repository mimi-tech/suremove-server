const mongoose = require("mongoose");

const rejectedBooking = new mongoose.Schema(
  {
    driverId: {
        type: String,
        unique: true,
        required: [true, "Id must be provided"],
      },

      firstName: {
        type: String,
        required: [true, "First name must be provided"],
      },

      lastName: {
        type: String,
        required: [true, "Last name must be provided"],
      },

      email: {
        type: String,
        unique:true,
        required: [true, "Email must be provided"],
      },

      profilePicure: {
        type: String,
        required: [true, "Picture must be provided"],
      
      },
      
      companyId: {
        type: String,
        required: [true, "Company id must be provided"],
      
      },

        phoneNumber: {
        type: String,
        unique:true,
        required: [true, "Phone number must be provided"],
      },

      companyInfo: {
        type: Object,
      },

      customerInfo: {
        type: Object,
      },

      date:{
        type:Date,
        default: new Date(),
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const RejectedBooking = mongoose.model("rejectedBooking", rejectedBooking);

module.exports = RejectedBooking;
