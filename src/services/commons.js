/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { constants } = require("../configs");
const { commons  } = require("../models");

/**
 * for fetching all commons
 * @param {Object} params  pageNumber params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
const getCommons  = async (params) => {
    try {
      const { page } = params;
  
      const pageCount = 15;
  
      const allCommons = await commons.find()
        .limit(pageCount)
        .skip(pageCount * (page - 1))
        .exec();
  
      if(allCommons){
        return {
          status: true,
          data: allCommons,
        };
      }
      return {
        status: false,
        message: "Couldn't get all commons",
      };
     
    } catch (e) {
      return {
        status: false,
        message: constants.SERVER_ERROR("ALL COMMONS"),
      };
    }
  };

  /**
 * for fetching all commons
 * @param {Object} params  pageNumber params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
const addCommons  = async (params) => {
    try {
      const { sizeRange, weightRange } = params;
  
    
  
      const allCommons = await commons.create({
        sizeRange:sizeRange,
        weightRange:weightRange
      });
        
  
      if(allCommons){
        return {
          status: true,
          data: allCommons,
        };
      }
      return {
        status: false,
        message: "Couldn't add common",
      };
     
    } catch (e) {
      return {
        status: false,
        message: constants.SERVER_ERROR("ADD COMMONS"),
      };
    }
  };

  
  module.exports = {
    getCommons,
    addCommons
  }