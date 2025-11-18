// controllers/driverController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";
import driverModel from "../models/driverModel.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "24h";

// REGISTER DRIVER (with uploads)
export const registerDriver = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) return res.status(400).json({ message: "All fields required" });

    if (!req.files?.license || !req.files?.vehicleDoc) return res.status(400).json({ message: "Documents required" });

    const license_doc = req.files.license[0].filename;
    const vehicle_doc = req.files.vehicleDoc[0].filename;

    const existing = await driverModel.findByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const created = await driverModel.create({ name, email, phone, password: hashed, license_doc, vehicle_doc, verified: 0 });

    res.status(201).json({ message: "Driver registered (pending verification)", id: created.insertId });
  } catch (err) {
    next(err);
  }
};

// LOGIN DRIVER
export const loginDriver = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const driver = await driverModel.findByEmail(email);
    if (!driver) return res.status(401).json({ message: "Invalid login" });

    const ok = await bcrypt.compare(password, driver.password);
    if (!ok) return res.status(401).json({ message: "Invalid login" });

    if (!driver.verified) return res.status(403).json({ message: "Driver not verified yet" });

    const token = jwt.sign({ id: driver.id, role: "driver" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    res.json({
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getDriverProfile = async (req, res, next) => {
  try {
    const driver = await driverModel.findById(req.user.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({
      id: driver.id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      profile_picture: driver.profile_picture,
      license_doc: driver.license_doc,
      vehicle_doc: driver.vehicle_doc,
      verified: driver.verified,
    });
  } catch (err) {
    next(err);
  }
};

export const updateDriverProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    // optionally accept profile_picture file
    const profile_picture = req.files?.profile_picture ? req.files.profile_picture[0].filename : null;

    await driverModel.updateProfile(req.user.id, { name, phone, profile_picture });
    res.json({ message: "Profile updated" });
  } catch (err) {
    next(err);
  }
};

export const changeDriverPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Both passwords required" });

    const driver = await driverModel.findById(req.user.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const ok = await bcrypt.compare(oldPassword, driver.password);
    if (!ok) return res.status(400).json({ message: "Old password wrong" });

    const hashed = await bcrypt.hash(newPassword, 12);
    await driverModel.updatePassword(req.user.id, hashed);

    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
};

export const getRideRequests = async (req, res, next) => {
  try {
    // Later: accept location to filter by nearest
    const rides = await (await import("../models/bookingModel.js")).default.getPendingRidesNearby();
    res.json(rides);
  } catch (err) {
    next(err);
  }
};
