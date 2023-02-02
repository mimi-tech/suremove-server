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


module.exports = routes;
