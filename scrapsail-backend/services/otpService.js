const { pool } = require('../config/database');
const EmailService = require('./emailService');

class OTPService {
  // Generate random 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via email using EmailService
  static async sendOTP(email, otp, type = 'pickup', userName = 'User') {
    try {
      const result = await EmailService.sendOTPEmail(email, otp, type, userName);
      
      if (result.success) {
        console.log(`✅ OTP sent successfully to ${email}`);
        return true;
      } else {
        console.log(`❌ Failed to send OTP to ${email}: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return false;
    }
  }

  // Store OTP in database
  static async storeOTP(email, otp, type = 'pickup') {
    try {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete any existing OTPs for this email and type
      await pool.execute(
        'DELETE FROM otps WHERE email = ? AND type = ?',
        [email, type]
      );

      // Insert new OTP
      await pool.execute(
        'INSERT INTO otps (email, otp, type, expiresAt) VALUES (?, ?, ?, ?)',
        [email, otp, type, expiresAt]
      );

      return true;
    } catch (error) {
      console.error('Error storing OTP:', error);
      return false;
    }
  }

  // Verify OTP
  static async verifyOTP(email, otp, type = 'pickup') {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM otps WHERE email = ? AND otp = ? AND type = ? AND expiresAt > NOW()',
        [email, otp, type]
      );

      if (rows.length > 0) {
        // Delete the used OTP
        await pool.execute(
          'DELETE FROM otps WHERE email = ? AND otp = ? AND type = ?',
          [email, otp, type]
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  }

  // Send and store OTP
  static async sendAndStoreOTP(email, type = 'pickup', userName = 'User') {
    try {
      const otp = this.generateOTP();
      
      // Store OTP in database
      const stored = await this.storeOTP(email, otp, type);
      if (!stored) {
        throw new Error('Failed to store OTP');
      }

      // Try to send email
      const emailSent = await this.sendOTP(email, otp, type, userName);
      
      return {
        success: true,
        otp: emailSent ? null : otp, // Return OTP if email failed
        message: emailSent ? 'OTP sent successfully via email' : 'OTP generated (email service not configured)'
      };
    } catch (error) {
      console.error('Error in sendAndStoreOTP:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Clean expired OTPs
  static async cleanExpiredOTPs() {
    try {
      await pool.execute('DELETE FROM otps WHERE expiresAt < NOW()');
      return true;
    } catch (error) {
      console.error('Error cleaning expired OTPs:', error);
      return false;
    }
  }
}

module.exports = OTPService;

