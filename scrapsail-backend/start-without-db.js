const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory OTP storage for mock mode
const otpStorage = new Map();

// Email OTP Service
class EmailOTPService {
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(email, otp, type = 'pickup') {
    try {
      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
          process.env.EMAIL_USER === 'your-email@gmail.com' || 
          process.env.EMAIL_PASS === 'your-app-password') {
        console.log(`📧 Mock OTP for ${email}: ${otp}`);
        return { success: true, mock: true };
      }

      // Create transporter based on email provider
      const transporter = this.createTransporter(email);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `ScrapSail ${type.charAt(0).toUpperCase() + type.slice(1)} Verification Code`,
        html: this.getEmailTemplate(otp, type)
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Real OTP sent to ${email}: ${otp}`);
      return { success: true, mock: false };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      console.log(`📧 Fallback Mock OTP for ${email}: ${otp}`);
      return { success: true, mock: true, error: error.message };
    }
  }

  static createTransporter(email) {
    const emailProvider = this.detectEmailProvider(email);
    
    switch (emailProvider) {
      case 'gmail':
        return nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      
      case 'outlook':
        return nodemailer.createTransporter({
          service: 'hotmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      
      case 'yahoo':
        return nodemailer.createTransporter({
          service: 'yahoo',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      
      default:
        return nodemailer.createTransporter({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
    }
  }

  static detectEmailProvider(email) {
    const domain = email.split('@')[1].toLowerCase();
    
    if (domain.includes('gmail') || domain.includes('googlemail')) {
      return 'gmail';
    } else if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) {
      return 'outlook';
    } else if (domain.includes('yahoo')) {
      return 'yahoo';
    }
    
    return 'custom';
  }

  static getEmailTemplate(otp, type) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ScrapSail Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🌱 ScrapSail</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Making Recycling Rewarding</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 24px;">Verification Code</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Your verification code for ${type} request is:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 2px solid #0ea5e9; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #0c4a6e; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">
                ⏰ This code will expire in <strong>10 minutes</strong>
              </p>
            </div>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #991b1b; margin: 0; font-size: 14px; font-weight: 500;">
                🔒 Never share this code with anyone. ScrapSail will never ask for your verification code.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If you didn't request this verification code, please ignore this email or contact our support team.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2024 ScrapSail. Making the world greener, one pickup at a time.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Mock OTP routes for testing without database
app.post('/api/otp/send', async (req, res) => {
  const { email, type = 'pickup' } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  try {
    // Generate OTP
    const otp = EmailOTPService.generateOTP();
    
    // Store OTP in memory (expires in 10 minutes)
    const expiresAt = Date.now() + (10 * 60 * 1000);
    otpStorage.set(email, { otp, type, expiresAt });
    
    // Send OTP via email
    const emailResult = await EmailOTPService.sendOTP(email, otp, type);
    
    res.json({
      success: true,
      message: emailResult.mock ? 
        'OTP sent successfully (mock mode - check console)' : 
        'OTP sent successfully to your email',
      mock: emailResult.mock,
      otp: emailResult.mock ? otp : undefined, // Include OTP for testing in mock mode
      expiresIn: '10 minutes',
      emailProvider: EmailOTPService.detectEmailProvider(email)
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/otp/verify', (req, res) => {
  const { email, otp, type = 'pickup' } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and OTP are required'
    });
  }

  try {
    // Check if OTP exists and is not expired
    const storedData = otpStorage.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this email. Please request a new OTP.'
      });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStorage.delete(email); // Clean up expired OTP
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    if (storedData.otp !== otp || storedData.type !== type) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // OTP is valid - remove it from storage (one-time use)
    otpStorage.delete(email);
    
    res.json({
      success: true,
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Mock pickup route
app.post('/api/pickup', (req, res) => {
  const pickupData = req.body;
  
  console.log('📦 Mock pickup request received:', pickupData);
  
  res.json({
    success: true,
    message: 'Pickup request submitted successfully (mock mode)',
    pickupId: Math.floor(Math.random() * 10000)
  });
});

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStorage.entries()) {
    if (now > data.expiresAt) {
      otpStorage.delete(email);
      console.log(`🧹 Cleaned up expired OTP for ${email}`);
    }
  }
}, 5 * 60 * 1000); // 5 minutes

// Health check endpoint
app.get('/api/health', (req, res) => {
  const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS && 
                          process.env.EMAIL_USER !== 'your-email@gmail.com' && 
                          process.env.EMAIL_PASS !== 'your-app-password';
  
  res.json({ 
    status: 'OK', 
    message: 'ScrapSail Backend API is running',
    mode: emailConfigured ? 'production' : 'mock',
    database: 'not connected (mock mode)',
    emailService: emailConfigured ? 'configured' : 'mock mode',
    activeOTPs: otpStorage.size,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS && 
                          process.env.EMAIL_USER !== 'your-email@gmail.com' && 
                          process.env.EMAIL_PASS !== 'your-app-password';
  
  console.log(`🚀 ScrapSail Backend Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🗄️  Database: Not connected (mock mode)`);
  console.log(`📧 Email Service: ${emailConfigured ? '✅ Configured' : '⚠️  Mock mode'}`);
  
  if (emailConfigured) {
    console.log(`📧 Email Provider: ${process.env.EMAIL_USER}`);
    console.log(`✨ Real email OTPs will be sent!`);
  } else {
    console.log(`⚠️  To enable real email OTPs:`);
    console.log(`   1. Set EMAIL_USER and EMAIL_PASS in .env file`);
    console.log(`   2. Use App Password (not regular password)`);
    console.log(`   3. Restart the server`);
    console.log(`📧 Mock OTPs will be logged to console for testing`);
  }
});

module.exports = app;

