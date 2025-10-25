#!/usr/bin/env node

/**
 * Send OTP to Multiple Users
 * Usage: node send-otp-batch.js
 */

const axios = require('axios');

// List of users to send OTP to
const users = [
  'likeshkanna708@gmail.com',
  'user1@gmail.com',
  'customer@yahoo.com',
  'someone@outlook.com',
  'test@example.com'
];

async function sendOtpToMultipleUsers() {
  console.log('📧 Sending OTPs to Multiple Users\n');
  console.log(`📬 From: ScrapSail <likeshkanna74@gmail.com>`);
  console.log(`📋 Recipients: ${users.length} users\n`);

  for (let i = 0; i < users.length; i++) {
    const email = users[i];
    console.log(`${i + 1}️⃣ Sending OTP to: ${email}`);

    try {
      const otpResponse = await axios.post('http://localhost:8081/api/otp/send', null, {
        params: { email: email }
      });

      if (otpResponse.data.success) {
        console.log(`✅ OTP sent successfully!`);
        console.log(`🔢 OTP Code: ${otpResponse.data.otp}`);
        console.log(`📬 Email sent to: ${email}`);
      } else {
        console.log(`❌ Failed to send OTP: ${otpResponse.data.message}`);
      }

    } catch (error) {
      console.log(`❌ Error sending to ${email}: ${error.message}`);
    }

    console.log(''); // Empty line for readability
    
    // Wait 1 second between emails to avoid rate limiting
    if (i < users.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('🎉 Batch OTP sending completed!');
  console.log('\n📋 Summary:');
  console.log(`   Total users: ${users.length}`);
  console.log(`   From: ScrapSail <likeshkanna74@gmail.com>`);
  console.log(`   All emails sent with professional ScrapSail branding`);
  console.log(`   Each OTP expires in 10 minutes`);
}

// Run the batch sending
sendOtpToMultipleUsers();
