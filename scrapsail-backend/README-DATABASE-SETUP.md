# 🗄️ Database Setup Guide for ScrapSail

## Current Issue
The application is trying to connect to MySQL but getting "Access denied for user 'root'@'localhost' (using password: NO)" error.

## Solutions

### Option 1: Set MySQL Root Password
1. Open MySQL Command Line Client or MySQL Workbench
2. Run: `ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';`
3. Update `.env` file: `DB_PASSWORD=yourpassword`

### Option 2: Create New MySQL User
1. Connect to MySQL as root
2. Run these commands:
```sql
CREATE USER 'scrapsail'@'localhost' IDENTIFIED BY 'scrapsail123';
GRANT ALL PRIVILEGES ON *.* TO 'scrapsail'@'localhost';
FLUSH PRIVILEGES;
```
3. Update `.env` file:
```
DB_USER=scrapsail
DB_PASSWORD=scrapsail123
```

### Option 3: Use MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Run the setup script manually
4. Create database: `CREATE DATABASE scrapsail;`
5. Use the database: `USE scrapsail;`
6. Run the table creation scripts from `setup-mysql.js`

### Option 4: Reset MySQL Root Password
1. Stop MySQL service
2. Start MySQL with skip-grant-tables
3. Connect and reset password
4. Restart MySQL service

## Quick Test
To test if MySQL is working:
1. Open MySQL Command Line Client
2. Try connecting with: `mysql -u root -p`
3. If it asks for password, enter it or press Enter if no password

## Alternative: Use SQLite
If MySQL continues to be problematic, we can modify the application to use SQLite instead, which requires no setup.

## Current Status
- ✅ MySQL service is running (MySQL94)
- ❌ Cannot connect due to authentication issue
- 🔧 Need to configure user credentials

Choose one of the options above to proceed with the database setup.

