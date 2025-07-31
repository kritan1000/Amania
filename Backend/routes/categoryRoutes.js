const express = require('express');
const router = express.Router();
const { getAllCategories, addCategory } = require('../controller/categoryController.js');
const verifyToken = require("../middleware/verifyToken");


// Protected admin routes (require authentication)
router.post("/", verifyToken, addCategory);
router.get("/", getAllCategories);

module.exports = router; 