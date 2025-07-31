const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { addProduct, getAllProducts, updateProduct, deleteProduct, getProductsByCategory } = require('../controller/productController.js');

// Protected admin routes (require authentication)
router.post("/", verifyToken, addProduct);
router.get("/", getAllProducts);
router.get("/:categoryName", getProductsByCategory);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router; 