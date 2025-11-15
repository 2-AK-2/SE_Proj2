-- =============================================
-- 🗃️ CABIFY DATABASE – FINAL MERGED SCHEMA
-- Supports:
-- - Rider OTP Login
-- - Rider Email/Password Login
-- - Driver Registration + File Uploads
-- - Driver Login
-- - Driver → Rider Rating
-- - Fare Estimation History
-- - Ride Booking + Driver Matching
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
  phone VARCHAR(15) UNIQUE,
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
  license_doc VARCHAR(255) NOT NULL,
  vehicle_doc VARCHAR(255) NOT NULL,
  verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5️⃣ Driver → Rider Rating Table
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
-- 7️⃣ Rides Table (Booking + Driver Matching)
-- =============================================
DROP TABLE IF EXISTS rides;

CREATE TABLE rides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rider_id INT NOT NULL,
  driver_id INT DEFAULT NULL,
  pickup VARCHAR(255),
  drop_location VARCHAR(255),
  fare FLOAT,
  eta INT,
  status ENUM('pending', 'assigned', 'accepted', 'rejected', 'completed')
         DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- =============================================
-- 🎉 DONE: DB schema now supports Sprint 2 (Ride Booking)
-- =============================================
