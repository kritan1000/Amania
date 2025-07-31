const express = require('express');
const router = express.Router();
const db = require('../db');

// Test route
router.get('/', async (req, res) => {
  res.json({ message: 'Cart route working!' });
});

module.exports = router; 