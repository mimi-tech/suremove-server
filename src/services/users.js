/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { constants } = require("../configs");
const { usersAccount,drivers,companies,personnel,history,refeeral  } = require("../models");
const { generalHelperFunctions } = require("../helpers");
const { EmailService } = require("../helpers/emailService");

/**
 * for deleting an account using the users ID
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const deleteAUser = async (params) => {
  try {
    const { authId,whoAreYou } = params;

    //check if the user is already existing
    const churchUser = await usersAccount.findOne({
      _id: authId,
    });

    if (!churchUser) {
      return {
        status: false,
        message: "User does not exist",
      };
    }

    //go ahead and delete the account
    await usersAccount.deleteOne({
      _id: authId,
    });
    
    switch(whoAreYou) {
      case "driver":
        await drivers.deleteOne({
          authId: authId,
        });
        break;
      case "admin":
        await personnel.deleteOne({
          personalAuthId: authId,
        });
        break;

      case "company":
        await companies.deleteOne({
          ownerID: authId,
        });
      break;
      default:
        return {
          status: true,
          message: "account deleted successfully",
        };
    }
    
     
    return {
      status: true,
      message: "account deleted successfully",
    };
    
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("DELETING CHURCH APP ACCOUNT"),
    };
  }
};

/**
 * for deleting an account using the users ID
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const blockAndUnblockUser = async (params) => {
  try {
    const { authId, type, accountId } = params;
 
    if(type === "deactivate"){
    //check if the user is already existing
    const user = await usersAccount.findOne({
      _id: authId,
    });

    if (!user) {
      return {
        status: false,
        message: "User does not exist",
      };
    }

    //go ahead and activate or deactivate the account
    if(user.inActive === true){
      user.inActive = false
      user.save();
      //check if the user is already a driver
      if(user.whoAreYou === "driver"){
        await drivers.findOneAndUpdate(
          { driverAuthId: authId},
          {isActive: false}
        );
    
      }
      return {
        status: true,
        data:user,
        message: "account de-activated successfully",
      };
    }
    user.inActive = true
    user.save();
     //check if the user is already a driver
     if(user.whoAreYou === "driver"){
      await drivers.findOneAndUpdate(
        { driverAuthId: authId},
        {isActive: true}
      );
  
    }
    return {
      status: true,
      data:user,
      message: "account activated successfully",
    };
  }

   //go ahead and block or unblock the account
    //check if the user is already existing
    const user = await usersAccount.findOne({
      _id: accountId,
    });

    if (!user) {
      return {
        status: false,
        message: "User does not exist",
      };
    }
   if(user.blocked === true){
    user.blocked = false
    user.save();
     //check if the user is already a driver
     if(user.whoAreYou === "driver"){
      await drivers.findOneAndUpdate(
        { driverAuthId: accountId},
        {isActive: true}
      );
  
    }
    return {
      status: true,
      message: "account unblocked successfully",
    };
  }
  user.blocked = true
  user.save();
  //check if the user is already a driver
  if(user.whoAreYou === "driver"){
    await drivers.findOneAndUpdate(
      { driverAuthId: accountId},
      {isActive: false}
    );

  }
  return {
    status: true,
    message: "account blocked successfully",
  };
   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("BLOCKING OR UNBLOCKING USER ACCOUNT"),
    };
  }
};


/**
 * for fetching all users
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getAllUsers = async (params) => {
  try {
    const { page } = params;

    const pageCount = 15;

    const allUsers = await usersAccount.find()
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .sort({ createdAt: "asc" });

     if(allUsers){
      return {
        status: true,
        data: allUsers,
      };
     }

    return {
      status: false,
      message:"Couldn't find any users",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL USERS"),
    };
  }
};

/**
 * for fetching a user
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

const getAUser = async (params) => {
  const { authId,email } = params;
  try {
    const user = await usersAccount.findOne(
      { $or: [{ email: email }, { _id:authId }] });

    if (!user) {
      return {
        status: false,
        message: "User not found",
      };
    }
//send emailCode to user email
    
const publicData = {
  id: user._id,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  phoneNumber: user.phoneNumber,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
  firstName: user.firstName,
  lastName: user.lastName,
  gender: user.gender,
  walletBalance: user.walletBalance,
  referralCount: user.referralCount,
  whoAreYou: user.whoAreYou,
  inActive:user.inActive,
  txnPin:user.txnPin,
  createdAt: user.createdAt,
  isOngoingBooking:user.isOngoingBooking
};
    return {
      status: true,
      data: publicData,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING A USER"),
    };
  }
};


/**
 * Update phone number endpoint
 * @param {Object} params email and phone number.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const updatePhoneNumber = async (params) => {
  try {
    const { newPhoneNumber, authId } = params;

    //check if phone number exist in the database

    const isPhoneNumberExisting = await usersAccount.findOne({
      phoneNumber: newPhoneNumber,
    });

    if (isPhoneNumberExisting) {
      return {
        status: false,
        message: "Phone number is existing.",
      };
    }
   

    //update date users phone number
    await usersAccount.updateOne(
      { id: authId },
      {
        phoneNumber: newPhoneNumber,
      }
    );

    return {
      status: true,
      message: "Phone number updated successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("UPDATE PHONE NUMBER"),
    };
  }
};

/**
 * Update users wallet endpoint
 * @param {Object} params amount, type and authId.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const updateWallet = async (params) => {
  try {
    const { amount, userAuthId, type, userEmail } = params;

    //check if user exist in the database
    const isUserExisting = await usersAccount.findOne(
      { $or: [{ _id: userAuthId, }, { email:userEmail }] });

    if (!isUserExisting) {
      return {
        status: false,
        message: "Account is not existing.",
      };
    }
    console.log(`wallet: ${isUserExisting.walletBalance }`)
   if(type === "fund"){
    
    isUserExisting.walletBalance = amount + isUserExisting.walletBalance;
    
    await isUserExisting.save();

    //check if a user is also a driver
    if(isUserExisting.whoAreYou === "driver"){
      const filter = { authId: userAuthId };
      const newAmount = isUserExisting.walletBalance + amount
      await drivers.findOneAndUpdate(
        filter,
        { walletBalance: newAmount},
        {
          new: true,
        }
      );
  
    }

    const addHistory = await history.create({
      amount: amount,
      sign:"+",
      transaction:"Fund",
      authId: userAuthId,
      date:new Date().toLocaleString()

    })
     
    if(addHistory){
      return {
        status: true,
        message: "Transaction successfully",
      };
    }
    return {
      status: false,
      message: "Error occurred",
    };
    
   }

   if(isUserExisting.walletBalance < amount){
    
    return {
      status: false,
      message: "Insufficient fund",
    };
   }

   isUserExisting.walletBalance -= amount;
   await isUserExisting.save();

   //check if a user is also a driver
   if(isUserExisting.whoAreYou === "driver"){
    const filter = { authId: userAuthId };
    const newAmount = isUserExisting.walletBalance - amount
    await drivers.findOneAndUpdate(
      filter,
      { walletBalance: newAmount},
      {
        new: true,
      }
    );

  }

  const addHistory = await history.create({
    amount: amount,
    sign:"-",
    transaction:"Withdrawal",
    authId: userAuthId,
    date:new Date().toLocaleString()

  })
   
  if(addHistory){
    return {
      status: true,
      message: "Transaction successfully",
    };
  }
   return {
     status: false,
     message: "An error occurred",
   };
   

    
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("UPDATE WALLET"),
    };
  }
};


/**
 * To get all users that are following a church.
 * @param {Object} params  payload
 * @returns {Promise<Object>} Contains status, and returns message
 */
 const searchUsers = async (params) => {
  
    try {
      const { page, searchQuery, accountType } = params;
  
      const pageCount = 15;
  
      const composedQuery = {
        whoAreYou: accountType,
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { firstName: { $regex: searchQuery, $options: "i" } },
        ],
      };
      const searchResult = await usersAccount.find(composedQuery)
        .limit(pageCount)
        .skip(pageCount * (page - 1))
        .sort({ createdAt: "desc" });
  
      return {
        status: true,
        message: "search was successful",
        data: searchResult,
      };
    } catch (e) {
      return {
        status: false,
        message: constants.SERVER_ERROR("SEARCH ALL USERS"),
      };
    }
  
  };






