const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 8081; // Changed from 8080 to avoid conflict

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration (same as working test)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'likeshkanna74@gmail.com',
    pass: 'rvoueevkbdwtiizl'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// OTP storage (in-memory for simplicity)
const otpStorage = new Map();
const otpVerified = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
app.post('/api/otp/send', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const otp = generateOTP();
    
    // Send email
    await transporter.sendMail({
      from: {
        name: 'ScrapSail',
        address: 'likeshkanna74@gmail.com'
      },
      to: email,
      subject: 'ScrapSail OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #059669;">ScrapSail Verification</h2>
          <p>Dear user,</p>
          <p>Your ScrapSail verification code is:</p>
          <div style="background-color: #f0f9ff; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #059669; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">ScrapSail - Making recycling rewarding</p>
        </div>
      `,
      text: `Your ScrapSail verification code is: ${otp}. This code expires in 10 minutes.`
    });

    // Store OTP
    otpStorage.set(email, otp);
    otpVerified.set(email, false);

    console.log(`✅ OTP sent to ${email}: ${otp}`);

    res.json({
      success: true,
      message: `OTP sent to ${email}`,
      otp: otp // For testing - remove in production
    });

  } catch (error) {
    console.error('❌ Failed to send OTP:', error.message);
    res.status(500).json({
      success: false,
      message: `Failed to send OTP: ${error.message}`
    });
  }
});

// Verify OTP endpoint
app.post('/api/otp/verify', async (req, res) => {
  try {
    const { email, otp } = req.query;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const storedOtp = otpStorage.get(email);
    
    if (storedOtp && otp === storedOtp) {
      // OTP is valid
      otpStorage.delete(email);
      otpVerified.set(email, true);
      
      console.log(`✅ OTP verified for ${email}`);
      
      res.json({
        success: true,
        message: 'OTP verified successfully!'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP!'
      });
    }

  } catch (error) {
    console.error('❌ OTP verification failed:', error.message);
    res.status(500).json({
      success: false,
      message: `OTP verification failed: ${error.message}`
    });
  }
});

// Check verification status
app.get('/api/otp/status', (req, res) => {
  const { email } = req.query;
  
  res.json({
    email: email,
    verified: otpVerified.get(email) || false,
    hasOtp: otpStorage.has(email)
  });
});

// Test email connection
app.get('/api/otp/test-email', async (req, res) => {
  try {
    await transporter.verify();
    res.json({
      success: true,
      message: 'Email service is ready'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Email service error: ${error.message}`
    });
  }
});

// Simple pickup request endpoint (for testing)
app.post('/api/pickup/request', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!otpVerified.get(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email with OTP before submitting pickup request!'
      });
    }

    // Clear verification after successful submission
    otpVerified.delete(email);

    res.json({
      success: true,
      message: 'Pickup request submitted successfully!',
      pickupId: Date.now(),
      data: req.body
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to submit pickup request: ${error.message}`
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ScrapSail OTP Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ScrapSail OTP Server running on http://localhost:${PORT}`);
  console.log(`📧 Email service configured for: likeshkanna74@gmail.com`);
  console.log(`🧪 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/otp/test-email`);
  console.log(`   POST http://localhost:${PORT}/api/otp/send?email=likeshkanna74@gmail.com`);
  console.log(`   POST http://localhost:${PORT}/api/otp/verify?email=likeshkanna74@gmail.com&otp=123456`);
});

