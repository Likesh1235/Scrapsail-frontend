package com.scrapsail.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public String sendOtpEmail(String toEmail) {
        // Generate a 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("likeshkanna74@gmail.com"); // Your sender Gmail
        message.setTo(toEmail); // User email (dynamic - can be any email)
        message.setSubject("ScrapSail OTP Verification");
        message.setText("Dear user,\n\nYour ScrapSail verification code is: " + otp + 
                       "\n\nThis code will expire in 10 minutes." +
                       "\n\nIf you didn't request this code, please ignore this email." +
                       "\n\nThank you,\nScrapSail Team");
        
        try {
            mailSender.send(message);
            System.out.println("✅ OTP sent successfully from likeshkanna74@gmail.com to " + toEmail + ": " + otp);
            return otp;
        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
}

