const mongoose = require("mongoose");

const drivers = new mongoose.Schema(
  {
    driverAuthId: {
        type: String,
        unique: true,
        required: [true, "Id must be provided"],
      },
      companyId: {
        type: String,
        required: [true, "company Id must be provided"],
      },

      firstName: {
        type: String,
        required: [true, "First name must be provided"],
      },

      lastName: {
        type: String,
        required: [true, "Last name must be provided"],
      },

      driverEmail: {
        type: String,
        unique:true,
        required: [true, "Email must be provided"],
      },

      driverUsername: {
        type: String,
        unique:true,
        required: [true, "Username must be provided"],
      },

      driverPhoneNumber: {
        type: String,
        unique:true,
        required: [true, "Phone number must be provided"],
      },

      gender: {
        type: String,
        required: [true, "Gender must be provided"],
      
      },

      profileImageUrl: {
        type: String,
        required: [true, "Picture must be provided"],
      
      },

      homeAddress: {
        type: String,
        required: [true, "Adrress must be provided"],
      
      },

      currentLocation: {
        type: String,
        
      },

      currentLocationLat: {
        type: Number,
        
      },

      currentLocationLog: {
        type: Number,
        
      },

      loc: {
        type: { type: String },
        coordinates: [Number],
        
      },

      lincense: {
        type: Object,
        required: [true, "Lincence must be provided"],
      },

      owner: {
        type: Boolean,
        default:true
      },

      companyId: {
        type: String,
        required: [true, "Comapny ID must be provided"],

      },

      companyName: {
        type: String,
        required: [true, "Comapny name must be provided"],

      },

      suspended: {
        type: Boolean,
        default:false
      },

      approved: {
        type: Boolean,
        default:false
      },

      year: {
        type: Number,

      },

      week: {
        type: Number,
      },
      month: {
        type: Number,
      },

      day: {
        type: Number,
      },

      onlineStatus: {
        type: Boolean,
        default: false
      },

      rating: {
        type: Number,
        default: 1.0
      },

      onTransit: {
        type: Boolean,
        default: false
      },

      walletBalance: {
        type: Number,
        default: 0.0
      },
      country: {
        type: String,
       
      },
      state: {
        type: String,
       
      },

      yearlyCount: {
        type: Number,
        default: 0
      },

      monthlyCount: {
        type: Number,
        default: 0
      },

      weeklyCount: {
        type: Number,
        default: 0
      },
      
      dailyCount: {
        type: Number,
        default: 0
      },

      dateAdded: {
        type: String,
        default: new Date().toLocaleString()
      }


  },
 
 
);

const Drivers = mongoose.model("drivers", drivers);
drivers.index({ "loc": "2dsphere" })
module.exports = Drivers;
