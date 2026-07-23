const User = require('../models/User');
const { generateToken, sendErrorResponse, sendSuccessResponse, validateEmail, validatePhoneNumber, storeOtp, verifyOtp } = require('../utils/helpers');
const { generateOtp, sendOtp } = require('../services/smsService');

const register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, language } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return sendErrorResponse(res, 400, 'All fields are required');
    }

    if (password !== confirmPassword) {
      return sendErrorResponse(res, 400, 'Passwords do not match');
    }

    if (!validateEmail(email)) {
      return sendErrorResponse(res, 400, 'Invalid email format');
    }

    if (!validatePhoneNumber(phone)) {
      return sendErrorResponse(res, 400, 'Invalid phone number');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return sendErrorResponse(res, 409, 'User already exists');
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      language: language || 'en',
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    return sendSuccessResponse(res, 201, 'User registered successfully', {
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return sendErrorResponse(res, 500, 'Registration failed');
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return sendErrorResponse(res, 400, 'Phone number and password are required');
    }

    // Find user by phone
    const user = await User.findOne({ phone }).select('+password');
    if (!user) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    return sendSuccessResponse(res, 200, 'Login successful', {
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendErrorResponse(res, 500, 'Login failed');
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    return sendSuccessResponse(res, 200, 'Profile retrieved', user);
  } catch (error) {
    console.error('Profile error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve profile');
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, gender, address, language } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (address) updateData.address = address;
    if (language) updateData.language = language;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

    return sendSuccessResponse(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    console.error('Update profile error:', error);
    return sendErrorResponse(res, 500, 'Failed to update profile');
  }
};

const loginAbha = async (req, res) => {
  try {
    const { abhaId, password } = req.body;

    if (!abhaId || !password) {
      return sendErrorResponse(res, 400, 'ABHA ID and password are required');
    }

    // Clean ABHA ID (remove hyphens)
    const cleanAbhaId = abhaId.replace(/\D/g, '');

    // Find user by ABHA ID
    const user = await User.findOne({ abhaId: cleanAbhaId }).select('+password');
    if (!user) {
      return sendErrorResponse(res, 401, 'Invalid ABHA ID or password');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Invalid ABHA ID or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    return sendSuccessResponse(res, 200, 'Login successful', {
      user: { id: user._id, email: user.email, name: user.name, role: user.role, abhaId: user.abhaId },
      token,
    });
  } catch (error) {
    console.error('ABHA Login error:', error);
    return sendErrorResponse(res, 500, 'Login failed');
  }
};

/**
 * POST /auth/send-otp
 * Sends a 6-digit OTP to the given phone number.
 * The phone must belong to an existing user (prevents OTP enumeration on new numbers).
 *
 * Body: { phone: "9876543210" }
 */
const sendOtpController = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return sendErrorResponse(res, 400, 'Phone number is required');
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10); // last 10 digits

    if (!/^\d{10}$/.test(cleanPhone)) {
      return sendErrorResponse(res, 400, 'Phone must be a valid 10-digit Indian number');
    }

    // Check user exists — return identical message either way to prevent enumeration
    const user = await User.findOne({ phone: cleanPhone });

    const otp = generateOtp();
    storeOtp(cleanPhone, otp);

    // Only send SMS if user actually exists
    const responsePayload = { expiresIn: 600 }; // 10 min TTL in seconds
    if (user) {
      const result = await sendOtp(cleanPhone, otp);
      // In dev / console mode, expose OTP in response body so devs can test without SMS credits
      if (result.devMode) {
        responsePayload.devOtp = otp; // ⚠️ only present when no SMS provider is configured
      }
    }

    return sendSuccessResponse(res, 200, 'If this number is registered, an OTP has been sent', responsePayload);
  } catch (error) {
    console.error('Send OTP error:', error);
    return sendErrorResponse(res, 500, 'Failed to send OTP');
  }
};

/**
 * POST /auth/verify-otp
 * Verifies the OTP and issues a JWT if correct.
 *
 * Body: { phone: "9876543210", otp: "123456" }
 */
const verifyOtpLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return sendErrorResponse(res, 400, 'Phone number and OTP are required');
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    const result = verifyOtp(cleanPhone, String(otp));
    if (!result.valid) {
      return sendErrorResponse(res, 401, result.reason);
    }

    // OTP valid — fetch user and issue JWT
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      return sendErrorResponse(res, 401, 'User not found');
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return sendSuccessResponse(res, 200, 'Login successful', {
      user: { id: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone },
      token,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return sendErrorResponse(res, 500, 'OTP verification failed');
  }
};

module.exports = { register, login, loginAbha, getProfile, updateProfile, sendOtpController, verifyOtpLogin };
