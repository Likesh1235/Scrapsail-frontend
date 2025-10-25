# MySQL Password Reset Guide

## Method 1: Using MySQL Workbench (Recommended)
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to Server → Users and Privileges
4. Find the 'root' user
5. Click 'Change Password'
6. Set a new password (remember this!)

## Method 2: Command Line Reset
1. Stop MySQL service:
   - Open Services (services.msc)
   - Find "MySQL80" service
   - Right-click → Stop

2. Start MySQL in safe mode:
   - Open Command Prompt as Administrator
   - Navigate to MySQL bin directory:
     cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   - Run: mysqld --skip-grant-tables --skip-networking

3. In another Command Prompt:
   - Connect: mysql -u root
   - Reset password:
     USE mysql;
     UPDATE user SET authentication_string=PASSWORD('newpassword') WHERE User='root';
     FLUSH PRIVILEGES;
     EXIT;

4. Restart MySQL service normally

## Method 3: Check Installation Log
1. Look for mysql-installer-log.txt in Downloads
2. Search for "root password" or "generated password"
3. The password might be displayed there

## After Finding/Setting Password
Update your .env file with:
DB_PASSWORD=your_actual_password_here
