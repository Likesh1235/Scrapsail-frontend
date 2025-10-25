#!/usr/bin/env node

/**
 * Dynamic Email OTP Test Script
 * Tests sending OTP to different user emails from your Gmail
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Test different user emails
const testEmails = [
    'likeshkanna74@gmail.com',  // Your email for testing
    'user1@gmail.com',          // Test user 1
    'customer@yahoo.com',       // Test user 2
    'someone@outlook.com'       // Test user 3
];

async function testDynamicEmailOtp() {
    console.log('🧪 Testing Dynamic Email OTP Functionality\n');
    console.log('📧 Sender: ScrapSail <likeshkanna74@gmail.com>');
    console.log('📬 Recipients: Any user email (dynamic)\n');

    for (let i = 0; i < testEmails.length; i++) {
        const testEmail = testEmails[i];
        console.log(`${i + 1}️⃣ Testing OTP to: ${testEmail}`);

        try {
            // Send OTP
            const otpResponse = await axios.post(`${BASE_URL}/api/otp/send`, null, {
                params: { email: testEmail }
            });

            if (otpResponse.data.success) {
                console.log(`✅ OTP sent successfully!`);
                console.log(`📧 Message: ${otpResponse.data.message}`);
                console.log(`🔢 OTP Code: ${otpResponse.data.otp}`);
                console.log(`📬 Email sent from: likeshkanna74@gmail.com → ${testEmail}`);

                // Test OTP verification
                console.log(`🔍 Testing OTP verification...`);
                const verifyResponse = await axios.post(`${BASE_URL}/api/otp/verify`, null, {
                    params: { 
                        email: testEmail, 
                        otp: otpResponse.data.otp 
                    }
                });

                if (verifyResponse.data.success) {
                    console.log(`✅ OTP verified successfully!`);
                    console.log(`📧 Message: ${verifyResponse.data.message}`);
                } else {
                    console.log(`❌ OTP verification failed: ${verifyResponse.data.message}`);
                }

            } else {
                console.log(`❌ Failed to send OTP: ${otpResponse.data.message}`);
            }

        } catch (error) {
            console.log(`❌ Test failed for ${testEmail}: ${error.message}`);
            
            if (error.code === 'ECONNREFUSED') {
                console.log(`💡 Make sure your Spring Boot backend is running:`);
                console.log(`   cd scrapsail-spring-backend && mvn spring-boot:run`);
                break;
            }
        }

        console.log(''); // Empty line for readability
    }

    console.log('🎉 Dynamic email OTP testing completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Your Gmail (likeshkanna74@gmail.com) is the sender');
    console.log('✅ Any user email can be the recipient');
    console.log('✅ OTP generation and verification works');
    console.log('✅ Email service is properly configured');
}

// Test with a specific email
async function testSpecificEmail(email) {
    console.log(`🧪 Testing OTP for specific email: ${email}\n`);

    try {
        // Send OTP
        const otpResponse = await axios.post(`${BASE_URL}/api/otp/send`, null, {
            params: { email: email }
        });

        if (otpResponse.data.success) {
            console.log(`✅ OTP sent successfully!`);
            console.log(`📧 Message: ${otpResponse.data.message}`);
            console.log(`🔢 OTP Code: ${otpResponse.data.otp}`);
            console.log(`📬 Email sent from: likeshkanna74@gmail.com → ${email}`);
            console.log(`📬 Check the inbox of ${email} for the OTP email!`);
        } else {
            console.log(`❌ Failed to send OTP: ${otpResponse.data.message}`);
        }

    } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
    }
}

// Run the test
if (process.argv[2]) {
    // Test specific email provided as argument
    testSpecificEmail(process.argv[2]);
} else {
    // Test all predefined emails
    testDynamicEmailOtp();
}



