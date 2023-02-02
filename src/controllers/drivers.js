const { drivers } = require("../services");
const { response } = require("../helpers");

const createDriversAccount = async (req, res) => {
  const data = await drivers.createDriversAccount(req.form);
  return response(res, data);
}

const getAllDrivers = async (req, res) => {
  const data = await drivers.getAllDrivers(req.form);
  return response(res, data);
}

const getAllDriversOfACompany = async (req, res) => {
  const data = await drivers.getAllDriversOfACompany(req.form);
  return response(res, data);
}

const getADriver = async (req, res) => {
  const data = await drivers.getADriver(req.form);
  return response(res, data);
}

const deleteADriverAccount = async (req, res) => {
  const data = await drivers.deleteADriverAccount(req.form);
  return response(res, data);
};

const suspendADriver = async (req, res) => {
  const data = await drivers.suspendADriver(req.form);
  return response(res, data);
};

const rateDriver = async (req, res) => {
  const data = await drivers.rateDriver(req.form);
  return response(res, data);
};

const driverStatus = async (req, res) => {
  const data = await drivers.driverStatus(req.form);
  return response(res, data);
};
const matchDrivers = async (req, res) => {
  const data = await drivers.matchDrivers(req.form);
  return response(res, data);
};

const updateDriversCurrentLocation = async (req, res) => {
  const data = await drivers.updateDriversCurrentLocation(req.form);
  return response(res, data);
};

const driverBookingDecision = async (req, res) => {
  const data = await drivers.driverBookingDecision(req.form);
  return response(res, data);
};

const createRejectedBooking = async (req, res) => {
  const data = await drivers.createRejectedBooking(req.form);
  return response(res, data);
};

const getAllRejectedBooking = async (req, res) => {
  const data = await drivers.getAllRejectedBooking(req.form);
  return response(res, data);
};

const deleteRejectedBooking = async (req, res) => {
  const data = await drivers.deleteRejectedBooking(req.form);
  return response(res, data);
};

const getAllCompanyRejectedBooking = async (req, res) => {
  const data = await drivers.getAllCompanyRejectedBooking(req.form);
  return response(res, data);
};
const getAllDriversRatings = async (req, res) => {
  const data = await drivers.getAllDriversRatings(req.form);
  return response(res, data);
};

const getDriverBookingConnection = async (req, res) => {
  const data = await drivers.getDriverBookingConnection(req.form);
  return response(res, data);
};

module.exports = {
  createDriversAccount,
  getAllDrivers,
  getAllDriversOfACompany,
  getADriver,
  deleteADriverAccount,
  suspendADriver,
  rateDriver,
  driverStatus,
  matchDrivers,
  updateDriversCurrentLocation,
  driverBookingDecision,
  createRejectedBooking,
  getAllRejectedBooking,
  deleteRejectedBooking,
  getAllCompanyRejectedBooking,
  getAllDriversRatings,
  getDriverBookingConnection
};
