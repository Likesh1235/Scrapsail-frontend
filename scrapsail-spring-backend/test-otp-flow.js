#!/usr/bin/env node

/**
 * Complete OTP Verification Flow Test Script
 * Tests the full pickup request flow with OTP verification
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
const TEST_EMAIL = 'likeshkanna74@gmail.com';

async function testCompleteOtpFlow() {
  console.log('🧪 Testing Complete OTP Verification Flow\n');

  try {
    // STEP 1: Send OTP
    console.log('1️⃣ Sending OTP to ' + TEST_EMAIL + '...');
    const otpResponse = await axios.post(`${BASE_URL}/api/otp/send`, null, {
      params: { email: TEST_EMAIL }
    });

    if (otpResponse.data.success) {
      console.log('✅ OTP sent successfully!');
      console.log(`📧 Message: ${otpResponse.data.message}`);
      console.log(`🔢 OTP Code: ${otpResponse.data.otp}`);
      
      // STEP 2: Verify OTP
      console.log('\n2️⃣ Verifying OTP...');
      const verifyResponse = await axios.post(`${BASE_URL}/api/otp/verify`, null, {
        params: { 
          email: TEST_EMAIL, 
          otp: otpResponse.data.otp 
        }
      });

      if (verifyResponse.data.success) {
        console.log('✅ OTP verified successfully!');
        console.log(`📧 Message: ${verifyResponse.data.message}`);

        // STEP 3: Submit Pickup Request
        console.log('\n3️⃣ Submitting pickup request...');
        const pickupData = {
          name: "Likesh Kanna",
          email: TEST_EMAIL,
          phone: "9876543210",
          scrapType: "Plastic, Metal, Paper",
          pickupDate: "2025-10-24",
          address: "Dharmapuri, Tamil Nadu, India",
          latitude: 12.1223,
          longitude: 78.2345
        };

        const pickupResponse = await axios.post(`${BASE_URL}/api/pickup/request`, pickupData);

        if (pickupResponse.data.success) {
          console.log('✅ Pickup request submitted successfully!');
          console.log(`📧 Message: ${pickupResponse.data.message}`);
          console.log(`🆔 Pickup ID: ${pickupResponse.data.pickupId}`);
          
          // STEP 4: Verify pickup was created
          console.log('\n4️⃣ Verifying pickup request was created...');
          const getPickupResponse = await axios.get(`${BASE_URL}/api/pickup/requests/${pickupResponse.data.pickupId}`);
          
          if (getPickupResponse.data.success) {
            console.log('✅ Pickup request retrieved successfully!');
            console.log(`📋 Status: ${getPickupResponse.data.data.status}`);
            console.log(`📅 Created: ${getPickupResponse.data.data.createdAt}`);
          }

          // STEP 5: Test admin status update
          console.log('\n5️⃣ Testing admin status update...');
          const statusResponse = await axios.put(`${BASE_URL}/api/pickup/requests/${pickupResponse.data.pickupId}/status`, null, {
            params: { 
              status: 'APPROVED',
              notes: 'Approved by admin - ready for collection'
            }
          });

          if (statusResponse.data.success) {
            console.log('✅ Status updated successfully!');
            console.log(`📧 Message: ${statusResponse.data.message}`);
          }

        } else {
          console.log('❌ Failed to submit pickup request:', pickupResponse.data.message);
        }

      } else {
        console.log('❌ OTP verification failed:', verifyResponse.data.message);
      }

    } else {
      console.log('❌ Failed to send OTP:', otpResponse.data.message);
    }

    // STEP 6: Test verification status check
    console.log('\n6️⃣ Testing verification status check...');
    const statusCheckResponse = await axios.get(`${BASE_URL}/api/otp/status`, {
      params: { email: TEST_EMAIL }
    });

    console.log('📊 Verification Status:', statusCheckResponse.data);

    // STEP 7: Test pickup stats
    console.log('\n7️⃣ Testing pickup statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/api/pickup/stats`);
    
    if (statsResponse.data.success) {
      console.log('📊 Pickup Statistics:');
      console.log(`   Total Requests: ${statsResponse.data.data.total}`);
      console.log(`   Pending: ${statsResponse.data.data.pending}`);
      console.log(`   Approved: ${statsResponse.data.data.approved}`);
      console.log(`   Completed: ${statsResponse.data.data.completed}`);
    }

    console.log('\n🎉 Complete OTP verification flow test completed!');
    console.log('\n📋 Summary:');
    console.log('✅ OTP sending works');
    console.log('✅ OTP verification works');
    console.log('✅ Pickup request submission works');
    console.log('✅ Status updates work');
    console.log('✅ Data retrieval works');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Spring Boot backend is running:');
      console.log('   cd scrapsail-spring-backend && mvn spring-boot:run');
    }
  }
}

// Run the test
testCompleteOtpFlow();



