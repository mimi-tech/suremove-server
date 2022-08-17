const mongoose = require("mongoose");

const bookingAnalysis = new mongoose.Schema(
  {
    authId: {
        type: String,
        unique: true,
        required: [true, "sender must have id"],
      },
      driverId: {
        type: String,
        required: [true, "driver must have id"],
      },

      companyId: {
        type: String,
        required: [true, "Company id is required"],
      },

      ownerId: {
        type: String,
        required: [true, "Company id is required"],
      },

      contributorId: {
        type: String,
        required: [true, "Company id is required"],
      },

    sourceAddress: {
      type: Number,
      required: [true, "Source latitude must be provided"],
    },

    destinationAddress: {
        type: Number,
        required: [true, "destination latitude must be provided"],
      },

    item: {
      type: Object,
      required: [true, "Items details must be provided"],
    },

    receiver: {
        type: Object,
        required: [true, "Receiver details must be provided"],
      },

      sender: {
        type: Object,
        required: [true, "Receiver details must be provided"],
      },

      driverInfo: {
        type: Object,
        required: [true, "Driver details must be provided"],
      },

    isPaymentSuccessful: {
      type: Boolean,
      default: true,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
    },

    month: {
      type: Number,
      required: [true, "Month is required"],
    },
    
    monthName: {
      type: String,
      required: [true, "Month name is required"],
    },

    week: {
      type: Number,
      required: [true, "Week is required"],
    },

    day: {
        type: Number,
        required: [true, "Day is required"],
    },

   totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    ownerAmount: {
      type: Number,
      required: [true, "Owner amount is required"],

    },

    driversAmount: {
        type: Number,

      },

    partnersAmount: {
        type: Number,
      },

    contributorAmount: {
        type: Number,
        required: [true, "contributors amount is required"],

      },

    companyDetails: {
        type: Object,
        required: [true, "Company details is required"],
      },

      distance: {
        type: Number,
        required: [true, "Distance is required"],
      },

      timeTaken: {
        type: String,
        required: [true, "Time taken is required"],
      },

      country: {
        type: String,
        required: [true, "Country is required"],
      },

      state: {
        type: String,
        required: [true, "State is required"],
      },

      methodOfPayment: {
        type: String,
        required: [true, "method Of Payment is required"],
      },
      
      companyDetails: {
        type: Object,
        required: [true, "Company details is required"],
      },

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const BookingAnalysis = mongoose.model("bookingAnalysis", bookingAnalysis);

module.exports = BookingAnalysis;
