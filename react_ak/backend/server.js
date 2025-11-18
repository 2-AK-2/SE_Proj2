// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";

import driverRoutes from "./routes/driverRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import fareRoutes from "./routes/fareRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import driverLocationRoutes from "./routes/driverLocationRoutes.js";

dotenv.config();
const app = express();

// Basic middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiter (basic)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// serve uploaded files (driver docs)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/fare", fareRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/location", driverLocationRoutes);

// Health
app.get("/", (req, res) => res.send("🚗 Cabify backend running"));

// Global error handler
// (place after all routes)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
