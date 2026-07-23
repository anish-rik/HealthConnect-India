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
 * Accepts either a 10-digit phone number OR a 12-14 digit ABHA number.
 * Looks up the registered mobile, sends a 6-digit OTP to it.
 *
 * Body: { identifier: "9876543210" }  OR  { identifier: "412356789012" }
 * Response includes `phone` (masked) so the UI can show "OTP sent to ******3210".
 */
const sendOtpController = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return sendErrorResponse(res, 400, 'Phone number or ABHA ID is required');
    }

    const digits = identifier.replace(/\D/g, '');

    let user = null;

    if (digits.length === 10) {
      // Treat as phone number
      user = await User.findOne({ phone: digits });
    } else if (digits.length >= 12 && digits.length <= 14) {
      // Treat as ABHA ID (12 or 14 digits)
      user = await User.findOne({ abhaId: digits });
    } else {
      return sendErrorResponse(res, 400, 'Enter a valid 10-digit phone number or 12-14 digit ABHA ID');
    }

    const responsePayload = { expiresIn: 600 };

    if (user) {
      const cleanPhone = user.phone.replace(/\D/g, '').slice(-10);
      const otp = generateOtp();
      storeOtp(cleanPhone, otp);

      const result = await sendOtp(cleanPhone, otp);

      // Return masked phone so UI can show "OTP sent to ******3210"
      responsePayload.maskedPhone = `XXXXXX${cleanPhone.slice(-4)}`;
      responsePayload.phone = cleanPhone; // needed by frontend to call verify-otp

      if (result.devMode) {
        responsePayload.devOtp = otp; // ⚠️ only when no SMS provider configured
      }
    }
    // No user found — still return 200 with same message to prevent enumeration
    // but don't include phone/maskedPhone so the UI can gently indicate no match

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
