-- Create database
CREATE DATABASE IF NOT EXISTS cabify;
USE cabify;

-- Table for registered riders
CREATE TABLE IF NOT EXISTS riders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for OTP verifications
CREATE TABLE IF NOT EXISTS otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at BIGINT NOT NULL
);

-- Optional: clean up old OTPs automatically (MySQL 8+ event)
-- CREATE EVENT IF NOT EXISTS cleanup_otps
--   ON SCHEDULE EVERY 10 MINUTE
--   DO DELETE FROM otp_verifications WHERE expires_at < UNIX_TIMESTAMP()*1000;
