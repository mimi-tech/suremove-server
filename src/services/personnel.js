/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const { constants } = require("../configs");
const { personnel,usersAccount } = require("../models");
const { generalHelperFunctions } = require("../helpers");
const { EmailService } = require("../helpers/emailService");

/**
 * for creating company account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const createPersonnel = async (params) => {
  try {
    const {companyInfo, personnelEmail, companyId} = params;
    const keyCode = generalHelperFunctions.generateKey();
    const dateAndTime = generalHelperFunctions.generateDateTime();
    
  
    //check if the personnel is already existing
    const isPersonnelExisting = await personnel.findOne({
      email: personnelEmail,
    });

    if (isPersonnelExisting) {
      return {
        status: false,
        message: "This personnel have already been employed",
      };
    }
    
    //check if personnel has an account
    const isPersonnelAccountExisting = await usersAccount.findOne({
        email: personnelEmail,
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
      //send key to admin email

      const { status: EmailStatusCode } =
      await EmailService.sendEmailVerificationCode({
      user: isPersonnelAccountExisting.email,
      code: keyCode,
      name:isPersonnelAccountExisting.firstName
      });

      if(!EmailStatusCode){
      return {
        status: false,
        message: "Error occured while sending email to the personnel",
      };
      }

    //go ahead and create personnel account
    await personnel.create({
        personalAuthId:isPersonnelAccountExisting._id,
        email:personnelEmail,
        profileImageUrl:isPersonnelAccountExisting.profileImageUrl,
        username:isPersonnelAccountExisting.username,
        firstName:isPersonnelAccountExisting.firstName,
        lastName:isPersonnelAccountExisting.lastName,
        companyInfo:companyInfo,
        key:keyCode,
        companyId:companyId
        //issuedDate:dateAndTime
    });

    
    isPersonnelAccountExisting.whoAreYou = "admin";
    isPersonnelAccountExisting.save();

    return {
      key:keyCode,
      status: true,
      message: "Personnel account created successfully",
    };
  } catch (e) {
    console.log(e)
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
    const { page, companyId} = params;

    const pageCount = 15;

    if(companyId){
      const allPersonnel = await personnel.find({companyId: companyId})
      .limit(pageCount)
      .skip(pageCount * (page - 1)).sort({ createdAt: "asc" });
      

    return {
      status: true,
      data: allPersonnel,
    };
    }

    const allPersonnel = await personnel.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1)).sort({ createdAt: "asc" });
      

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
  const { personalAuthId, key, accountType } = params;
  try {
    //check if user is an admin
    if(accountType !== "admin"){
      return {
        status: false,
        message: "You don't have permission",
      };
    }
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
      const dayLeft = new Date().getDate() - personnels.issuedDate.getDate()
      if (dayLeft > 2){
        
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
 personnels.isActive = false;
 personnels.save();

 return {
   status: true,
   message: "Personnel account suspended successfully",
 };
    }

     //go ahead and unsuspend the account
     personnels.isActive = true;
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
