# ScrapSail Backend Configuration

## Environment Variables Required:

### Server Configuration
- PORT=8080
- NODE_ENV=development
- FRONTEND_URL=http://localhost:3000

### Database Configuration (MySQL)
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD= (your MySQL password)
- DB_NAME=scrapsail

### JWT Configuration
- JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

### Email Configuration (Gmail)
- EMAIL_USER=your-email@gmail.com
- EMAIL_PASS=your-app-password

### Email Service Settings
- EMAIL_HOST=smtp.gmail.com
- EMAIL_PORT=587
- EMAIL_SECURE=false

## Setup Instructions:

1. Create a `.env` file in the `scrapsail-backend` directory
2. Copy the above environment variables and set your values
3. Make sure MySQL is running on your system
4. Create a database named `scrapsail` in MySQL
5. For Gmail email service, use App Passwords (not your regular password)

## Email Whitelist Setup:

To add admin or collector emails to the whitelist, you can:

1. Use the database directly:
   ```sql
   INSERT INTO email_whitelist (email, role) VALUES ('admin@yourcompany.com', 'admin');
   INSERT INTO email_whitelist (email, role) VALUES ('collector@yourcompany.com', 'collector');
   ```

2. Or create a simple script to add emails programmatically

