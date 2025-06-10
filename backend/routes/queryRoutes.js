const express = require('express');
const queryController = require('../controllers/queryController');
const { protect } = require('../controllers/authController');
const Query = require('../models/Query');

const router = express.Router();

// Public route for creating queries
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: name, email, subject, and message'
      });
    }

    // Email format validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }
    
    const query = await Query.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date()
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        query
      }
    });
  } catch (error) {
    console.error('Query creation error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: errors.join('. ')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while submitting your query. Please try again.'
    });
  }
});

// Protected route for getting all queries (admin only)
router.get('/', protect, queryController.getAllQueries);

module.exports = router; 