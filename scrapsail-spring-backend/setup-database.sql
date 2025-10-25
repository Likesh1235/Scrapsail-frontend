-- ScrapSail Database Setup Script
-- Run this in MySQL to create the database

CREATE DATABASE IF NOT EXISTS scrapsail_db;
USE scrapsail_db;

-- The tables will be created automatically by Hibernate JPA
-- This script just ensures the database exists

-- Optional: Create a test admin user (password: admin123)
-- INSERT INTO users (name, email, password, role) VALUES 
-- ('Admin User', 'admin@scrapsail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN');

-- Optional: Create a test collector user (password: collector123)
-- INSERT INTO users (name, email, password, role) VALUES 
-- ('Collector User', 'collector@scrapsail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'COLLECTOR');

SELECT 'Database scrapsail_db created successfully!' as message;

