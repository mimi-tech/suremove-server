const { company } = require("../services");
const { response } = require("../helpers");

const createCompany = async (req, res) => {
  const data = await company.createCompany(req.form);
  return response(res, data);
}

const getAllCompanies = async (req, res) => {
  const data = await company.getAllCompanies(req.form);
  return response(res, data);
}

const getACompany = async (req, res) => {
  const data = await company.getACompany(req.form);
  return response(res, data);
}

const deleteACompany = async (req, res) => {
  const data = await company.deleteACompany(req.form);
  return response(res, data);
}

const suspendACompany = async (req, res) => {
  const data = await company.suspendACompany(req.form);
  return response(res, data);
}

module.exports = {
  createCompany,
  getAllCompanies,
  getACompany,
  deleteACompany,
  suspendACompany
   
};
