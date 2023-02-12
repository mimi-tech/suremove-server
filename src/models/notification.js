const mongoose = require("mongoose");

const notification = new mongoose.Schema(
  {
    message: {
        type: String,
        required: [true, "Message must be provided"],
      },

      accountType: {
        type: Array,
        required: [true, "accountType must be provided"],
      },

      postedBy: {
        type: Object,
        required: [true, "Message must be provided"],
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
     
      read: {
        type: Boolean,
        default: false
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Notification = mongoose.model("notification", notification);

module.exports = Notification;
