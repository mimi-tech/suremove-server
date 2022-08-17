const { analysis } = require("../services");
const { response } = require("../helpers");

const getAllAnalysis = async (req, res) => {
  const data = await analysis.getAllAnalysis(req.form);
  return response(res, data);
}

const getCurrentMonth = async (req, res) => {
  const data = await analysis.getCurrentMonth(req.form);
  return response(res, data);
}

const getCurrentWeek = async (req, res) => {
  const data = await analysis.getCurrentWeek(req.form);
  return response(res, data);
}

const getCurrentYearBooking = async (req, res) => {
  const data = await analysis.getCurrentYearBooking(req.form);
  return response(res, data);
}

const getCurrentDailyBooking = async (req, res) => {
  const data = await analysis.getCurrentDailyBooking(req.form);
  return response(res, data);
}

const getUsersBooking = async (req, res) => {
  const data = await analysis.getUsersBooking(req.form);
  return response(res, data);
}

const getBookingAnalysisCount = async (req, res) => {
  const data = await analysis.getBookingAnalysisCount(req.form);
  return response(res, data);
}
module.exports = {
  getAllAnalysis,
  getCurrentMonth,
  getCurrentWeek,
  getCurrentYearBooking,
  getCurrentDailyBooking,
  getUsersBooking,
  getBookingAnalysisCount
  
};
