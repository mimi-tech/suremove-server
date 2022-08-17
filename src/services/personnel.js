/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const { constants } = require("../configs");
const { personnel,usersAccount } = require("../models");
const { generalHelperFunctions } = require("../helpers");

/**
 * for creating company account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const createPersonnel = async (params) => {
  try {
    const {companyInfo, email } = params;
    const keyCode = generalHelperFunctions.generateKey();
    const dateAndTime = generalHelperFunctions.generateDateTime();
    

    //check if the personnel is already existing
    const isPersonnelExisting = await personnel.findOne({
      email: email,
    });

    if (isPersonnelExisting) {
      return {
        status: false,
        message: "This personnel have already been employed",
      };
    }
    
    //check if personnel has an account
    const isPersonnelAccountExisting = await usersAccount.findOne({
        email: email,
        isActive:true
      });
  
      if (!isPersonnelAccountExisting) {
        return {
          status: false,
          message: "This personnel does not have a valid account",
        };
      }

      if(isPersonnelAccountExisting.isEmailVerified != true){
        return {
            status: false,
            message: "This user email in not verified.",
          };
      }
      

    //go ahead and create personnel account
    await personnel.create({
        personalAuthId:isPersonnelAccountExisting._id,
        email:email,
        profileImageUrl:isPersonnelAccountExisting.profileImageUrl,
        username:isPersonnelAccountExisting.username,
        firstName:isPersonnelAccountExisting.firstName,
        lastName:isPersonnelAccountExisting.lastName,
        companyInfo:companyInfo,
        key:keyCode,
        issuedDate:dateAndTime
    });

    //send key to admin email

    isPersonnelAccountExisting.whoAreYou = "admin";
    isPersonnelAccountExisting.save();

    return {
      status: true,
      message: "Personnel account created successfully",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("CREATING PERSONNEL ACCOUNT"),
    };
  }
};

/**
 * for fetching all personnels
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllPersonnel = async (params) => {
  try {
    const { page } = params;

    const pageCount = 15;

    const allPersonnel = await personnel.findAll()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .exec();

    return {
      status: true,
      data: allPersonnel,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL PERSONNEL"),
    };
  }
};

/**
 * for fetching a PERSONNEL
 * @param {Object} params  company id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

const getAPersonnel = async (params) => {
  const { personalAuthId, key } = params;
  try {
    const personnels = await personnel.findOne({ personalAuthId: personalAuthId });

    if (!personnels) {
      return {
        status: false,
        message: "personnel not found",
      };
    }
    
    if(personnels.isActive === false){
      return {
        status: false,
        message: "You have been suspended. Please consult your head office",
      };
    }

    if(personnels.isKeyUsed === false){
      //check if key have expired
      const dateAndTime = generalHelperFunctions.generateDateTime();
      if (dateAndTime.getTime() > personnels.issuedDate.getTime()){
        return {
          status: false,
          data: "Your key have expired",
        };
      }

    //check if key is correct
    if(key != personnels.key){
      return {
        status: false,
        data: "Invalid key",
      };
    }
     personnels.isKeyUsed = true;
     await personnels.save();
    return {
      status: true,
      data: "Welcome to the admin",
    };


    }

    return {
      status: true,
      data: personnels,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING A PERSONNEL"),
    };
  }
};

/**
 * for deleting a personnel account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const deleteAPersonnel = async (params) => {
  try {
    const { personnelId } = params;

    //check if the user is already existing
    const isPersonnel = await personnel.findOne({
      _id: personnelId,
    });

    if (!isPersonnel) {
      return {
        status: false,
        message: "Personnel does not exist",
      };
    }

    //go ahead and delete the account
    await personnel.deleteOne({
      _id: personnelId,
    });
    const filter = { _id: isPersonnel.personalAuthId };

    await usersAccount.findOneAndUpdate(
      filter,
      { whoAreYou: "customer"},
      {
        new: true,
      }
    );


    return {
      status: true,
      message: "Personnel account deleted successfully",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("DELETING A PERSONNEL ACCOUNT"),
    };
  }
};

/**
 * for suspending a Personnel account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const suspendAPersonnel = async (params) => {
  try {
    const { personnelId, type } = params;

    //check if the user is already existing
    const personnels = await personnel.findOne({
      _id: personnelId,
    });

    if (!personnels) {
      return {
        status: false,
        message: "Personnel does not exist",
      };
    }
    if(type === "suspend"){
 //go ahead and suspend the account
 personnels.suspended = true;
 personnels.save();

 return {
   status: true,
   message: "Personnel account suspended successfully",
 };
    }

     //go ahead and unsuspend the account
     personnels.isActive = false;
     personnels.save();
 
     return {
       status: true,
       message: "Personnel account unsuspended successfully",
     };
   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("SUSPENDING A PERSONNEL ACCOUNT"),
    };
  }
};


/**
 * for creating company account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const createPersonnelNewKey = async (params) => {
  try {
    const {personnelId } = params;
    const keyCode = generalHelperFunctions.generateKey();
    const dateAndTime = generalHelperFunctions.generateDateTime();
    

    //check if the personnel is already existing
    const isPersonnelExisting = await personnel.findOne({
      _id: personnelId,
    });

    if (!isPersonnelExisting) {
      return {
        status: false,
        message: "This user have not been employed",
      };
    }
    

    //go ahead and create personnel account
    isPersonnelExisting.key = keyCode;
    isPersonnelExisting.issuedDate = dateAndTime;

    isPersonnelExisting.save();


    //send key to admin email

   
    return {
      status: true,
      message: "Personnel key created successfully",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("CREATING PERSONNEL KEY"),
    };
  }
};

module.exports = {
    createPersonnel,
    getAllPersonnel,
    getAPersonnel,
    deleteAPersonnel,
    suspendAPersonnel,
    createPersonnelNewKey
  
};
