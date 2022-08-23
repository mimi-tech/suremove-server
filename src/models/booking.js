const mongoose = require("mongoose");

const bookingCollection = new mongoose.Schema(
  {
    customerAuthId: {
        type: String,
        unique: true,
        required: [true, "sender must have id"],
      },

      driverAuthId: {
        type: String,
        required: [true, "Driver id must be provided"],
      },
      driverId: {
        type: String,
        required: [true, "driver must have id"],
      },

    sourceLatitude: {
      type: Number,
      required: [true, "Source latitude must be provided"],
    },

    sourceLogitude: {
      type: Number,
      required: [true, "Source logitude must be provided"],
    },

    destinationLatitude: {
        type: Number,
        required: [true, "destination latitude must be provided"],
      },
  
      destinationLogitude: {
        type: Number,
        required: [true, "destination logitude must be provided"],
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

      delivered: {
      type: Boolean,
      default: false,
    },

    confirmDelivery: {
      type: Boolean,
      default: false,
    },

    amount: {
      type: Number,
      required: [true, "Amount details must be provided"],
    },

    isPaymentSuccessful: {
      type: Boolean,
      default: false,
    },

    ongoing: {
        type: Boolean,
        default: true,
    },

    sourceAddress: {
      type: String,
    },

    destinationAddress: {
      type: String,
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
      
      cancelBooking: {
        type: Boolean,
        default:false
      },

      

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const BookingCollection = mongoose.model("bookingCollection", bookingCollection);

module.exports = BookingCollection;
