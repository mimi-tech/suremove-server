const { auth } = require("../services");
const { response } = require("../helpers");

const welcomeText = async (req, res) => {
  const data = await auth.welcomeText(req.form);
  return response(res, data);
};

const softMoveAccountRegistration = async (req, res) => {
  const data = await auth.softMoveAccountRegistration(req.form);
  return response(res, data);
};

const generalLogin = async (req, res) => {
  const data = await auth.generalLogin(req.form);
  return response(res, data);
};

const validateUserToken = async (req, res) => {
  const data = await auth.validateUserToken(req.form);
  return response(res, data);
};

const forgotPassword = async (req, res) => {
  const data = await auth.forgotPassword(req.form);
  return response(res, data);
};
const validateForgotPasswordCode = async (req, res) => {
  const data = await auth.validateForgotPasswordCode(req.form);
  return response(res, data);
};

const updatePassword = async (req, res) => {
  const data = await auth.updatePassword(req.form);
  return response(res, data);
};

const updateAccountData = async (req, res) => {
  const data = await auth.updateAccountData(req.form);
  return response(res, data);
}

const sendEmailVerificationCode = async (req, res) => {
  const data = await auth.sendEmailVerificationCode(req.form);
  return response(res, data);
};

const verifyEmailVerificationCode = async (req, res) => {
  const data = await auth.verifyEmailVerificationCode(req.form);
  return response(res, data);
};



module.exports = {
  welcomeText,
  softMoveAccountRegistration,
  generalLogin,
  validateUserToken,
  forgotPassword,
  validateForgotPasswordCode,
  updatePassword,
  updateAccountData,
  sendEmailVerificationCode,
  verifyEmailVerificationCode

};
