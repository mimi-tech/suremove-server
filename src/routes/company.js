const { Router } = require("express");
const { company } = require("../controllers");
const { validate } = require("../middlewares");
const { company: validator } = require("../validator");

const routes = Router();


routes.post(
  "/create-company",
  validate(validator.createCompany),
  company.createCompany
);

routes.get(
  "/get-all-companies",
  validate(validator.getAllCompanies),
  company.getAllCompanies
);

routes.get(
  "/get-a-company",
  validate(validator.getACompany),
  company.getACompany
);

routes.delete(
  "/delete-a-company",
  validate(validator.deleteACompany),
  company.deleteACompany
);

routes.put(
  "/suspend-company",
  validate(validator.suspendACompany),
  company.suspendACompany
);

module.exports = routes;
