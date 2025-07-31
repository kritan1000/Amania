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

// Category management routes (protected)
router.post("/categories", verifyToken, addCategory);
router.get("/categories", verifyToken, getAllCategories);

// Product management routes (protected)
router.post("/products", verifyToken, addProduct);
router.get("/products", verifyToken, getAllProducts);
router.put("/products/:id", verifyToken, updateProduct);
router.delete("/products/:id", verifyToken, deleteProduct);

module.exports = router; 