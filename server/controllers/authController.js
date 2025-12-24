const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');
const { ApiResponse, ApiError, asyncHandler } = require('../utils/ApiResponse');

// Register user
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokenPair({
    id: user._id,
    email: user.email,
    role: user.role
  });

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Remove password from response
  user.password = undefined;

  res.status(201).json(
    new ApiResponse(201, {
      user,
      accessToken,
      refreshToken
    }, 'User registered successfully')
  );
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(401, 'Account has been deactivated');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokenPair({
    id: user._id,
    email: user.email,
    role: user.role
  });

  // Save refresh token and update last login
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  // Log admin login
  if (user.role === 'admin') {
    await AuditLog.create({
      admin: user._id,
      action: 'admin_login',
      targetType: 'System',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  // Remove sensitive data
  user.password = undefined;
  user.refreshToken = undefined;

  res.json(
    new ApiResponse(200, {
      user,
      accessToken,
      refreshToken
    }, 'Login successful')
  );
});

// Refresh token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new ApiError(401, 'Refresh token is required');
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Account has been deactivated');
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role
    });

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json(
      new ApiResponse(200, {
        accessToken,
        refreshToken: newRefreshToken
      }, 'Token refreshed successfully')
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
});

// Logout user
const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.refreshToken = null;
  await user.save();

  // Log admin logout
  if (user.role === 'admin') {
    await AuditLog.create({
      admin: user._id,
      action: 'admin_logout',
      targetType: 'System',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  res.json(new ApiResponse(200, null, 'Logout successful'));
});

// Get current user
const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, 'User profile retrieved successfully'));
});

// Update profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true, runValidators: true }
  );

  res.json(new ApiResponse(200, user, 'Profile updated successfully'));
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json(new ApiResponse(200, null, 'Password changed successfully'));
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword
};