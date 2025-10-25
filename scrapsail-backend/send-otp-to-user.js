#!/usr/bin/env node

/**
 * Send OTP to Any User Email
 * Usage: node send-otp-to-user.js user@example.com
 */

const axios = require('axios');

async function sendOtpToUser(email) {
  if (!email) {
    console.log('❌ Please provide an email address');
    console.log('Usage: node send-otp-to-user.js user@example.com');
    return;
  }

  console.log(`📧 Sending OTP from likeshkanna74@gmail.com to ${email}\n`);

  try {
    // Send OTP
    const otpResponse = await axios.post('http://localhost:8081/api/otp/send', null, {
      params: { email: email }
    });

    if (otpResponse.data.success) {
      console.log('✅ OTP sent successfully!');
      console.log(`📧 From: ScrapSail <likeshkanna74@gmail.com>`);
      console.log(`📬 To: ${email}`);
      console.log(`📧 Message: ${otpResponse.data.message}`);
      console.log(`🔢 OTP Code: ${otpResponse.data.otp}`);
      console.log(`\n📬 Check the inbox of ${email} for the OTP email!`);
      console.log(`\n🧪 To verify the OTP, use:`);
      console.log(`POST http://localhost:8081/api/otp/verify?email=${email}&otp=${otpResponse.data.otp}`);
      
      console.log(`\n📋 Email Details:`);
      console.log(`   Subject: ScrapSail OTP Verification`);
      console.log(`   From: ScrapSail <likeshkanna74@gmail.com>`);
      console.log(`   To: ${email}`);
      console.log(`   OTP: ${otpResponse.data.otp}`);
      console.log(`   Expires: 10 minutes`);
    } else {
      console.log('❌ Failed to send OTP:', otpResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 OTP server is not running. Please start it:');
      console.log('   cd scrapsail-backend');
      console.log('   node otp-server.js');
    }
  }
}

// Get email from command line argument
const email = process.argv[2];
sendOtpToUser(email);
