// controllers/riderController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import riderModel from "../models/riderModel.js";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "cabify_dev_secret";
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "2h";

/* ============================================================
   1️⃣ LEGACY EMAIL + PASSWORD REGISTRATION (OPTIONAL)
   (Used ONLY if you still expose /riders/register)
=============================================================== */
export const registerRider = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const normalizedEmail = email.toLowerCase();
    const existing = await riderModel.findByEmail(normalizedEmail);

    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newRider = await riderModel.create({
      name,
      email: normalizedEmail,
      password: hashed,
    });

    res.status(201).json({
      message: "Rider registered successfully",
      rider: { id: newRider.insertId, name, email: normalizedEmail },
    });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ============================================================
   2️⃣ LOGIN (Email + Password)
=============================================================== */
export const loginRider = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const normalizedEmail = email.toLowerCase();
    const rider = await riderModel.findByEmail(normalizedEmail);

    if (!rider)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: rider.id, email: rider.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    res.json({
      message: "Login successful",
      token,
      rider: { id: rider.id, name: rider.name, email: rider.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ============================================================
   3️⃣ GET PROFILE (JWT Protected)
=============================================================== */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized" });

    const rider = await riderModel.findById(userId);
    if (!rider)
      return res.status(404).json({ message: "Rider not found" });

    res.json({
      rider: {
        id: rider.id,
        name: rider.name,
        email: rider.email,
      },
    });
  } catch (err) {
    console.error("❌ Profile fetch error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ============================================================
   4️⃣ COMPLETE REGISTRATION (AFTER OTP)
   Phone → Verified via OTP
   Email + Password → Stored here
=============================================================== */
export const completeRiderRegistration = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!phone || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Step 1: confirm OTP created rider with phone
    const [phoneCheck] = await db.execute(
      "SELECT id FROM riders WHERE phone = ?",
      [phone]
    );

    if (phoneCheck.length === 0)
      return res.status(400).json({ message: "Phone not verified" });

    // Step 2: ensure email not in use
    const existing = await riderModel.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    // Step 3: hash password
    const hashed = await bcrypt.hash(password, 10);

    // Step 4: update rider row
    await db.execute(
      "UPDATE riders SET email=?, password=? WHERE phone=?",
      [email, hashed, phone]
    );

    res.json({ message: "Registration completed successfully" });
  } catch (err) {
    console.error("❌ Complete registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
