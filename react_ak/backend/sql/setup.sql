-- =============================================
-- 🗃️ CABIFY DATABASE – MERGED FINAL SCHEMA
-- =============================================

-- 1️⃣ Create & Select Database
CREATE DATABASE IF NOT EXISTS cabify;
USE cabify;

-- -------------------------------------------------
-- 2️⃣ Riders Table (supports OTP + Email/Password)
-- -------------------------------------------------
DROP TABLE IF EXISTS riders;

CREATE TABLE riders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(15) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional test rider (password = "password123")
INSERT INTO riders (name, email, password, phone)
VALUES (
  'Demo Rider',
  'demo@cabify.com',
  '$2a$12$gxvJzlhvkm9jP5VWCB1yPeG8716Vo6yqSrQ8nKJne/y2scsZM7R.m',
  '9999999999'
);

-- -------------------------------------------------
-- 3️⃣ OTP Verifications Table (hashed OTP supported)
-- -------------------------------------------------
DROP TABLE IF EXISTS otp_verifications;

CREATE TABLE otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  otp VARCHAR(64) NOT NULL,   -- hashed using SHA-256
  expires_at BIGINT NOT NULL
);

-- OPTIONAL (MySQL 8+):
-- CREATE EVENT IF NOT EXISTS cleanup_otps
--   ON SCHEDULE EVERY 10 MINUTE
--   DO DELETE FROM otp_verifications WHERE expires_at < (UNIX_TIMESTAMP() * 1000);

-- -------------------------------------------------
-- 4️⃣ Ride Estimates Table (Fare System)
-- -------------------------------------------------
DROP TABLE IF EXISTS ride_estimates;

CREATE TABLE ride_estimates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pickup VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  fare DECIMAL(10,2),
  eta INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ DONE (Riders + OTP + Fare Estimator unified)
