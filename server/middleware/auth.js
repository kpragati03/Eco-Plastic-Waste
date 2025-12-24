const { verifyAccessToken } = require('../utils/jwt');
const { ApiError, asyncHandler } = require('../utils/ApiResponse');
const User = require('../models/User');

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Access token is required');
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid access token');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Insufficient permissions');
    }

    next();
  };
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Continue without authentication
    }
  }

  next();
});

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};