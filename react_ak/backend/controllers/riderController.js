// backend/controllers/riderController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import riderModel from "../models/riderModel.js";
import cardModel from "../models/cardModel.js";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "cabify_dev_secret";
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "2h";

export const registerRider = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const normalizedEmail = email.toLowerCase();
    const existing = await riderModel.findByEmail(normalizedEmail);
    if (existing) return res.status(409).json({ message: "Email already registered" });

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
    console.error("Register rider error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginRider = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const normalizedEmail = email.toLowerCase();
    const rider = await riderModel.findByEmail(normalizedEmail);

    if (!rider) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: rider.id, email: rider.email, role: "rider" },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    res.json({
      message: "Login successful",
      token,
      rider: { id: rider.id, name: rider.name, email: rider.email },
    });
  } catch (err) {
    console.error("Login rider error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const rider = await riderModel.findById(userId);

    if (!rider) return res.status(404).json({ message: "Rider not found" });

    res.json({
      rider: { id: rider.id, name: rider.name, email: rider.email, phone: rider.phone },
    });
  } catch (err) {
    console.error("Fetch rider profile error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const completeRiderRegistration = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!phone || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const [phoneCheck] = await db.execute("SELECT id FROM riders WHERE phone = ?", [phone]);
    if (phoneCheck.length === 0)
      return res.status(400).json({ message: "Phone not verified" });

    const existing = await riderModel.findByEmail(email.toLowerCase());
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "UPDATE riders SET email = ?, password = ? WHERE phone = ?",
      [email.toLowerCase(), hashed, phone]
    );

    res.json({ message: "Registration completed successfully" });
  } catch (err) {
    console.error("Complete registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addCard = async (req, res, next) => {
  try {
    const riderId = req.user.id;
    const { brand, last4, token } = req.body;

    if (!brand || !last4)
      return res.status(400).json({ message: "brand & last4 required" });

    const created = await cardModel.addCard(riderId, {
      brand,
      last4,
      token: token || "tok_demo",
    });

    res.status(201).json({ message: "Card added", cardId: created.id });
  } catch (err) {
    next(err);
  }
};

export const listCards = async (req, res, next) => {
  try {
    const riderId = req.user.id;
    const cards = await cardModel.getCardsForRider(riderId);
    res.json({ cards });
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const riderId = req.user.id;
    const { id } = req.params;

    const ok = await cardModel.deleteCard(id, riderId);
    if (!ok) return res.status(404).json({ message: "Card not found" });

    res.json({ message: "Card deleted" });
  } catch (err) {
    next(err);
  }
};
