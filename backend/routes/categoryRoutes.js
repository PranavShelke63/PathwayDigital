const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

// GET all, POST new
router.route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

// PUT, DELETE by id
router.route('/:id')
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router; 