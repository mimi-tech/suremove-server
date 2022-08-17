const jwt = require("jsonwebtoken");
const { response } = require("../helpers");
const { auth } = require("../services");

//creates a list of non restricted endpoints
const nonRestrictedEndPoints = [
  "/",
  "/create-account",
  "/login",
  "/validate-user-token",
  "/forgotPassword",
  "/validate-forgot-password-code",
  "/update-password",
  
  
  
];


const restricted = [
  "/update-account-data",
  "/delete-account",
  "/account-status",
  "/get-all-users",
  "/get-a-user",
  "/update-phone-number",
  "/update-wallet",
  "/booking-account",
  "/cancel-booking",
  "/get-all-bookings",
  "/get-a-booking",
  "/create-company",
  "/get-all-companies",
  "/get-a-company",
  "/delete-a-company",
  "/suspend-company",
  "/create-driver-account",
  "/get-all-drivers",
  "/get-all-drivers-of-a-company",
  "/get-a-driver",
  "/delete-a-driver-account",
  "/suspend-a-driver",
  "/rate-a-driver",
  "/driver-status",
  "/create-personnel-account",
  "/get-all-personnel",
  "/get-a-personnel",
  "/delete-a-personnel",
  "/suspend-a-personnel",
  "/create-personnel-new-key",
  "/update-current-location",
  "/match-driver",
  "/driver-booking-decision",
  "/create-rejected-booking",
  "/get-all-rejected-booking",
  "/delete-rejected-booking",
  "/get-company-rejected-booking",
  "/customer-confirm-booking",
  "/driver-confirm-booking",
  "/booking-account",
  "/get-all-analysis",
  "/get-current-month-analysis",
  "/get-current-week-analysis",
  "/get-current-year-analysis",
  "/get-daily-analysis",
  "/get-user-booking",
  "/get-booking-count",
  "/get-awaiting-booking",
  "/delete-awaiting-booking",
  "/search-user",
  "/send-email-code",
  "/verify-email-code",
  "/get-transaction-history",
  "/delete-transaction-history",
  "/get-user-referral",
  "/calculate-booking-cost",
  "/update-booking"

];
const inServiceEndPoints = ["/get-church-user-in-app"];

module.exports = async (req, res, next) => {
  //forwards request without validation if is not restricted
  if (nonRestrictedEndPoints.includes(req.path)) {
    next();
  } else if (inServiceEndPoints.includes(req.path)) {
    jwt.sign({}, process.env.SECRET);
    try {
      jwt.verify(req.headers["x-access-token"], process.env.SECRET);
    } catch (error) {
      return response(
        res,
        { status: false, message: "Unauthorized Access!  " },
        401
      );
    }
    next();
  } else {
    //validates request if is restricted
    const token = req.headers.authorization;
    const body = { token: token };
    const data = await auth.validateUserToken(body);
    if (data.status === false) {
      return response(
        res,
        { status: false, message: "Unauthorized Access" },
        401
      );
    }
    req.authData = data.data;
    next();
  }
};
