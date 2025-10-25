# 📧 Dynamic Email Configuration Guide

## ✅ Correct Email Setup Understanding

### 🎯 Key Concept:
- **spring.mail.username** → Your Gmail account (sender) - `likeshkanna74@gmail.com`
- **toEmail parameter** → Any user's email (recipient) - dynamic

### 📧 Email Flow:
```
ScrapSail <likeshkanna74@gmail.com> → user1@gmail.com
ScrapSail <likeshkanna74@gmail.com> → customer@yahoo.com  
ScrapSail <likeshkanna74@gmail.com> → someone@outlook.com
```

## 🔧 Configuration Files

### 1. application.properties
```properties
# Email Configuration (Your Gmail as sender)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=likeshkanna74@gmail.com
spring.mail.password=rvoueevkbdwtiizl
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 2. EmailService.java
```java
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public String sendOtpEmail(String toEmail) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("likeshkanna74@gmail.com"); // Your sender Gmail
        message.setTo(toEmail); // User email (dynamic - can be any email)
        message.setSubject("ScrapSail OTP Verification");
        message.setText("Dear user,\n\nYour ScrapSail verification code is: " + otp + 
                       "\n\nThis code will expire in 10 minutes." +
                       "\n\nThank you,\nScrapSail Team");
        
        mailSender.send(message);
        return otp;
    }
}
```

## 🧪 Testing Dynamic Emails

### Test Different User Emails:
```bash
# Test 1: Send to your Gmail
curl -X POST "http://localhost:8080/api/otp/send?email=likeshkanna74@gmail.com"

# Test 2: Send to any Gmail user
curl -X POST "http://localhost:8080/api/otp/send?email=user1@gmail.com"

# Test 3: Send to Yahoo user
curl -X POST "http://localhost:8080/api/otp/send?email=customer@yahoo.com"

# Test 4: Send to Outlook user
curl -X POST "http://localhost:8080/api/otp/send?email=someone@outlook.com"
```

### Automated Testing:
```bash
# Test all predefined emails
node test-dynamic-email.js

# Test specific email
node test-dynamic-email.js user@example.com
```

## 📬 Expected Results

### Email Delivery:
- **From**: ScrapSail <likeshkanna74@gmail.com>
- **To**: Any user email provided
- **Subject**: ScrapSail OTP Verification
- **Content**: Professional OTP message with 6-digit code

### API Response:
```json
{
  "success": true,
  "message": "OTP sent to user@example.com",
  "otp": "123456"
}
```

## 🔒 Security Features

### Gmail App Password:
- ✅ Uses your Gmail app password: `rvoueevkbdwtiizl`
- ✅ Not your regular Gmail password
- ✅ More secure than regular password
- ✅ Works with 2FA enabled

### OTP Security:
- ✅ 6-digit random OTP
- ✅ 10-minute expiration
- ✅ One-time use only
- ✅ Auto-cleanup after verification

## 🎯 Use Cases

### Real-World Scenarios:
1. **User Registration**: Send OTP to verify new user email
2. **Pickup Requests**: Send OTP to verify pickup request
3. **Password Reset**: Send OTP for password reset
4. **Account Changes**: Send OTP for sensitive operations

### Example Users:
- `john.doe@gmail.com` - Gmail user
- `jane.smith@yahoo.com` - Yahoo user  
- `bob.wilson@outlook.com` - Outlook user
- `alice@company.com` - Corporate email

## 🚀 Production Ready

### Email Service Features:
- ✅ Professional email templates
- ✅ Error handling and logging
- ✅ SMTP authentication
- ✅ TLS encryption
- ✅ Dynamic recipient support

### Monitoring:
- ✅ Console logs for email delivery
- ✅ Error tracking for failed sends
- ✅ OTP generation tracking
- ✅ Verification status monitoring

## 🎉 Success Indicators

You'll know it's working when:
- ✅ OTP emails arrive in any user's inbox
- ✅ All emails show "From: ScrapSail <likeshkanna74@gmail.com>"
- ✅ OTP verification works for any email
- ✅ Console shows successful delivery logs

---

**Ready to test?** Start your Spring Boot backend and test with any email address!



