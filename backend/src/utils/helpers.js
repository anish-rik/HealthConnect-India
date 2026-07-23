const jwt = require('jsonwebtoken');

// ── OTP Store ─────────────────────────────────────────────────────────────────
// In-memory TTL map: { phone -> { otp, expiresAt, attempts } }
// Fine for single-instance servers; swap to Redis for multi-instance deployments.

const OTP_TTL_MS = 10 * 60 * 1000;   // 10 minutes
const OTP_MAX_ATTEMPTS = 5;           // lockout after 5 wrong guesses

const _otpStore = new Map();

/**
 * Save an OTP for a phone number, replacing any existing entry.
 * @param {string} phone  10-digit Indian number
 * @param {string} otp    6-digit OTP
 */
function storeOtp(phone, otp) {
  _otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
}

/**
 * Verify an OTP for a phone number.
 * @returns {{ valid: boolean, reason?: string }}
 */
function verifyOtp(phone, inputOtp) {
  const entry = _otpStore.get(phone);

  if (!entry) {
    return { valid: false, reason: 'OTP not found. Please request a new OTP.' };
  }

  if (Date.now() > entry.expiresAt) {
    _otpStore.delete(phone);
    return { valid: false, reason: 'OTP has expired. Please request a new OTP.' };
  }

  if (entry.attempts >= OTP_MAX_ATTEMPTS) {
    _otpStore.delete(phone);
    return { valid: false, reason: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  if (entry.otp !== String(inputOtp)) {
    entry.attempts += 1;
    return { valid: false, reason: 'Incorrect OTP. Please try again.' };
  }

  // Correct — consume OTP (one-time use)
  _otpStore.delete(phone);
  return { valid: true };
}

/**
 * Purge expired OTP entries (call periodically if long-running).
 */
function purgeExpiredOtps() {
  const now = Date.now();
  for (const [phone, entry] of _otpStore.entries()) {
    if (now > entry.expiresAt) _otpStore.delete(phone);
  }
}

// Auto-purge every 15 minutes
setInterval(purgeExpiredOtps, 15 * 60 * 1000);

// ─────────────────────────────────────────────────────────────────────────────

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

const sendSuccessResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/; // Indian phone number format
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

module.exports = {
  generateToken,
  sendErrorResponse,
  sendSuccessResponse,
  validateEmail,
  validatePhoneNumber,
  storeOtp,
  verifyOtp,
  purgeExpiredOtps,
};
