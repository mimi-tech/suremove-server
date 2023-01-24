const { booking } = require("../services");
const { response } = require("../helpers");

const bookingDetails = async (req, res) => {
  const data = await booking.bookingDetails(req.form);
  return response(res, data);
}
const cancelBooking = async (req, res) => {
  const data = await booking.cancelBooking(req.form);
  return response(res, data);
}

const getAllBookings = async (req, res) => {
  const data = await booking.getAllBookings(req.form);
  return response(res, data);
}

const getABooking = async (req, res) => {
  const data = await booking.getABooking(req.form);
  return response(res, data);
}
const customerConfirmBooking = async (req, res) => {
  const data = await booking.customerConfirmBooking(req.form);
  return response(res, data);
}

const driverConfirmBooking = async (req, res) => {
  const data = await booking.driverConfirmBooking(req.form);
  return response(res, data);
}
const getAwaitingBooking = async (req, res) => {
  const data = await booking.getAwaitingBooking(req.form);
  return response(res, data);
}
const deleteAwaitingBooking = async (req, res) => {
  const data = await booking.deleteAwaitingBooking(req.form);
  return response(res, data);
}

const calculateCost = async (req, res) => {
  const data = await booking.calculateCost(req.form);
  return response(res, data);
}

const updateBooking = async (req, res) => {
  const data = await booking.updateBooking(req.form);
  return response(res, data);
}
const connectDriver = async (req, res) => {
  const data = await booking.connectDriver(req.form);
  return response(res, data);
}

module.exports = {
    bookingDetails,
    cancelBooking,
    getAllBookings,
    getABooking,
    customerConfirmBooking,
    driverConfirmBooking,
    getAwaitingBooking,
    deleteAwaitingBooking,
    calculateCost,
    updateBooking,
    connectDriver
};
