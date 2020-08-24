const express = require("express");
const authController = require("../controllers/auth");
const authValidation = require("../controllers/auth-validation");
const router = express.Router();

router.get("/", authController.getIndex);
router.get("/auth/login", authController.getLogin); 
router.get("/auth/register", authController.getRegister);
router.get("/auth/forgot-password", authController.getForgotPassword);
router.get("/auth/reset-password", authController.getResetPassword);
router.get("/auth/accounts", authController.getAccounts); 
router.get("/auth/logs", authController.getLogs); 
router.get("/auth/account/:mode/:rowAcctId", authController.getAccount);
router.get("/auth/add-account", authController.getAddAccount);
router.get("/auth/edit-account", authController.getEditAccount);
router.get("/auth/userGroup", authController.getUserGroup);
router.get("/auth/iss-department", authController.getTeam);
router.get("/auth/dashboard", authController.getDashboard);
router.get("/auth/profile", authController.getProfile);
router.get("/auth/employee", authController.getEmployee);

router.post("/auth/login", authValidation.login, authController.postLogin);
router.post(
  "/auth/add-account",
  authValidation.addAccount,
  authController.postAddAccount
);
router.post(
  "/auth/edit-account",
  authValidation.editAccount,
  authController.postEditAccount
);
router.post(
  "/auth/forgot-password",
  authValidation.forgotPassword,
  authController.postForgotPassword
);
router.post(
  "/auth/reset-password",
  authValidation.resetPassword,
  authController.postResetPassword
);

router.post("/auth/logout", authController.postLogout);
router.post("/auth/email", authController.postEmail);
router.post("/auth/deactivate-account", authController.postDeactivateAccount);
router.post("/auth/delete-account", authController.postDeleteAccount);

module.exports = router;
