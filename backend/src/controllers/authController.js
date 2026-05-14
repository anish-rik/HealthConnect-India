const User = require('../models/User');
const { generateToken, sendErrorResponse, sendSuccessResponse, validateEmail, validatePhoneNumber } = require('../utils/helpers');

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
    const { email, password } = req.body;

    if (!email || !password) {
      return sendErrorResponse(res, 400, 'Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
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

module.exports = { register, login, getProfile, updateProfile };
