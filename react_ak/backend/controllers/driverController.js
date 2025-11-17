// controllers/driverController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// REGISTER DRIVER
export const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone)
      return res.status(400).json({ message: "All fields required" });

    const [existing] = await db.execute(
      "SELECT id FROM drivers WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO drivers (name, email, phone, password, verified)
       VALUES (?, ?, ?, ?, 1)`,
      [name, email, phone, hashed]
    );

    res.json({ message: "Driver registered", id: result.insertId });

  } catch (err) {
    console.error("❌ registerDriver:", err);
    res.status(500).json({ message: "Internal error" });
  }
};

// LOGIN DRIVER
export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute("SELECT * FROM drivers WHERE email = ?", [
      email
    ]);

    if (!rows.length) return res.status(401).json({ message: "Invalid login" });

    const driver = rows[0];
    const ok = await bcrypt.compare(password, driver.password);

    if (!ok) return res.status(401).json({ message: "Invalid login" });

    const token = jwt.sign({ id: driver.id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
      }
    });

  } catch (err) {
    console.error("❌ login error:", err);
    res.status(500).json({ message: "Internal error" });
  }
};


// VIEW PROFILE
export const getDriverProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, name, email, phone, profile_picture,
              license_doc, vehicle_doc
       FROM drivers 
       WHERE id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ getProfile ERROR:", err);
    res.status(500).json({ message: "Internal error" });
  }
};




// UPDATE PROFILE (name + phone)
export const updateDriverProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    await db.execute(
      `UPDATE drivers SET 
        name = COALESCE(?, name), 
        phone = COALESCE(?, phone)
      WHERE id = ?`,
      [name, phone, req.user.id]
    );

    res.json({ message: "Profile updated" });

  } catch (err) {
    console.error("❌ updateProfile:", err);
    res.status(500).json({ message: "Internal error" });
  }
};

// CHANGE PASSWORD
export const changeDriverPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const [rows] = await db.execute(
      "SELECT password FROM drivers WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Driver not found" });

    const valid = await bcrypt.compare(oldPassword, rows[0].password);

    if (!valid)
      return res.status(400).json({ message: "Old password wrong" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE drivers SET password = ? WHERE id = ?",
      [hashed, req.user.id]
    );

    res.json({ message: "Password updated" });

  } catch (err) {
    console.error("❌ changePass:", err);
    res.status(500).json({ message: "Internal error" });
  }
};


export const getRideRequests = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT *
      FROM rides
      WHERE status = 'pending'
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ getRideRequests:", err);
    res.status(500).json({ message: "Internal error" });
  }
};
