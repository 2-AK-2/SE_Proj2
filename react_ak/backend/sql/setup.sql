-- =============================================
-- 🗃️ CABIFY DATABASE – FINAL MERGED SQL SCHEMA
-- =============================================
-- Supports:
-- ✔ Rider OTP Signup/Login
-- ✔ Rider Email/Password Login
-- ✔ Driver Registration (+ file uploads)
-- ✔ Driver Login
-- ✔ Driver → Rider Rating
-- ✔ Fare Estimation History
-- ✔ Ride Booking + Auto Driver Assignment
-- ✔ Live Driver Tracking (latitude & longitude)
-- =============================================


-- 1️⃣ Create & Select Database
CREATE DATABASE IF NOT EXISTS cabify;
USE cabify;


-- =============================================
-- 2️⃣ Riders Table
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

-- Seed rider (password = "password123")
INSERT INTO riders (name, email, password, phone)
VALUES (
  'Demo Rider',
  'demo@cabify.com',
  '$2a$12$gxvJzlhvkm9jP5VWCB1yPeG8716Vo6yqSrQ8nKJne/y2scsZM7R.m',
  '9999999999'
);


-- =============================================
-- 3️⃣ OTP Verification Table
-- =============================================
DROP TABLE IF EXISTS otp_verifications;

CREATE TABLE otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  otp VARCHAR(64) NOT NULL,        -- SHA-256 hashed
  expires_at BIGINT NOT NULL       -- timestamp in ms
);


-- =============================================
-- 4️⃣ Drivers Table  (✓ Includes LIVE tracking columns)
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- LIVE DRIVER LOCATION FOR REAL-TIME TRACKING
  latitude DOUBLE DEFAULT 12.9716,      -- default coordinates (Bengaluru)
  longitude DOUBLE DEFAULT 77.5946
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
-- 6️⃣ Fare Estimation History
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
-- 🎉 DONE — DATABASE NOW SUPPORTS:
-- - OTP & Email Login
-- - Driver Login + Verification
-- - Live Driver Location Updates
-- - Nearest Driver Assignment
-- - Ride Booking & Tracking-- =============================================
-- 🗃️ CABIFY DATABASE – FINAL MERGED SQL SCHEMA
-- =============================================

-- 1️⃣ Create & Select Database
CREATE DATABASE IF NOT EXISTS cabify;
USE cabify;

-- 🚨 Disable FK checks so all tables can drop cleanly
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- 2️⃣ DROP TABLES IN SAFE ORDER
-- =============================================
DROP TABLE IF EXISTS driver_ratings;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS ride_estimates;
DROP TABLE IF EXISTS otp_verifications;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS riders;

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- 3️⃣ Riders Table
-- =============================================
CREATE TABLE riders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(15) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO riders (name, email, password, phone)
VALUES (
  'Demo Rider',
  'demo@cabify.com',
  '$2a$12$gxvJzlhvkm9jP5VWCB1yPeG8716Vo6yqSrQ8nKJne/y2scsZM7R.m',
  '9999999999'
);

-- =============================================
-- 4️⃣ OTP Verification Table
-- =============================================
CREATE TABLE otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  otp VARCHAR(64) NOT NULL,
  expires_at BIGINT NOT NULL
);

-- =============================================
-- 5️⃣ Drivers Table (includes GPS tracking)
-- =============================================
CREATE TABLE drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  license_doc VARCHAR(255) NOT NULL,
  vehicle_doc VARCHAR(255) NOT NULL,
  verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- LIVE TRACKING
  latitude DOUBLE DEFAULT 12.9716,
  longitude DOUBLE DEFAULT 77.5946
);

-- Add 3 dummy drivers for testing
INSERT INTO drivers (name, email, password, license_doc, vehicle_doc, verified)
VALUES 
('Driver One', 'd1@cabify.com', 'password', 'doc1.jpg', 'v1.jpg', 1),
('Driver Two', 'd2@cabify.com', 'password', 'doc2.jpg', 'v2.jpg', 1),
('Driver Three', 'd3@cabify.com', 'password', 'doc3.jpg', 'v3.jpg', 1);

-- =============================================
-- 6️⃣ Driver Ratings
-- =============================================
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
-- 7️⃣ Fare Estimate History
-- =============================================
CREATE TABLE ride_estimates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pickup VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  fare DECIMAL(10,2),
  eta INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 8️⃣ Rides Table
-- =============================================
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
-- 🎉 DONE — Full DB created successfully!
-- =============================================

-- =============================================