/**
 * for fetching all users transaction history
 * @param {Object} params  pageNumber params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getTransactionHistory  = async (params) => {
  try {
    const { authId, page } = params;

    const pageCount = 15;

    const allTransactions = await history.find({authId:authId})
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .sort({ date: "desc" });

    if(allTransactions){
      return {
        status: true,
        data: allTransactions,
      };
    }
    return {
      status: false,
      message: "Couldn't get all transactions history",
    };
   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL TRANSACTIONS"),
    };
  }
};


/**
 * for deleting a transaction history
 * @param {Object} params  historyId, user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const deleteATransaction = async (params) => {
  try {
    const { authId, historyId, clearAll} = params;
    
    if(clearAll === true){
       //go ahead and delete all transactions
    await history.deleteMany({
      authId: authId,
    });
    return {
      status: true,
      message: "All Transaction histories deleted successfully",
    };
    }

    //go ahead and delete the account
    await history.deleteOne({
      _id: historyId,
    });
    return {
      status: true,
      message: "Transaction history deleted successfully",
    };

  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("DELETING ALL TRANSACTIONS OR A TRANSACTION"),
    };
  }
}

/**
 * for fetching all users referrals history
 * @param {Object} params  pageNumber params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const getUserReferrals  = async (params) => {
  try {
    const { email, page } = params;

    const pageCount = 15;

    const allReferrals = await refeeral.find({email:email})
      .limit(pageCount)
      .skip(pageCount * (page - 1))
      .exec();

    if(allReferrals){
      return {
        status: true,
        data: allReferrals,
      };
    }
    return {
      status: false,
      message: "Couldn't get all referrals history",
    };
   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("ALL Referrals"),
    };
  }
};


/**
 * for transfering funds to another account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const transferFund = async (params) => {
  try {
    const { authId, recipientEmail, amount } = params;

    //check if the user is already existing
    const user = await usersAccount.findOne({
      _id: authId,
    });

    if (!user) {
      return {
        status: false,
        message: "User does not exist",
      };
    }

     //check if the recipient email is already existing
     const recipient = await usersAccount.findOne({
      email: recipientEmail,
    });

    if (!recipient) {
      return {
        status: false,
        message: "The recipient does not exist",
      };
    }
   //check if the user's wallet is sufficient
   if(user.walletBalance >= amount) {
    recipient.walletBalance += amount;
    recipient.save();
    user.walletBalance -= amount;
    user.save();

    //check if a user is also a driver
   if(user.whoAreYou === "driver"){
    const filter = { authId: authId};
    const newAmount = user.walletBalance - amount
    await drivers.findOneAndUpdate(
      filter,
      { walletBalance: newAmount},
      {
        new: true,
      }
    );

  }

//check if a recipient is also a driver
if(recipient.whoAreYou === "driver"){
  const filter = { driverAuthId: recipient._id };
  const newAmount = recipient.walletBalance + amount
  await drivers.findOneAndUpdate(
    filter,
    { walletBalance: newAmount},
    {
      new: true,
    }
  );

}


  await history.create({
    amount: amount,
    sign:"-",
    transaction:"Transfer",
    authId: authId,
    date:new Date().toLocaleString()

  })

   await history.create({
    amount: amount,
    sign:"+",
    transaction:"Transfer",
    authId: recipient._id ,
    date:new Date().toLocaleString()

  })
  return {
    status: true,
    message: "Transaction successful",
  };
   
}
    return {
      status: false,
      message: "Insufficient funds",
    };
   
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("SENDING EMAIL CODE"),
    };
  }
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
