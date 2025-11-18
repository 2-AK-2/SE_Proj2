// controllers/authController.js
import db from "../config/db.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "cabify_dev_secret";
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "2h";

export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone || !/^\d{10}$/.test(phone)) return res.status(400).json({ message: "Valid phone number required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5min
    const hashedOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");

    await db.execute("DELETE FROM otp_verifications WHERE phone = ?", [phone]);
    await db.execute("INSERT INTO otp_verifications (phone, otp, expires_at) VALUES (?, ?, ?)", [phone, hashedOtp, expiresAt]);

    // TODO: integrate SMS provider (Twilio etc.) in production
    if (process.env.NODE_ENV !== "production") console.log(`📲 OTP for ${phone}: ${otp}`);

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });

    const hashedOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");
    const [rows] = await db.execute("SELECT * FROM otp_verifications WHERE phone = ? AND otp = ?", [phone, hashedOtp]);

    if (rows.length === 0) return res.status(400).json({ message: "Invalid OTP" });

    const record = rows[0];
    if (Date.now() > Number(record.expires_at)) {
      await db.execute("DELETE FROM otp_verifications WHERE phone = ?", [phone]);
      return res.status(400).json({ message: "OTP expired" });
    }

    // create rider row if not exists
    await db.execute("INSERT IGNORE INTO riders (phone) VALUES (?)", [phone]);
    const [riderRows] = await db.execute("SELECT id, phone FROM riders WHERE phone = ?", [phone]);
    const rider = riderRows[0];

    // cleanup
    await db.execute("DELETE FROM otp_verifications WHERE phone = ?", [phone]);

    const token = jwt.sign({ id: rider.id, phone: rider.phone, role: "rider" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return res.json({ message: "Verification successful", token, rider: { id: rider.id, phone: rider.phone } });
  } catch (err) {
    next(err);
  }
};
