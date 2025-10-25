package com.scrapsail.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.scrapsail.service.EmailService;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    @Autowired
    private EmailService emailService;

    // Static maps to store OTP and verification status
    public static Map<String, String> otpStorage = new HashMap<>();
    public static Map<String, Boolean> otpVerified = new HashMap<>();

    @PostMapping("/send")
    public Map<String, Object> sendOtp(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Generate and send OTP
            String otp = emailService.sendOtpEmail(email);
            
            // Store OTP and reset verification status
            otpStorage.put(email, otp);
            otpVerified.put(email, false);
            
            response.put("success", true);
            response.put("message", "OTP sent to " + email);
            response.put("otp", otp); // For testing - remove in production
            
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send OTP: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/verify")
    public Map<String, Object> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String storedOtp = otpStorage.get(email);
            
            if (storedOtp != null && otp.equals(storedOtp)) {
                // OTP is valid - remove from storage and mark as verified
                otpStorage.remove(email);
                otpVerified.put(email, true);
                
                response.put("success", true);
                response.put("message", "OTP verified successfully!");
                return response;
            } else {
                response.put("success", false);
                response.put("message", "Invalid OTP!");
                return response;
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "OTP verification failed: " + e.getMessage());
            return response;
        }
    }

    // Static method to check if email is verified
    public static boolean isVerified(String email) {
        return otpVerified.getOrDefault(email, false);
    }

    // Method to clear verification status (useful for testing)
    @PostMapping("/clear")
    public Map<String, Object> clearVerification(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        otpStorage.remove(email);
        otpVerified.remove(email);
        
        response.put("success", true);
        response.put("message", "Verification cleared for " + email);
        return response;
    }

    // Method to check verification status
    @GetMapping("/status")
    public Map<String, Object> getVerificationStatus(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("email", email);
        response.put("verified", isVerified(email));
        response.put("hasOtp", otpStorage.containsKey(email));
        
        return response;
    }
}




