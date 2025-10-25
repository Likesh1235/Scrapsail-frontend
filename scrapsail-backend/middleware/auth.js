const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Check if user exists and is active
const checkUser = async (req, res, next) => {
  try {
    const user = await UserService.findById(req.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (user.accountStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying user.'
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// Admin only
const adminOnly = authorize('admin');

// Collector only
const collectorOnly = authorize('collector');

// Admin or Collector
const adminOrCollector = authorize('admin', 'collector');

// User or Admin
const userOrAdmin = authorize('user', 'admin');

module.exports = {
  verifyToken,
  checkUser,
  authorize,
  adminOnly,
  collectorOnly,
  adminOrCollector,
  userOrAdmin
};
