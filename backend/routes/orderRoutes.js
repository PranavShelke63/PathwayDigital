const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Create new order
router.post('/', orderController.createOrder);

// Get user's orders
router.get('/my-orders', orderController.getUserOrders);

// Get single order
router.get('/:id', orderController.getOrder);

// Update order status (admin only)
router.patch('/:id', orderController.updateOrderStatus);

// Get all orders (admin only)
router.get('/', orderController.getAllOrders);

// Delete order (admin only)
router.delete('/:id', orderController.deleteOrder);

module.exports = router; 