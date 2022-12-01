/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { constants } = require("../configs");
const { usersAccount,drivers,personnel,history,refeeral } = require("../models");
const { generalHelperFunctions } = require("../helpers");
const { EmailService } = require("../helpers/emailService");
/**
 * Display welcome text
 * @param {Object} params  no params.
 * @returns {Promise<Object>} Contains status, and returns message
 */
const welcomeText = async () => {
  try {
    return {
      status: true,
      message: "welcome to eazy move app authentication service",
    };
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("WELCOME TEXT"),
    };
  }
};

/**
 * for creating account for a user account.
 * @param {Object} params email, password, username, profileImageUrl.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const softMoveAccountRegistration = async (params) => {
  
  try {
    const { email, password, phoneNumber, username,profileImageUrl,
      firstName,lastName,gender,referralId, whoAreYou, txnPin
    } = params;
     let data = null;
    //check if  account is already registered
    const userAccount = await usersAccount.findOne({
      email: email,
    });

    if (userAccount) {
      return {
        status: false,
        message: "email already exist",
      };
    }

    //check if phone number is already registered
    const phoneNumberInUse = await usersAccount.findOne({
      phoneNumber: phoneNumber,
    });

    if (phoneNumberInUse) {
      return {
        status: false,
        message: "This phone number already exist",
      };
    }

    //check if user name is already registered
    const userNameInUse = await usersAccount.findOne({
      username: username,
    });

    if (userNameInUse) {
      return {
        status: false,
        message: "This username already exist",
      };
    }

    //encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    
   //check if user is uploading image
  //  if(profileImageUrl){
  //   const {status: getUploadStatus,  message: getUploadMessage, data:result } = await request(
  //     `${process.env.EAZYMOVE_UPLOAD_FILE}/upload-file`,
  //     "post",body
  //   );
    
  //   if (getUploadStatus === false) {
  //     return {
  //       status: getUploadStatus,
  //       message: getUploadMessage,
  //     };
  //   }
  //   data = result;
  //  }
   let referralUsername;
   if(referralId){
     //check if user name is already registered
     const referralUsername = await usersAccount.findOne({
      username: referralId,
    });

    if (!referralUsername) {
      return {
        status: false,
        message: "This refeeral does not exist",
      };
    }
    referralUsername.promoBalance += 100;
    referralUsername.referralCount +=1;
    await referralUsername.save();


    const addHistory = await history.create({
      amount: 100,
      sign:"+",
      transaction:"Referral",
      authId: referralUsername.id,
      date:new Date().toLocaleString()
  
    });

    if(!addHistory){
      return {
        status: false,
        message: "Couldn't update refeeral history"
      };
    }

    const addRefeeral = await refeeral.create({
      profileImageUrl: profileImageUrl,
      firstName:firstName,
      lastName:lastName,
      date:new Date().toLocaleString(),
      email: email,
    });
    if(!addRefeeral){
      return {
        status: false,
        message: "Couldn't create refeeral"
      };
    }
   }

    //create account
    const newUserAccount = await usersAccount.create({
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      profileImageUrl:data === null?profileImageUrl:data,
      username: username,
      firstName:firstName,
      lastName:lastName,
      gender:gender,
      referralId:!referralUsername ?"":referralUsername._id,
      whoAreYou:whoAreYou,
      txnPin:txnPin   
    });
  
    
    //send emailCode to user email
    
    const publicData = {
      id: newUserAccount._id,
      email: newUserAccount.email,
      isEmailVerified: newUserAccount.isEmailVerified,
      phoneNumber: newUserAccount.phoneNumber,
      username: newUserAccount.username,
      profileImageUrl: newUserAccount.profileImageUrl,
      firstName: newUserAccount.firstName,
      lastName: newUserAccount.lastName,
      gender: newUserAccount.gender,
      referralId: newUserAccount.referralId,
    };

    return {
      status: true,
      message: "Account created successfully",
      data: publicData,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("CREATING ACCOUNT"),
    };
  }
};



  /**
 * login any in app user
 * @param {Object} params  contains email, password and accountTypes.
 * @returns {Promise<Object>} Contains status, and returns message
 */
