const express = require('express');
const quotationController = require('../controllers/quotationController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// Public route for creating quotations
router.post('/', quotationController.createQuotation);

// Protected route for getting all quotations (admin only)
router.get('/', protect, quotationController.getAllQuotations);

module.exports = router; 