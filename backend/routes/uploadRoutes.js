const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.post('/image', uploadController.uploadImage);
router.delete('/image', uploadController.deleteImage);

module.exports = router; 