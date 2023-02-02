const { Router } = require("express");
const authRoutes = require("./auth");
const usersRoutes = require("./users");
const bookingRoutes = require("./booking");
const companyRoutes = require("./company");
const driversRoutes = require("./drivers");
const personnelRoutes = require("./personnel");
const analysisRoutes = require("./analysis");
const commonsRoutes = require("./commons");

const { response } = require("../helpers");

const routes = Router();

routes.use("", authRoutes);
routes.use('/users', usersRoutes);
routes.use('/booking', bookingRoutes);
routes.use('/company', companyRoutes);
routes.use('/drivers', driversRoutes);
routes.use('/personnel', personnelRoutes);
routes.use('/analysis', analysisRoutes);
routes.use('/commons', commonsRoutes);

routes.use((_, res) => {
  response(res, { status: false, message: "Route not found" }, 404);
});

module.exports = routes;
