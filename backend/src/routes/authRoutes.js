const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, loginAbha, getProfile, updateProfile, sendOtpController, verifyOtpLogin } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRegister, validateLogin, validateAbhaLogin, validateSendOtp, validateVerifyOtp } = require('../middleware/validators');

const router = express.Router();

// Rate limiter for auth endpoints — 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many attempts, please try again after 15 minutes',
  },
});

// Stricter limiter for OTP send — 5 SMS per 15 minutes per IP to prevent abuse
const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many OTP requests. Please wait 15 minutes before trying again.',
  },
});

// Public routes (rate-limited + validated)
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/login-abha', authLimiter, validateAbhaLogin, loginAbha);

// OTP routes
router.post('/send-otp', otpSendLimiter, validateSendOtp, sendOtpController);
router.post('/verify-otp', authLimiter, validateVerifyOtp, verifyOtpLogin);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
