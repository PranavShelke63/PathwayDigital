const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../controllers/authController');

// Public routes
router
  .route('/')
  .get(productController.getAllProducts);

router
  .route('/:id')
  .get(productController.getProduct);

// Protected routes (admin only)
router
  .route('/')
  .post(protect, productController.createProduct);

router
  .route('/:id')
  .patch(protect, productController.updateProduct)
  .delete(protect, productController.deleteProduct);

module.exports = router;