const { personnel } = require("../services");
const { response } = require("../helpers");

const createPersonnel = async (req, res) => {
  const data = await personnel.createPersonnel(req.form);
  return response(res, data);
}
const getAllPersonnel = async (req, res) => {
  const data = await personnel.getAllPersonnel(req.form);
  return response(res, data);
}

const getAPersonnel = async (req, res) => {
  const data = await personnel.getAPersonnel(req.form);
  return response(res, data);
}

const deleteAPersonnel = async (req, res) => {
  const data = await personnel.deleteAPersonnel(req.form);
  return response(res, data);
}

const suspendAPersonnel = async (req, res) => {
  const data = await personnel.suspendAPersonnel(req.form);
  return response(res, data);
}

const createPersonnelNewKey = async (req, res) => {
  const data = await personnel.createPersonnelNewKey(req.form);
  return response(res, data);
}

module.exports = {
  createPersonnel,
  getAllPersonnel,
  getAPersonnel,
  deleteAPersonnel,
  suspendAPersonnel,
  createPersonnelNewKey
};
