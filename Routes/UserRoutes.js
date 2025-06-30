const express = require('express');
 
const {
    getAllEmployee,
    saveAllEmployee,
} = require('../Controller/UserController');
 
const router = express.Router();
 
router.get('/employees', getAllEmployee);
 
 
module.exports = router;