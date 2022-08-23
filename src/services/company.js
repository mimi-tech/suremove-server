/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { constants } = require("../configs");
const { companies,usersAccount } = require("../models");
const { getAllDriversOfACompany,deleteADriverAccount,suspendADriver } = require("./drivers");

/**
 * for creating company account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const createCompany = async (params) => {
  try {
    const {companyName, owner, email, bykeCount, address, companyEmail } = params;

 //check if company owner has an account
 const isOwnerAccountExisting = await usersAccount.findOne({
  email: email,
  isActive:true
});

if (!isOwnerAccountExisting) {
  return {
    status: false,
    message: "This user does not have a valid account",
  };
}

//check if user has access to create company

if(isOwnerAccountExisting.whoAreYou !== "owner"){
  return {
    status: false,
    message: "You don't have access to create a company",
  };
}

if(isOwnerAccountExisting.isEmailVerified != true){
  return {
      status: false,
      message: "Your email in not verified.",
    };
}

 //if user is not owner
if(owner === false){
  const isCompanyOwnerAccountExisting = await usersAccount.findOne({
    email: companyEmail,
    isActive:true
  });

  if(isCompanyOwnerAccountExisting){
    if(isCompanyOwnerAccountExisting.isEmailVerified != true){
      return {
          status: false,
          message: "This user email in not verified.",
        };
  }

  //check if the company is already existing
  const isCompanyExisting = await companies.findOne({
    companyName: companyName,
  });

  if (isCompanyExisting) {
    return {
      status: false,
      message: "This name has already taken",
    };
  }

  //go ahead and create company account
  await companies.create({
    companyName: companyName,
    owner:owner,
    bykeCount:bykeCount,
    address:address,
    ownerId:isCompanyOwnerAccountExisting._id,
    email:isCompanyOwnerAccountExisting.email
  });
 
 
  isCompanyOwnerAccountExisting.whoAreYou = "company";
  isCompanyOwnerAccountExisting.save();

  return {
    status: true,
    message: "Company created successfully",
  };

}else{
  return {
    status: false,
    message: "Couldn't find user with this email",
  };
}
}


    //check if the company is already existing
    const isCompanyExisting = await companies.findOne({
      companyName: companyName,
    });

    if (isCompanyExisting) {
      return {
        status: false,
        message: "This name has already taken",
      };
    }

    //go ahead and create company account
    await companies.create({
      companyName: companyName,
      owner:owner,
      bykeCount:bykeCount,
      address:address,
      ownerId:isOwnerAccountExisting._id,
      email:isOwnerAccountExisting.email
    });
   
   
    isOwnerAccountExisting.whoAreYou = "owner";
    isOwnerAccountExisting.save();


    return {
      status: true,
      message: "Company account successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: constants.SERVER_ERROR("CREATING COMPANY ACCOUNT"),
    };
  }
};

/**
 * for fetching all companies
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllCompanies = async (params) => {
  try {
    const { page } = params;

    const pageCount = 15;

    const allCompanies = await companies.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .exec();

    return {
      status: true,
      data: allCompanies,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL COMPANIES"),
    };
  }
};

/**
 * for fetching a company
 * @param {Object} params  company id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

const getACompany = async (params) => {
  const { companyId } = params;
  try {
    const company = await companies.findOne({ _id: companyId });

    if (!company) {
      return {
        status: false,
        message: "company not found",
      };
    }

    return {
      status: true,
      data: company,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING A COMPANY"),
    };
  }
};

/**
 * for deleting a company account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const deleteACompany = async (params) => {
  try {
    const { companyId } = params;

    //check if the user is already existing
    const company = await companies.findOne({
      _id: companyId,
    });

    if (!company) {
      return {
        status: false,
        message: "Company does not exist",
      };
    }

    //go ahead and delete the account
    await companies.deleteOne({
      _id: companyId,
    });
 
   const arrayOfDriversIds = [];

   //get the ids of the drivers working for this company

   const body = { companyId: companyId };
   const data = await getAllDriversOfACompany(body);
   if (data.status === true) {

     for(let i = 0; i < data.data.length; i++){

      arrayOfDriversIds.includes(data.data[i].authId)
     }
   }

    //remove all the drivers working for this company
    if(arrayOfDriversIds.length != 0){
    const promises = arrayOfDriversIds.map(async (data) => {
      const result = await deleteADriverAccount({data})
      if (result.status === false) {
          return result
      }
      return result;
  });
  const response = await Promise.all(promises);
  return response;
}
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("DELETING A COMPANY ACCOUNT"),
    };
  }
};

/**
 * for suspending a company account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const suspendACompany = async (params) => {
  try {
    const { companyId, type } = params;
    const arrayOfDriversIds = [];
    //check if the user is already existing
    const company = await companies.findOne({
      _id: companyId,
    });

    if (!company) {
      return {
        status: false,
        message: "Company does not exist",
      };
    }
    if(type === "suspend"){
 //go ahead and suspend the account
 company.suspended = true;
 company.save();
 //get the ids of the drivers working for this company

const body = { companyId: companyId };
const data = await getAllDriversOfACompany(body);
if (data.status === true) {

  for(let i = 0; i < data.data.length; i++){

   arrayOfDriversIds.includes(data.data[i].authId)
  }
}
 //suspend all the drivers working for this company
 if(arrayOfDriversIds.length != 0){
 const promises = arrayOfDriversIds.map(async (data) => {
   const result = await suspendADriver({data,type})
   if (result.status === false) {
       return result
   }
   return result;
});
const response = await Promise.all(promises);
return response;

}}

     //go ahead and unsuspend the account
     company.suspended = false;
     company.save();
 //get the ids of the drivers working for this company

const body = { companyId: companyId };
const data = await getAllDriversOfACompany(body);
if (data.status === true) {

  for(let i = 0; i < data.data.length; i++){

   arrayOfDriversIds.includes(data.data[i].authId)
  }
}
 //suspend all the drivers working for this company
 if(arrayOfDriversIds.length != 0){
 const promises = arrayOfDriversIds.map(async (data) => {
   const result = await suspendADriver({data,type})
   if (result.status === false) {
       return result
   }
   return result;
});
const response = await Promise.all(promises);
return response;
}
   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("SUSPENDING A COMPANY ACCOUNT"),
    };
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getACompany,
  deleteACompany,
  suspendACompany
  
};
