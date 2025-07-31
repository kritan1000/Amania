/**
 * Admin Routes
 * Defines all admin-related API endpoints with authentication middleware
 */

const express = require("express");
const router = express.Router();
const {
  adminLogin,
  addCategory,
  getAllCategories,
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("./adminController");
const verifyToken = require("../middleware/verifyToken");

// Admin authentication routes
router.post("/login", adminLogin);

module.exports = router; 