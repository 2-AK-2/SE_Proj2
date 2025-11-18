-- =============================================
-- 🗃️ CABIFY PRODUCTION DATABASE — CLEAN & UPDATED
-- =============================================

CREATE DATABASE IF NOT EXISTS cabify;
USE cabify;

-- Disable FK checks for safe table drops
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS driver_ratings;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS ride_estimates;
DROP TABLE IF EXISTS otp_verifications;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS riders;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- 1️⃣ Riders Table
-- =============================================
CREATE TABLE riders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(15) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional seed rider
INSERT INTO riders (name, email, password, phone)
VALUES (
  'Demo Rider',
  'demo@cabify.com',
  '$2a$12$gxvJzlhvkm9jP5VWCB1yPeG8716Vo6yqSrQ8nKJne/y2scsZM7R.m', -- password123
  '9999999999'
);

-- =============================================
-- 2️⃣ OTP Verification Table
-- =============================================
CREATE TABLE otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  otp VARCHAR(64) NOT NULL,        -- SHA-256 hashed OTP
  expires_at BIGINT NOT NULL       -- timestamp in milliseconds
);

-- =============================================
-- 3️⃣ Drivers Table (with file uploads + GPS)
-- =============================================
CREATE TABLE drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,

  -- Uploads
  profile_picture VARCHAR(255),
  license_doc VARCHAR(255) NOT NULL,
  vehicle_doc VARCHAR(255) NOT NULL,

  verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Real-time GPS
  latitude DOUBLE DEFAULT 12.9716,
  longitude DOUBLE DEFAULT 77.5946
);

-- Dummy drivers for testing
INSERT INTO drivers (name, email, phone, password, license_doc, vehicle_doc, verified)
VALUES 
('Driver One', 'd1@cabify.com', '9000000001', 'password', 'doc1.jpg', 'v1.jpg', 1),
('Driver Two', 'd2@cabify.com', '9000000002', 'password', 'doc2.jpg', 'v2.jpg', 1),
('Driver Three', 'd3@cabify.com', '9000000003', 'password', 'doc3.jpg', 'v3.jpg', 1);

-- =============================================
-- 4️⃣ Driver → Rider Ratings
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
-- 5️⃣ Fare Estimate History
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
-- 6️⃣ Rides (Main Booking Table)
-- =============================================
CREATE TABLE rides (
  id INT AUTO_INCREMENT PRIMARY KEY,

  rider_id INT NOT NULL,
  driver_id INT DEFAULT NULL,

  pickup VARCHAR(255),
  drop_location VARCHAR(255),

  -- Optional real GPS values
  pickup_lat DOUBLE DEFAULT NULL,
  pickup_lng DOUBLE DEFAULT NULL,

  fare FLOAT,
  eta INT,

  status ENUM('pending', 'accepted', 'rejected', 'completed')
        DEFAULT 'pending',

  -- ✅ NEW: Payment Status
  payment_status ENUM('pending', 'paid') DEFAULT 'pending',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);


-- =============================================
-- DONE ✔ CLEAN PRODUCTION DATABASE READY
-- =============================================
