const { Router } = require("express");
const { commons } = require("../controllers");
const { validate } = require("../middlewares");
const { commons: validator } = require("../validator");

const routes = Router();

routes.post(
  "/add-commons",
  validate(validator.addCommons),
  commons.addCommons
);

routes.get(
  "/get-commons",
  validate(validator.getCommons),
  commons.getCommons
);

routes.post(
  "/create-notification",
  validate(validator.createNotification),
  commons.createNotification
);

routes.get(
  "/get-notification",
  validate(validator.getNotification),
  commons.getNotification
);

routes.delete(
  "/delete-notification",
  validate(validator.deleteNotification),
  commons.deleteNotification
);


module.exports = routes;
