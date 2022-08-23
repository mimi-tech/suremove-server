const mongoose = require("mongoose");

const usersAccount = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "user must have email"],
    },

    password: {
      type: String,
      required: [true, "user must have a password"],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    profileImageUrl: {
      type: String,
    },

    username: {
      type: String,
      unique: true,
      required: [true, "user must have a username"],
    },

    firstName: {
      type: String,
      required: [true, "user must have a last name"],
    },

    lastName: {
      type: String,
      required: [true, "user must have first name"],
    },

    emailCode: {
      select: false,
      type: Number,
    },

    phoneNumberCode: {
      select: false,
      type: Number,
    },

    gender: {
      type: String,
      required: [true, "user must have a gender"],
    },

    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "user must have a phone number"],
    },

    isPhoneNumberVerified: {
      type: Boolean,
      default: false,
    },

    walletBalance: {
      type: Number,
      default: 0.0,
    },

    referralId: {
      type: String,
    },

    referralCount: {
      type: Number,
      default: 0,
    },

    inActive: {
      type: Boolean,
      default: true,
    },
    
    whoAreYou: {
      type: String,
      default: "customer",
    },

    isOngoingBooking: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: new Date()
    }

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UsersAccount = mongoose.model("usersAccount", usersAccount);

module.exports = UsersAccount;
