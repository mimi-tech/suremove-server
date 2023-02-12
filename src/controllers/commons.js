const { commons } = require("../services");
const { response } = require("../helpers");

const addCommons = async (req, res) => {
  const data = await commons.addCommons(req.form);
  return response(res, data);
}

const getCommons = async (req, res) => {
    const data = await commons.getCommons(req.form);
    return response(res, data);
  }

  const createNotification = async (req, res) => {
    const data = await commons.createNotification(req.form);
    return response(res, data);
  }

  const getNotification = async (req, res) => {
    const data = await commons.getNotification(req.form);
    return response(res, data);
  }

  const deleteNotification = async (req, res) => {
    const data = await commons.deleteNotification(req.form);
    return response(res, data);
  }
  const support = async (req, res) => {
    const data = await commons.support(req.form);
    return response(res, data);
  }

  module.exports = {
    addCommons,
    getCommons,
    createNotification,
    getNotification,
    deleteNotification,
    support
  }
  