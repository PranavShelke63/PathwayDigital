const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/products'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

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

// Image upload endpoint
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  res.json({ status: 'success', data: { url: `uploads/products/${req.file.filename}` } });
});

module.exports = router;