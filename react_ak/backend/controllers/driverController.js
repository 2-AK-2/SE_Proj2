// controllers/driverController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Ensure upload folders exist
const ensureUploadFolders = () => {
  const base = path.join(process.cwd(), "uploads");
  const folders = ["licenses", "vehicles"];

  if (!fs.existsSync(base)) fs.mkdirSync(base);

  folders.forEach((folder) => {
    const fullPath = path.join(base, folder);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
  });
};

// REGISTER DRIVER
export const registerDriver = async (req, res) => {
  try {
    ensureUploadFolders();

    const { name, email, password } = req.body;
    const licenseFile = req.files?.license?.[0];
    const vehicleDocFile = req.files?.vehicleDoc?.[0];

    if (!name || !email || !password || !licenseFile || !vehicleDocFile)
      return res.status(400).json({ message: "All fields are required" });

    // Check if email exists
    const [existing] = await db.execute(
      "SELECT id FROM drivers WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO drivers (name, email, password, license_doc, vehicle_doc, verified)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      name,
      email,
      hashedPassword,
      licenseFile.path,
      vehicleDocFile.path,
      0,
    ]);

    res.status(201).json({
      message: "Driver registered successfully!",
      driverId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Driver register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN DRIVER
export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const [rows] = await db.execute(
      "SELECT * FROM drivers WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const driver = rows[0];

    const valid = await bcrypt.compare(password, driver.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: driver.id, email: driver.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        verified: driver.verified,
      },
    });
  } catch (err) {
    console.error("❌ Driver login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DUMMY RIDE REQUESTS
export const getRideRequests = async (req, res) => {
  try {
    res.json([
      {
        id: 1,
        rider: "John Doe",
        pickup: "MG Road",
        drop: "Indiranagar",
        fare: 230,
      },
    ]);
  } catch (err) {
    console.error("❌ Error fetching rides:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// RATE RIDER
export const rateRider = async (req, res) => {
  try {
    const { riderId, rating } = req.body;

    if (!riderId || rating == null)
      return res.status(400).json({ message: "Missing fields" });

    await db.execute(
      `INSERT INTO driver_ratings (driver_id, rider_id, rating) VALUES (?, ?, ?)`,
      [req.user.id, riderId, rating]
    );

    res.json({ message: `Rider ${riderId} rated ${rating}/5` });
  } catch (err) {
    console.error("❌ Error rating rider:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