const generalLogin = async (params) => {
  try {
    const { email, password, phoneNumber } = params;

    const userExist = await usersAccount.findOne(
      { $or: [{ email: email }, { phoneNumber:phoneNumber }] });

    if (!userExist) {
      return {
        status: false,
        message: "incorrect credentials!",
      };
    }

    //extract and store existing encrypted user password
    const existingUserPassword = userExist.password;
    
    //validate incoming user password with existing password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUserPassword
    );

    if (!isPasswordCorrect) {
      return {
        status: false,
        message: "incorrect credentials",
      };
    }

    const {
      email: _email,
      phone,
      username,
      _id,
      isActive,
      whoAreYou
    } = userExist;

    const serializeUserDetails = {
     
      _email,
      phone,
      username,
      _id,
      isActive,
      whoAreYou
    };
   
    const accessToken = jwt.sign(serializeUserDetails, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const publicData = {
      id: userExist._id,
      email: userExist.email,
      isEmailVerified: userExist.isEmailVerified,
      phoneNumber: userExist.phoneNumber,
      username: userExist.username,
      profileImageUrl: userExist.profileImageUrl,
      firstName: userExist.firstName,
      lastName: userExist.lastName,
      gender: userExist.gender,
      walletBalance: userExist.walletBalance,
      referralCount: userExist.referralCount,
      whoAreYou: userExist.whoAreYou,
    };
    return {
      status: true,
      message: "success",
      token: accessToken,
      data: publicData,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("LOGIN"),
    };
  }}



/**
 * validates user token
 * @param {Object} params  contains email, password and roles.
 * @returns {Promise<Object>} Contains status, and returns message
 */
 const validateUserToken = async (params) => {
  try {
    const { token } = params;

    let loggedInUser;

    //verify jwt token
    const check = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return {
          status: false,
        };
      }

      loggedInUser = user;

      return {
        status: true,
      };
    });

    if (!check.status) {
      return {
        status: false,
        message: "Invalid Token",
      };
    }

    //fetch loggedinuser details
    const _user = await usersAccount.findOne({ email: loggedInUser._email });

    const {
      
      email,
      phoneNumber,
      username,
      _id,
      id,
      isEmailVerified,
    } = _user;

    const serializeUserDetails = {
      email,
      phoneNumber,
      username,
      isEmailVerified,
      _id,
      id,
    };

    return {
      status: true,
      message: "succes",
      data: serializeUserDetails,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("TOKEN VERIFICATION"),
    };
  }
};


