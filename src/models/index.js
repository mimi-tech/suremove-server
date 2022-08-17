/* eslint-disable global-require */

  module.exports = {
    usersAccount: require("./auth"),
    bookingCollection: require("./booking"),
    cancelledBooking: require("./cancelledBookings"),
    companies: require("./company"),
    drivers: require("./drivers"),
    ratings: require("./rating"),
    personnel: require("./personnel"),
    rejectedBooking: require("./rejectedBookings"),
    bookingAnalysis: require("./analysis"),
    yearly: require("./yearly"),
    monthly: require("./monthly"),
    weekly: require("./weekly"),
    daily: require("./daily"),
    awaitingBooking: require("./awaitingBooking"),
    history:require("./history"),
    refeeral:require("./refeeral"),
  };

 
  