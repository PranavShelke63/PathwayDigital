const express = require('express');
const cartController = require('../controllers/cartController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// Protect all cart routes - require authentication
router.use(protect);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/items', cartController.addToCart);

// Update cart item quantity
router.patch('/items', cartController.updateCartItem);

// Remove item from cart
router.delete('/items/:productId', cartController.removeFromCart);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router; 