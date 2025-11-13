-- =============================================
-- 🗃️ CABIFY DATABASE – FINAL MERGED SCHEMA
-- Supports:
-- - Rider OTP Login
-- - Rider Email/Password Login
-- - Driver Registration + File Uploads
-- - Driver Login
-- - Driver → Rider Rating
-- - Fare Estimation History
-- =============================================

-- 1️⃣ Create & Select Database
CREATE DATABASE IF NOT EXISTS cabify;
USE cabify;

-- =============================================
-- 2️⃣ Riders Table
-- Supports BOTH:
-- - OTP-based login (phone only)
-- - Email/password login
-- =============================================
DROP TABLE IF EXISTS riders;

CREATE TABLE riders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(15) UNIQUE,     -- nullable for email-based signup
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional seed user (password = "password123")
INSERT INTO riders (name, email, password, phone)
VALUES (
  'Demo Rider',
  'demo@cabify.com',
  '$2a$12$gxvJzlhvkm9jP5VWCB1yPeG8716Vo6yqSrQ8nKJne/y2scsZM7R.m',
  '9999999999'
);

-- =============================================
-- 3️⃣ OTP Verifications Table (Hashed OTP)
-- =============================================
DROP TABLE IF EXISTS otp_verifications;

CREATE TABLE otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  otp VARCHAR(64) NOT NULL,      -- SHA-256 hashed
  expires_at BIGINT NOT NULL     -- UNIX ms timestamp
);

-- Optional automated cleanup (MySQL 8+)
-- CREATE EVENT IF NOT EXISTS cleanup_otps
--   ON SCHEDULE EVERY 10 MINUTE
--   DO DELETE FROM otp_verifications WHERE expires_at < (UNIX_TIMESTAMP() * 1000);

-- =============================================
-- 4️⃣ Drivers Table (Supports file uploads)
-- =============================================
DROP TABLE IF EXISTS drivers;

CREATE TABLE drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  license_doc VARCHAR(255) NOT NULL,     -- filesystem path
  vehicle_doc VARCHAR(255) NOT NULL,
  verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5️⃣ Driver → Rider Rating Table
-- (used when driver submits a rating for a rider)
-- =============================================
DROP TABLE IF EXISTS driver_ratings;

CREATE TABLE driver_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT NOT NULL,
  rider_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
  FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE
);

-- =============================================
-- 6️⃣ Ride Estimate History (Fare Estimation)
-- =============================================
DROP TABLE IF EXISTS ride_estimates;

CREATE TABLE ride_estimates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pickup VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  fare DECIMAL(10,2),
  eta INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 🎉 DONE: This schema now matches 100% of your backend code
-- =============================================
