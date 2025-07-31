const express = require("express");
const {
  login,
  register,
  resetPassword,
  sendOtp,
  verifyOTP,
  forgotPassword,
  validateResetToken,
} = require("../controller/userAuthController.js");

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.get("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);
module.exports = router;