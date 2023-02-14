const { Router } = require("express");
const { users } = require("../controllers");
const { validate } = require("../middlewares");
const { users: validator } = require("../validator");

const routes = Router();

routes.delete(
  "/delete-account",
  validate(validator.deleteAUser),
  users.deleteAUser
);

routes.put(
  "/account-status",
  validate(validator.blockAndUnblockUser),
  users.blockAndUnblockUser
);

routes.get(
  "/get-all-users",
  validate(validator.getAllUsers),
  users.getAllUsers
);

routes.get(
  "/get-a-user",
  validate(validator.getAUser),
  users.getAUser
);

routes.put(
  "/update-phone-number",
  validate(validator.updatePhoneNumber),
  users.updatePhoneNumber
);

routes.put(
  "/update-wallet",
  validate(validator.updateWallet),
  users.updateWallet
);

routes.get(
  "/search-user",
  validate(validator.searchUsers),
  users.searchUsers
);

routes.get(
  "/get-transaction-history",
  validate(validator.getTransactionHistory),
  users.getTransactionHistory
);
routes.delete(
  "/delete-transaction-history",
  validate(validator.deleteATransaction),
  users.deleteATransaction
);
routes.get(
  "/get-user-referral",
  validate(validator.getUserReferrals),
  users.getUserReferrals
);
routes.post(
  "/transfer-fund",
  validate(validator.transferFund),
  users.transferFund
);


module.exports = routes;
