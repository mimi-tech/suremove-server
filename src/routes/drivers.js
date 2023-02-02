const { Router } = require("express");
const { drivers } = require("../controllers");
const { validate } = require("../middlewares");
const { drivers: validator } = require("../validator");

const routes = Router();

routes.post(
  "/create-driver-account",
  validate(validator.createDriversAccount),
  drivers.createDriversAccount
);

routes.get(
  "/get-all-drivers",
  validate(validator.getAllDrivers),
  drivers.getAllDrivers
);

routes.get(
  "/get-all-drivers-of-a-company",
  validate(validator.getAllDriversOfACompany),
  drivers.getAllDriversOfACompany
);

routes.get(
  "/get-a-driver",
  validate(validator.getADriver),
  drivers.getADriver
);

routes.delete(
  "/delete-a-driver-account",
  validate(validator.deleteADriverAccount),
  drivers.deleteADriverAccount
);

routes.put(
  "/suspend-a-driver",
  validate(validator.suspendADriver),
  drivers.suspendADriver
);

routes.put(
  "/rate-a-driver",
  validate(validator.rateDriver),
  drivers.rateDriver
);

routes.put(
  "/driver-status",
  validate(validator.driverStatus),
  drivers.driverStatus
);

routes.put(
  "/update-current-location",
  validate(validator.updateDriversCurrentLocation),
  drivers.updateDriversCurrentLocation
);

routes.post(
  "/match-driver",
  validate(validator.matchDrivers),
  drivers.matchDrivers
);
routes.put(
  "/driver-booking-decision",
  validate(validator.driverBookingDecision),
  drivers.driverBookingDecision
);

routes.post(
  "/create-rejected-booking",
  validate(validator.createRejectedBooking),
  drivers.createRejectedBooking
);

routes.get(
  "/get-all-rejected-booking",
  validate(validator.getAllRejectedBooking),
  drivers.getAllRejectedBooking
);

routes.delete(
  "/delete-rejected-booking",
  validate(validator.deleteRejectedBooking),
  drivers.deleteRejectedBooking
);

routes.get(
  "/get-company-rejected-booking",
  validate(validator.getAllCompanyRejectedBooking),
  drivers.getAllCompanyRejectedBooking
);

routes.get(
  "/get-rating",
  validate(validator.getAllDriversRatings),
  drivers.getAllDriversRatings
);

routes.get(
  "/get-driver-booking-connection",
  validate(validator.getDriverBookingConnection),
  drivers.getDriverBookingConnection
);


module.exports = routes;
