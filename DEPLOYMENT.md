# 🚀 ScrapSail Deployment Guide

## 📋 Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **Java** (v17 or higher)
- **Maven** (v3.6 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

### Required Accounts
- **GitHub Account**
- **Gmail Account** (for OTP service)
- **Razorpay Account** (for payments)

## 🗄️ Database Setup

### 1. Install MySQL
```bash
# Windows (using Chocolatey)
choco install mysql

# Or download from: https://dev.mysql.com/downloads/mysql/
```

### 2. Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Run the setup script
source database-setup.sql
```

### 3. Verify Database
```bash
# Check if database exists
SHOW DATABASES;

# Check tables
USE scrapsail;
SHOW TABLES;
```

## 🔧 Environment Configuration

### 1. Frontend Environment
Create `.env` in root directory:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Node.js Backend Environment
Create `scrapsail-backend/.env`:
```env
PORT=8080
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=scrapsail

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Frontend URL
FRONTEND_URL=https://your-username.github.io/scrapsail-frontend-new
```

### 3. Spring Boot Environment
Update `scrapsail-spring-backend/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/scrapsail?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# Email Configuration
spring.mail.username=your-email@gmail.com
spring.mail.password=your-gmail-app-password

# Production Settings
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.com.scrapsail=INFO
```

## 🚀 GitHub Deployment

### 1. Create GitHub Repository
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: ScrapSail waste management platform"

# Add remote origin
git remote add origin https://github.com/your-username/scrapsail-frontend-new.git

# Push to GitHub
git push -u origin main
```

### 2. Configure GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

### 3. Set up GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build React app
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

## 🌐 Production Deployment Options

### Option 1: GitHub Pages (Frontend Only)
- ✅ **Free hosting**
- ✅ **Easy setup**
- ❌ **No backend support**

### Option 2: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
vercel --prod

# Deploy backend
cd scrapsail-backend
vercel --prod
```

### Option 3: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd scrapsail-backend
railway deploy
```

### Option 4: DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

## 🔐 Security Configuration

### 1. Environment Variables
- Never commit `.env` files
- Use GitHub Secrets for sensitive data
- Rotate JWT secrets regularly

### 2. Database Security
```sql
-- Create dedicated database user
CREATE USER 'scrapsail_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON scrapsail.* TO 'scrapsail_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Email Security
- Use Gmail App Passwords (not regular passwords)
- Enable 2-Factor Authentication
- Monitor email usage

## 📊 Monitoring & Maintenance

### 1. Health Checks
```bash
# Check frontend
curl https://your-username.github.io/scrapsail-frontend-new

# Check backend
curl http://your-backend-url/api/health
```

### 2. Database Maintenance
```sql
-- Regular cleanup
DELETE FROM otps WHERE expires_at < NOW();
DELETE FROM transactions WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### 3. Log Monitoring
- Monitor application logs
- Set up error tracking (Sentry)
- Monitor database performance

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check MySQL service
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SELECT 1"
```

#### 2. Email Not Sending
- Verify Gmail App Password
- Check SMTP settings
- Test with mock mode first

#### 3. Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Issues
- Update `FRONTEND_URL` in backend
- Check CORS configuration
- Verify API endpoints

## 📞 Support

For deployment issues:
1. Check GitHub Issues
2. Review logs
3. Test locally first
4. Contact support team

---

**ScrapSail** - Making recycling rewarding! 🌱♻️
