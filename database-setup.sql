-- ScrapSail Database Setup Script
-- Run this script to create the MySQL database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS scrapsail;
USE scrapsail;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'collector', 'admin') DEFAULT 'user',
    phone VARCHAR(20),
    address TEXT,
    carbon_credits INT DEFAULT 0,
    total_recycled DECIMAL(10,2) DEFAULT 0,
    account_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create pickups table
CREATE TABLE IF NOT EXISTS pickups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    waste_category ENUM('Plastic', 'Metal', 'Paper', 'E-waste', 'Organic', 'Mixed') NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    pickup_address TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    scheduled_date DATETIME NOT NULL,
    status ENUM('pending', 'admin-approved', 'admin-rejected', 'collector-assigned', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_collector_id INT,
    carbon_credits_earned INT DEFAULT 0,
    admin_notes TEXT,
    collector_notes TEXT,
    completion_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_collector_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('credit', 'debit', 'redemption') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    related_pickup_id INT,
    balance_after DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_pickup_id) REFERENCES pickups(id) ON DELETE SET NULL
);

-- Create otps table
CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    type VARCHAR(50) DEFAULT 'pickup',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_otp (email, otp),
    INDEX idx_expires (expires_at)
);

-- Create email whitelist table for admin and collector roles
CREATE TABLE IF NOT EXISTS email_whitelist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('admin', 'collector') NOT NULL,
    is_active BOOLEAN DEFAULT true,
    added_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email_role (email, role),
    INDEX idx_active (is_active)
);

-- Create carbon_wallet table for Spring Boot
CREATE TABLE IF NOT EXISTS carbon_wallet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0.00,
    total_earned DECIMAL(10,2) DEFAULT 0.00,
    total_redeemed DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_verified) 
VALUES ('Admin User', 'admin@scrapsail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample collector user (password: collector123)
INSERT INTO users (name, email, password, role, is_verified) 
VALUES ('Collector User', 'collector@scrapsail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'collector', true)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample regular user (password: user123)
INSERT INTO users (name, email, password, role, is_verified, carbon_credits) 
VALUES ('Test User', 'user@scrapsail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', true, 1000)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_pickups_user_id ON pickups(user_id);
CREATE INDEX idx_pickups_status ON pickups(status);
CREATE INDEX idx_pickups_scheduled_date ON pickups(scheduled_date);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Show tables created
SHOW TABLES;

-- Show sample data
SELECT 'Users:' as Table_Name;
SELECT id, name, email, role, carbon_credits FROM users LIMIT 5;

SELECT 'Database setup completed successfully!' as Status;
