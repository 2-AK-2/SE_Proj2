import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// REGISTER DRIVER
export const registerDriver = (req, res) => {
  const { name, email, password } = req.body;
  const licenseFile = req.files?.license?.[0];
  const vehicleDocFile = req.files?.vehicleDoc?.[0];

  if (!name || !email || !password || !licenseFile || !vehicleDocFile) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const licensePath = licenseFile.path;
  const vehiclePath = vehicleDocFile.path;

  const sql = `
    INSERT INTO drivers (name, email, password, license_doc, vehicle_doc, verified)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, hashedPassword, licensePath, vehiclePath, 0],
    (err, result) => {
      if (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Driver registered successfully!" });
    }
  );
};

// LOGIN DRIVER
export const loginDriver = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM drivers WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const driver = results[0];
    const valid = bcrypt.compareSync(password, driver.password);

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
  });
};

// MOCK RIDE NOTIFICATIONS (for Sprint 1 frontend demo)
export const getRideRequests = (req, res) => {
  const rides = [
    {
      id: 1,
      rider: "John Doe",
      pickup: "MG Road",
      drop: "Indiranagar",
      fare: 230,
    },
  ];
  res.json(rides);
};

// RATE RIDER
export const rateRider = (req, res) => {
  const { riderId, rating } = req.body;
  if (!riderId || !rating)
    return res.status(400).json({ message: "Missing fields" });

  res.json({ message: `Rider ${riderId} rated ${rating}/5` });
};
