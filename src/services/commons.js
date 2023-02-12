/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { constants } = require("../configs");
const { commons, notification, usersAccount  } = require("../models");
const { generalHelperFunctions } = require("../helpers");

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
      const { sizeRange, weightRange,contributorId,ownerId} = params;
  
      //check if collection exist 

      const doc = await commons.exists();
      if(!doc){
  
      const allCommons = await commons.create({
        sizeRange:sizeRange,
        weightRange:weightRange,
        contributorId:contributorId,
        ownerId:ownerId
      });
        
  
      if(allCommons){
        return {
          status: true,
          data: allCommons,
          message:"Commons added successfully"
        };
      }
      return {
        status: false,
        message: "Couldn't add common",
      };
    }
    //update common
    
   var updateData = await commons.updateOne({
      sizeRange:sizeRange,
      weightRange:weightRange,
      contributorId:contributorId,
      ownerId:ownerId
    
    });
      if(updateData) {
        return {
          status: true,
          message:"Commons updated successfully"
        };
      }
      
      return {
        status: false,
        message:"Error updating commons"
      };

    } catch (e) {
      return {
        status: false,
        message: constants.SERVER_ERROR("ADD COMMONS"),
      };
    }
  };

  /**
 * for creating new notifications
 * @param {Object} params  message params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
  const createNotification  = async (params) => {
    try {
      
      const { message, accountType, authId} = params;
  
      const month = generalHelperFunctions.generateMonth();
      const year = generalHelperFunctions.generateYear();
      const week = generalHelperFunctions.generateWeek();
      const day = generalHelperFunctions.generateDay();
      const monthName = generalHelperFunctions.generateMonthName();
  
      const user = await usersAccount.findOne(
        { $and: [{ isActive: true }, { _id:authId }] });
      if(!user) {
        return {
          status: false,
          message:"Sorry you are not allowed to create a notification"
        };
      }
      const data = {
        "name": user.firstName + " " + user.lastName,
        "id":user._id,
      }

      const details = await notification.create({
        message:message,
        accountType:accountType,
        month:month,
        year:year,
        day:day,
        week:week,
        monthName:monthName,
        postedBy:data
      })
  
      if(details){
        return {
          status: true,
          message:"Notification has been created",
          data:details
        };
      }
      return {
        status: false,
        message:"Sorry notification not created succssfully"
      };
    } catch (e) {
      console.error(e);
        return {
          status: false,
          message: constants.SERVER_ERROR("CREATEING NOTIFICATION"),
        };
      }
    }
  
/**
 * for getting a notification
 * @param {Object} params  pageNumber params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
const getNotification  = async (params) => {
  try {
    const { page } = params;

    const pageCount = 15;

    const allNotification = await notification.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .exec();

    if(allNotification){
      return {
        status: true,
        data: allNotification,
      };
    }
    return {
      status: false,
      message: "Couldn't get all notifications",
    };
   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL NOTIFICATION"),
    };
  }
};

/**
 * for deleting a notification
 * @param {Object} params  pageNumber params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
const deleteNotification  = async (params) => {
  try {
    const { notificationId, perWeek } = params;
    const week = generalHelperFunctions.generateWeek();
    const allNotification = await notification.exists()
      
    if(!allNotification){
      return {
        status: false,
        message:"No notification is available",
      };
    }
   
    if(perWeek === true){
      const details = await notification.deleteMany({week:week});
      if(details){
        return {
          status: true,
          message:"Notification deleted successfully for the week",
        };
      }
      return {
        status: false,
        message:"Notification deleted not successfully",
      };
    }

    const details = await notification.deleteOne({_id:notificationId});
    if(details){
      return {
        status: true,
        message:"Notification deleted successfully",
      };
    }
    return {
      status: false,
      message:"Notification deleted not successfully",
    };
   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL NOTIFICATION"),
    };
  }
};

  module.exports = {
    getCommons,
    addCommons,
    createNotification,
    getNotification,
    deleteNotification
  }