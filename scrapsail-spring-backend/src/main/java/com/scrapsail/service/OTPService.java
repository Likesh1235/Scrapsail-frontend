package com.scrapsail.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OTPService {
    
    private final Map<String, Map.Entry<String, Long>> otpStore = new ConcurrentHashMap<>();
    private final Random random = new Random();
    
    public String generateOtp(String email) {
        String otp = String.valueOf(100000 + random.nextInt(900000));
        long expiryTime = System.currentTimeMillis() + (2 * 60 * 1000); // 2 minutes
        otpStore.put(email, Map.entry(otp, expiryTime));
        return otp;
    }
    
    public boolean verifyOtp(String email, String otp) {
        if (!otpStore.containsKey(email)) {
            return false;
        }
        
        Map.Entry<String, Long> entry = otpStore.get(email);
        long currentTime = System.currentTimeMillis();
        
        // Check if OTP has expired
        if (currentTime > entry.getValue()) {
            otpStore.remove(email);
            return false;
        }
        
        // Check if OTP matches
        boolean isValid = entry.getKey().equals(otp);
        if (isValid) {
            otpStore.remove(email); // Remove after successful verification
        }
        
        return isValid;
    }
    
    public void clearExpiredOtps() {
        long currentTime = System.currentTimeMillis();
        otpStore.entrySet().removeIf(entry -> currentTime > entry.getValue().getValue());
    }
}

