const { users } = require("../services");
const { response } = require("../helpers");

const deleteAUser = async (req, res) => {
  const data = await users.deleteAUser(req.form);
  return response(res, data);
}

const blockAndUnblockUser = async (req, res) => {
  const data = await users.blockAndUnblockUser(req.form);
  return response(res, data);
}

const getAllUsers = async (req, res) => {
  const data = await users.getAllUsers(req.form);
  return response(res, data);
}

const getAUser = async (req, res) => {
  const data = await users.getAUser(req.form);
  return response(res, data);
}

const updatePhoneNumber = async (req, res) => {
  const data = await users.updatePhoneNumber(req.form);
  return response(res, data);
};

const updateWallet = async (req, res) => {
  const data = await users.updateWallet(req.form);
  return response(res, data);
};

const searchUsers = async (req, res) => {
  const data = await users.searchUsers(req.form);
  return response(res, data);
};


const getTransactionHistory = async (req, res) => {
  const data = await users.getTransactionHistory(req.form);
  return response(res, data);
};

const deleteATransaction = async (req, res) => {
  const data = await users.deleteATransaction(req.form);
  return response(res, data);
};

const getUserReferrals = async (req, res) => {
  const data = await users.getUserReferrals(req.form);
  return response(res, data);
};

const transferFund = async (req, res) => {
  const data = await users.transferFund(req.form);
  return response(res, data);
};

module.exports = {
  deleteAUser,
  blockAndUnblockUser,
  getAllUsers,
  getAUser,
  updatePhoneNumber,
  updateWallet,
  searchUsers,
  getTransactionHistory,
  deleteATransaction,
  getUserReferrals,
  transferFund
};
