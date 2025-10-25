const express = require('express');
const router = express.Router();
const OTPService = require('../services/otpService');
const EmailService = require('../services/emailService');

// @route   POST /api/otp/send
// @desc    Send OTP to email
// @access  Public
router.post('/send', async (req, res) => {
  try {
    const { email, type = 'pickup', userName = 'User' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const result = await OTPService.sendAndStoreOTP(email, type, userName);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        otp: result.otp // Will be null if email sent successfully
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// @route   POST /api/otp/verify
// @desc    Verify OTP
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { email, otp, type = 'pickup' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const isValid = await OTPService.verifyOTP(email, otp, type);
    
    if (isValid) {
      res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed. Please try again.'
    });
  }
});

// @route   GET /api/otp/test-email
// @desc    Test email service connection
// @access  Public
router.get('/test-email', async (req, res) => {
  try {
    const result = await EmailService.testConnection();
    
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email service test failed'
    });
  }
});

// @route   POST /api/otp/send-test-email
// @desc    Send test email
// @access  Public
router.post('/send-test-email', async (req, res) => {
  try {
    const { email, userName = 'Test User' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const result = await EmailService.sendOTPEmail(email, '123456', 'pickup', userName);
    
    res.json({
      success: result.success,
      message: result.message,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email'
    });
  }
});

module.exports = router;
