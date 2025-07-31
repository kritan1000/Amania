const express = require("express");
const {
  login,
  register,
  resetPassword,
  sendOtp,
  verifyOTP,
} = require("../controller/userAuthController.js");

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
module.exports = router;