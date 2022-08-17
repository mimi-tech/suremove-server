const { Router } = require("express");
const { analysis } = require("../controllers");
const { validate } = require("../middlewares");
const { analysis: validator } = require("../validator");

const routes = Router();

routes.get(
  "/get-all-analysis",
  validate(validator.getAllAnalysis),
  analysis.getAllAnalysis
);
routes.get(
  "/get-current-month-analysis",
  validate(validator.getCurrentMonth),
  analysis.getCurrentMonth
);
routes.get(
  "/get-current-week-analysis",
  validate(validator.getCurrentWeek),
  analysis.getCurrentWeek
);
routes.get(
  "/get-current-year-analysis",
  validate(validator.getCurrentYearBooking),
  analysis.getCurrentYearBooking
);
routes.get(
  "/get-daily-analysis",
  validate(validator.getCurrentDailyBooking),
  analysis.getCurrentDailyBooking
);
routes.get(
  "/get-user-booking",
  validate(validator.getUsersBooking),
  analysis.getUsersBooking
);

routes.get(
  "/get-booking-count",
  validate(validator.getBookingAnalysisCount),
  analysis.getBookingAnalysisCount
);

module.exports = routes;
