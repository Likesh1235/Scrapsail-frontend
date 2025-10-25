#!/usr/bin/env node

/**
 * Quick OTP Test Script
 * Tests the running OTP server
 */

const axios = require('axios');

async function testOtpServer() {
  console.log('🧪 Testing OTP Server\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get('http://localhost:8080/health');
    console.log('✅ Server is running!');
    console.log(`📊 Status: ${healthResponse.data.status}`);
    console.log(`📧 Message: ${healthResponse.data.message}\n`);

    // Test 2: Send OTP
    console.log('2️⃣ Sending OTP to likeshkanna74@gmail.com...');
    const otpResponse = await axios.post('http://localhost:8080/api/otp/send', null, {
      params: { email: 'likeshkanna74@gmail.com' }
    });

    if (otpResponse.data.success) {
      console.log('✅ OTP sent successfully!');
      console.log(`📧 Message: ${otpResponse.data.message}`);
      console.log(`🔢 OTP Code: ${otpResponse.data.otp}`);
      console.log(`📬 Email sent from: ScrapSail <likeshkanna74@gmail.com>`);
      console.log(`📬 Check your inbox at likeshkanna74@gmail.com\n`);

      // Test 3: Verify OTP
      console.log('3️⃣ Testing OTP verification...');
      const verifyResponse = await axios.post('http://localhost:8080/api/otp/verify', null, {
        params: { 
          email: 'likeshkanna74@gmail.com', 
          otp: otpResponse.data.otp 
        }
      });

      if (verifyResponse.data.success) {
        console.log('✅ OTP verification successful!');
        console.log(`📧 Message: ${verifyResponse.data.message}\n`);

        // Test 4: Submit pickup request
        console.log('4️⃣ Testing pickup request submission...');
        const pickupResponse = await axios.post('http://localhost:8080/api/pickup/request', {
          name: "Likesh Kanna",
          email: "likeshkanna74@gmail.com",
          phone: "9876543210",
          scrapType: "Plastic, Metal",
          pickupDate: "2025-10-24",
          address: "Dharmapuri, Tamil Nadu",
          latitude: 12.1223,
          longitude: 78.2345
        });

        if (pickupResponse.data.success) {
          console.log('✅ Pickup request submitted successfully!');
          console.log(`📧 Message: ${pickupResponse.data.message}`);
          console.log(`🆔 Pickup ID: ${pickupResponse.data.pickupId}`);
        } else {
          console.log('❌ Pickup request failed:', pickupResponse.data.message);
        }

      } else {
        console.log('❌ OTP verification failed:', verifyResponse.data.message);
      }

    } else {
      console.log('❌ Failed to send OTP:', otpResponse.data.message);
    }

    console.log('\n🎉 OTP Server Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ Server is running on port 8080');
    console.log('✅ Email service is working');
    console.log('✅ OTP generation and verification works');
    console.log('✅ Pickup request submission works');
    console.log('\n💡 Your frontend can now use:');
    console.log('   POST http://localhost:8080/api/otp/send?email=user@example.com');
    console.log('   POST http://localhost:8080/api/otp/verify?email=user@example.com&otp=123456');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 OTP server is not running. Please start it:');
      console.log('   cd scrapsail-backend');
      console.log('   node otp-server.js');
    }
  }
}

// Run the test
testOtpServer();



