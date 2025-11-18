// middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "cabify_dev_secret";

export const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      return res.status(401).json({ message: "Malformed token" });

    const token = parts[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ Token verify error:", err);
        return res.status(401).json({ message: "Invalid token" });
      }

      // Attach user info (id, role if present)
      req.user = {
        id: decoded.id,
        role: decoded.role || "rider",
      };
      next();
    });
  } catch (err) {
    next(err);
  }
};
