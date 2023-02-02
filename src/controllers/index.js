const { commons } = require("../models");

/* eslint-disable global-require */
module.exports = {
    auth: require("./auth"),
    users: require("./users"),
    booking: require("./booking"),
    company: require("./company"),
    drivers: require("./drivers"),
    personnel: require("./personnel"),
    analysis:require("./analysis"),
    commons:require("./commons")
  };
  