/**
 * Forgot password endpoint
 * @param {Object} params email.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const forgotPassword = async (params) => {
  try {
    const { email } = params;

    //generate email code
    const emailCode = generalHelperFunctions.generateEmailCode();
    //check if email exist in the database

    const isEmailExisting = await usersAccount.findOne({
      email: email,
    });

    if (!isEmailExisting) {
      return {
        status: false,
        message: "Email not valid.",
      };
    }


    //send emailCode to user email
    const { status: EmailStatusCode } =
    await EmailService.sendEmailVerificationCode({
    user: isEmailExisting.email,
    code: emailCode,
    name:isEmailExisting.firstName
    });
  
    if(EmailStatusCode){
      // If email is existing; update new email code in the database for this user
      isEmailExisting.emailCode = emailCode;
      isEmailExisting.save();
      return {
        status: true,
        code: emailCode,
        message: "A code has been sent to your email successfully",
      };
    }

    
    

    return {
      status: false,
      message:"We couldn't send mail to your email. Please try again",
    };
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("FORGOT PASSWORD EMAIL CODE NOT SENT"),
    };
  }
};

/**
 * Verify Forgot password code endpoint
 * @param {Object} params email and code.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
const validateForgotPasswordCode = async (params) => {
  try {
    const { email, emailCode } = params;

    //check if email address is existing
    const isEmailExisting = await usersAccount.findOne({
      email: email,
    });

    if (!isEmailExisting) {
      return {
        status: false,
        message: "This email does not exist",
      };
    }
    //check if user forgot password code is valid
    const isEmailCodeValid = await usersAccount.findOne({
      email: email,
      emailCode: emailCode,
    });

    if (!isEmailCodeValid) {
      return {
        status: false,
        message: "invalid code",
      };
    }

    return {
      status: true,
      message: "Valid code",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR(
        "VALIDATE PASSWORD VERIFICATION ENDPOINT"
      ),
    };
  }
};

/**
 * Update password endpoint
 * @param {Object} params email and password.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
const updatePassword = async (params) => {
  try {
    const { email, password } = params;

    //encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update password
    await usersAccount.updateOne(
      { email: email },
      {
        password: hashedPassword,
      }
    );

    return {
      status: true,
      message: "Password updated successfully. You may now login",
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("UPDATE PASSWORD VERIFICATION ENDPOINT"),
    };
  }
};

/**
 * update a user account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const updateAccountData = async (params) => {
  try {
    const { authId, ...dataParams } = params;
    const accountToUpdate = await usersAccount.findOne({_id: authId});
    if (!accountToUpdate) {
      return {
        status: false,
        message: "Invalid user"
      }
    }
    accountToUpdate.gender = (dataParams.gender != undefined) ? dataParams.gender : accountToUpdate.gender;
    accountToUpdate.profileImageUrl = (dataParams.profileImageUrl != undefined) ? dataParams.profileImageUrl : accountToUpdate.profileImageUrl;
    accountToUpdate.firstName = (dataParams.firstName != undefined) ? dataParams.firstName : accountToUpdate.firstName;
    accountToUpdate.lastName = (dataParams.lastName != undefined) ? dataParams.lastName : accountToUpdate.lastName;
    accountToUpdate.whoAreYou = (dataParams.accountType != undefined) ? dataParams.accountType : accountToUpdate.whoAreYou;

    if(dataParams.updateUsername != undefined){
      //check if username is already existing",
      
      const isUserNameExisting = await usersAccount.findOne(
        { $and: [{ _id: accountToUpdate._id }, { username: dataParams.updateUsername }] });
  
  
      if (!isUserNameExisting) {
        return {
          status: false,
          message: "This username is already existing",
        };
      }
      accountToUpdate.username =  dataParams.updateUsername;

    }


    if(dataParams.updateEmail != undefined){
      //check if email is already existing",

      const isEmailExisting = await usersAccount.findOne(
        { $and: [{ _id: accountToUpdate._id }, {  email: dataParams.updateEmail }] });
  
  
      if (!isEmailExisting) {
        return {
          status: false,
          message: "This email is already existing",
        };
      }
      accountToUpdate.email =  dataParams.updateEmail;

    }

    accountToUpdate.email =  accountToUpdate.email;

    accountToUpdate.username = accountToUpdate.username;
    


    accountToUpdate.save()


   


    //check if the user is a driver account

    if(accountToUpdate.whoAreYou === "driver"){
      const driver = await drivers.findOne({authId:accountToUpdate._id})
       driver.email = accountToUpdate.email,
       driver.firstName = accountToUpdate.firstName,
       driver.lastName = accountToUpdate.lastName,
       driver.username = accountToUpdate.username,
       driver.profileImageUrl = accountToUpdate.profileImageUrl,

       await driver.save();
    }

    if(accountToUpdate.whoAreYou === "admin"){
      const personnels = await personnel.findOne({personalAuthId:accountToUpdate._id})
      personnels.email = accountToUpdate.email,
      personnels.firstName = accountToUpdate.firstName,
      personnels.lastName = accountToUpdate.lastName,
      personnels.username = accountToUpdate.username,
      personnels.profileImageUrl = accountToUpdate.profileImageUrl,

       await personnels.save();
    }


    return {
      status: true,
      message: "Account updated successfully"
    }
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("UPDATE ACCOUNT DATA"),
    };
  }
}



module.exports = {
  welcomeText,
  softMoveAccountRegistration,
  generalLogin,
  validateUserToken,
  forgotPassword,
  validateForgotPasswordCode,
  updatePassword,
  updateAccountData,
 
};


// {
//   "sourceLatitude": 5.5276,
//   "sourceLogitude": 7.0633,
//   "destinationLatitude": 5.79565,
//   "destinationLogitude": 7.03513,
//   "sourceAddress":"No 4b Amadi street Amakaohia",
//   "destinationAddress":"No 8a Oliver street Orji",
//   "driverId": "63029739eaa10e7942ff2dc5",
//   "driverInfo": {
//     "id": "63029739eaa10e7942ff2dc5",
//     "name": "Nnamdi John",
//     "profilePicture": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTywiWn38XSbvbDg4LgTT9orTjYy_CoWV90ZA&usqp=CAU",
//     "phoneNumber": "23488378373",
//     "gender": "Male"
//   },
//   "sender": {
//     "id": "6303465b7645bc355b3eea5e",
//     "name": "Kelvin Jane",
//     "profilePicture": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmZgywS7kBZLgz98cUMyFKSBLadef2gJxl9jNRXjI2pTguXCOHnVV9SIUgwp108plhtvQ&usqp=CAU",
//     "phoneNumber": "234808473473",
//     "gender": "Female",
//     "address": "Barcelona Spain"
//   },
//   "receiver": {
//     "name": "Monday",
//     "profilePicture": "Kenneth",
//     "phoneNumber": "234847834738",
//     "gender": "Male",
//     "address": "Barcelona Spain"
//   },
//   "item": {
//     "size": "16kg",
//     "number": 1,
//     "name": "mangoes"
//   },
//   "totalAmount": 76767,
//   "amount":8283,
//   "distance": 777,
//   "timeTaken": "8mins",
//   "country": "Nigeria",
//   "state": "Imo",
//   "methodOfPayment": "wallet",
//   "companyDetails": {
//     "id": "62ff5f4cc2b222f6cbfbdc47",
//     "name": "sureMove",
//     "owner": true
//   }
// }