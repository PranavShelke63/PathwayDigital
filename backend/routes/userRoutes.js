const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../controllers/authController');

// Protected routes (admin only)
router.use(protect);
router.get('/', userController.getAllUsers);

module.exports = router; 