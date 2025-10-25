#!/usr/bin/env node

/**
 * Interactive OTP Sender
 * Easy way to send OTPs to any user
 */

const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function sendOtpInteractive() {
  console.log('📧 ScrapSail OTP Sender\n');
  console.log('📬 From: ScrapSail <likeshkanna74@gmail.com>\n');

  rl.question('Enter the email address to send OTP to: ', async (email) => {
    if (!email || !email.includes('@')) {
      console.log('❌ Please enter a valid email address');
      rl.close();
      return;
    }

    console.log(`\n📧 Sending OTP to: ${email}`);

    try {
      const otpResponse = await axios.post('http://localhost:8081/api/otp/send', null, {
        params: { email: email }
      });

      if (otpResponse.data.success) {
        console.log('\n✅ OTP sent successfully!');
        console.log(`📧 From: ScrapSail <likeshkanna74@gmail.com>`);
        console.log(`📬 To: ${email}`);
        console.log(`🔢 OTP Code: ${otpResponse.data.otp}`);
        console.log(`📧 Message: ${otpResponse.data.message}`);
        console.log(`\n📬 Check the inbox of ${email} for the OTP email!`);
        
        console.log('\n🧪 To verify the OTP:');
        console.log(`POST http://localhost:8080/api/otp/verify?email=${email}&otp=${otpResponse.data.otp}`);
        
        console.log('\n📋 Email Details:');
        console.log(`   Subject: ScrapSail OTP Verification`);
        console.log(`   From: ScrapSail <likeshkanna74@gmail.com>`);
        console.log(`   To: ${email}`);
        console.log(`   OTP: ${otpResponse.data.otp}`);
        console.log(`   Expires: 10 minutes`);
        console.log(`   Template: Professional ScrapSail branding`);
      } else {
        console.log('\n❌ Failed to send OTP:', otpResponse.data.message);
      }

    } catch (error) {
      console.log('\n❌ Error:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.log('\n💡 OTP server is not running. Please start it:');
        console.log('   cd scrapsail-backend');
        console.log('   node otp-server.js');
      }
    }

    rl.close();
  });
}

// Run the interactive sender
sendOtpInteractive();
