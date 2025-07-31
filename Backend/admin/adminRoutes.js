const express = require("express");
const router = express.Router();
const {
  adminLogin,
} = require("./adminController.js");

// Admin authentication routes
router.post("/login", adminLogin);

module.exports = router; 