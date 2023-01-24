const { Router } = require("express");
const { booking } = require("../controllers");
const { validate } = require("../middlewares");
const { booking: validator } = require("../validator");

const routes = Router();

routes.post(
  "/booking-account",
  validate(validator.bookingDetails),
  booking.bookingDetails
);

routes.post(
  "/cancel-booking",
  validate(validator.cancelBooking),
  booking.cancelBooking
);

routes.get(
  "/get-all-bookings",
  validate(validator.getAllBookings),
  booking.getAllBookings
);

routes.get(
  "/get-a-booking",
  validate(validator.getABooking),
  booking.getABooking
);

routes.post(
  "/customer-confirm-booking",
  validate(validator.customerConfirmBooking),
  booking.customerConfirmBooking
);

routes.post(
  "/driver-confirm-booking",
  validate(validator.driverConfirmBooking),
  booking.driverConfirmBooking
);
routes.delete(
  "/delete-awaiting-booking",
  validate(validator.deleteAwaitingBooking),
  booking.deleteAwaitingBooking
);

routes.get(
  "/get-awaiting-booking",
  validate(validator.getAwaitingBooking),
  booking.getAwaitingBooking
);

routes.post(
  "/calculate-booking-cost",
  validate(validator.calculateCost),
  booking.calculateCost
);

routes.put(
  "/update-booking",
  validate(validator.updateBooking),
  booking.updateBooking
);
routes.post(
  "/connect-driver",
  validate(validator.connectDriver),
  booking.connectDriver
);



module.exports = routes;
