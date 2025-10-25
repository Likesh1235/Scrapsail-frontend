const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');
const crypto = require('crypto');

// Create transporter for sending emails (Gmail only)
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
      process.env.EMAIL_USER === 'your-email@gmail.com' || 
      process.env.EMAIL_PASS === 'your-app-password') {
    return null; // Email not configured
  }

  // Only support Gmail
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP to email
const sendOTP = async (req, res) => {
  try {
    const { email, type = 'pickup' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate Gmail format only
    const gmailRegex = /^[^\s@]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({ message: 'Only Gmail addresses (@gmail.com) are supported for OTP' });
    }

    // Generate OTP
    const otpCode = generateOTP();
    
    // Save OTP to database with 10-minute expiration
    const otpData = new OTP({
      email,
      otp: otpCode,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await otpData.save();

    // Create email transporter
    const transporter = createTransporter();

    // Check if email is configured
    if (!transporter) {
      // Email not configured - return OTP for testing
      console.log(`📧 OTP for ${email}: ${otpCode}`);
      return res.status(200).json({
        message: 'OTP generated successfully (Email not configured - check console)',
        email: email,
        otp: otpCode, // Include OTP in response for testing
        expiresIn: '10 minutes',
        note: 'Configure EMAIL_USER and EMAIL_PASS in .env to send real emails'
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'ScrapSail - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">♻️ ScrapSail</h1>
            <p style="color: white; margin: 5px 0 0 0;">Waste Management Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151; margin-bottom: 20px;">OTP Verification</h2>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Your One-Time Password (OTP) for pickup request verification is:
            </p>
            
            <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #10b981; font-size: 32px; letter-spacing: 5px; margin: 0; font-family: monospace;">
                ${otpCode}
              </h1>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This OTP is valid for <strong>10 minutes</strong> only.
            </p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>Security Note:</strong> Never share this OTP with anyone. ScrapSail will never ask for your OTP via phone or email.
              </p>
            </div>
          </div>
          
          <div style="background: #374151; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              © 2024 ScrapSail. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'OTP sent successfully',
      email: email,
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, type = 'pickup' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find valid OTP
    const otpData = await OTP.findOne({
      email,
      otp,
      type,
      expiresAt: { $gt: new Date() }
    });

    if (!otpData) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Delete used OTP
    await OTP.findByIdAndDelete(otpData._id);

    res.status(200).json({
      message: 'OTP verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
