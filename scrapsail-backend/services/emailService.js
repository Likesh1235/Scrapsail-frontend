const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  // Initialize SMTP transporter with app password
  initializeTransporter() {
    try {
      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
          process.env.EMAIL_USER === 'your-email@gmail.com' || 
          process.env.EMAIL_PASS === 'your-app-password') {
        console.log('⚠️  Email service not configured. Set EMAIL_USER and EMAIL_PASS in .env');
        return;
      }

      // Create transporter with Gmail SMTP
      this.transporter = nodemailer.createTransporter({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // App password, not regular password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      console.log('✅ Email service initialized successfully for likeshkanna74@gmail.com');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  // Test email connection
  async testConnection() {
    if (!this.transporter) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service is ready' };
    } catch (error) {
      return { success: false, message: `Email service error: ${error.message}` };
    }
  }

  // Send OTP email with professional template
  async sendOTPEmail(email, otp, type = 'pickup', userName = 'User') {
    if (!this.transporter) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const subject = this.getOTPSubject(type);
      const htmlContent = this.getOTPEmailTemplate(otp, type, userName);

      const mailOptions = {
        from: {
          name: 'ScrapSail',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: subject,
        html: htmlContent,
        text: `Your ScrapSail verification code is: ${otp}. This code expires in 10 minutes.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent to ${email}:`, result.messageId);
      
      return { 
        success: true, 
        messageId: result.messageId,
        message: 'OTP sent successfully' 
      };
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error);
      return { 
        success: false, 
        message: `Failed to send email: ${error.message}` 
      };
    }
  }

  // Get OTP subject based on type
  getOTPSubject(type) {
    const subjects = {
      'pickup': 'ScrapSail Pickup Verification Code',
      'withdrawal': 'ScrapSail Withdrawal Verification Code',
      'login': 'ScrapSail Login Verification Code',
      'registration': 'ScrapSail Account Verification Code'
    };
    return subjects[type] || 'ScrapSail Verification Code';
  }

  // Professional OTP email template
  getOTPEmailTemplate(otp, type, userName) {
    const actionText = this.getActionText(type);
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ScrapSail Verification</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #059669;
                margin-bottom: 10px;
            }
            .otp-container {
                background: linear-gradient(135deg, #059669, #10b981);
                color: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 5px;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 12px;
            }
            .warning {
                background-color: #fef3cd;
                border: 1px solid #fecaca;
                color: #92400e;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">♻️ ScrapSail</div>
                <p style="color: #666; margin: 0;">Making Recycling Rewarding</p>
            </div>
            
            <h2 style="color: #059669; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p>You requested a verification code to ${actionText}.</p>
            
            <div class="otp-container">
                <h3 style="margin: 0 0 10px 0;">Your Verification Code</h3>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; opacity: 0.9;">Valid for 10 minutes</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. ScrapSail will never ask for your verification code via phone or email.
            </div>
            
            <p>If you didn't request this verification code, please ignore this email or contact our support team.</p>
            
            <div class="footer">
                <p>This email was sent by ScrapSail - Smart Waste Management Platform</p>
                <p>© 2024 ScrapSail. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Get action text based on type
  getActionText(type) {
    const actions = {
      'pickup': 'schedule a waste pickup',
      'withdrawal': 'withdraw your carbon credits',
      'login': 'access your account',
      'registration': 'verify your account'
    };
    return actions[type] || 'complete your action';
  }

  // Send welcome email
  async sendWelcomeEmail(email, userName) {
    if (!this.transporter) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: {
          name: 'ScrapSail',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Welcome to ScrapSail!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #059669;">Welcome to ScrapSail, ${userName}!</h2>
            <p>Thank you for joining our mission to make recycling rewarding.</p>
            <p>Start earning carbon credits by scheduling your first waste pickup!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background-color: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
                Get Started
              </a>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, message: error.message };
    }
  }

  // Send pickup confirmation email
  async sendPickupConfirmation(email, pickupDetails) {
    if (!this.transporter) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: {
          name: 'ScrapSail',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Pickup Request Confirmed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #059669;">Pickup Request Confirmed!</h2>
            <p>Your waste pickup has been scheduled successfully.</p>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Pickup Details:</h3>
              <p><strong>Category:</strong> ${pickupDetails.wasteCategory}</p>
              <p><strong>Weight:</strong> ${pickupDetails.weight} kg</p>
              <p><strong>Address:</strong> ${pickupDetails.pickupAddress}</p>
              <p><strong>Scheduled Date:</strong> ${new Date(pickupDetails.scheduledDate).toLocaleString()}</p>
            </div>
            <p>Our collector will contact you before arriving. Thank you for contributing to a cleaner environment!</p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send pickup confirmation:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new EmailService();
