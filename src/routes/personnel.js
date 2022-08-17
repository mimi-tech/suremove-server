const { Router } = require("express");
const { personnel } = require("../controllers");
const { validate } = require("../middlewares");
const { personnel: validator } = require("../validator");

const routes = Router();


routes.post(
  "/create-personnel-account",
  validate(validator.createPersonnel),
  personnel.createPersonnel
);

routes.get(
  "/get-all-personnel",
  validate(validator.getAllPersonnel),
  personnel.getAllPersonnel
);

routes.get(
  "/get-a-personnel",
  validate(validator.getAPersonnel),
  personnel.getAPersonnel
);

routes.delete(
  "/delete-a-personnel",
  validate(validator.deleteAPersonnel),
  personnel.deleteAPersonnel
);

routes.put(
  "/suspend-a-personnel",
  validate(validator.suspendAPersonnel),
  personnel.suspendAPersonnel
);

routes.put(
  "/create-personnel-new-key",
  validate(validator.createPersonnelNewKey),
  personnel.createPersonnelNewKey
);

module.exports = routes;
