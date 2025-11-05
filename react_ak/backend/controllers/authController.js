import db from "../db.js";
import crypto from "crypto";

export const sendOtp = (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  db.query("DELETE FROM otp_verifications WHERE phone = ?", [phone]);
  db.query(
    "INSERT INTO otp_verifications (phone, otp, expires_at) VALUES (?, ?, ?)",
    [phone, otp, expiresAt],
    err => {
      if (err) return res.status(500).json({ message: "DB error" });
      console.log(`📲 OTP for ${phone}: ${otp}`);
      // Here you’d integrate with Twilio / SMS API to send the OTP.
      res.json({ message: "OTP sent successfully" });
    }
  );
};

export const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  db.query(
    "SELECT * FROM otp_verifications WHERE phone = ? AND otp = ?",
    [phone, otp],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (results.length === 0)
        return res.status(400).json({ message: "Invalid OTP" });

      const record = results[0];
      if (Date.now() > record.expires_at)
        return res.status(400).json({ message: "OTP expired" });

      // Create rider account if not exists
      db.query(
        "INSERT IGNORE INTO riders (phone) VALUES (?)",
        [phone],
        err2 => {
          if (err2) return res.status(500).json({ message: "DB error" });
          db.query("DELETE FROM otp_verifications WHERE phone = ?", [phone]);
          res.json({ message: "Registration successful" });
        }
      );
    }
  );
};
