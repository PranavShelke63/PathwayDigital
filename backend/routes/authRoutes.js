const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

// Email verification routes
router.post('/verify-email', authController.verifyEmail);
router.post('/set-password', authController.setPassword);
router.post('/resend-verification', authController.resendVerificationEmail);

// Password reset routes
router.post('/resend-password-reset', authController.resendPasswordResetOTP);

// Protected routes
router.use(authController.protect);
router.patch('/updatePassword', authController.updatePassword);

module.exports = router; 