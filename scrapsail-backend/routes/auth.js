const express = require('express');
const UserService = require('../services/userService');
const OTPService = require('../services/otpService');
const EmailWhitelistService = require('../services/emailWhitelistService');
const { verifyToken, checkUser } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate role assignment (check whitelist for admin/collector)
    const isRoleValid = await EmailWhitelistService.validateRoleAssignment(email, role);
    if (!isRoleValid) {
      return res.status(403).json({
        success: false,
        message: `Email ${email} is not authorized for ${role} role. Please contact administrator.`
      });
    }

    // Create new user
    const user = await UserService.createUser({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed. Please try again.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await UserService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check role if provided
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This account is for ${user.role}s only.`
      });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Generate token
    const token = UserService.generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        carbonCredits: user.carbonCredits,
        totalRecycled: user.totalRecycled
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', verifyToken, checkUser, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
