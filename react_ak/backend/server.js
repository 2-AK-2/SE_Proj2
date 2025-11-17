import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import driverRoutes from "./routes/driverRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import fareRoutes from "./routes/fareRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import driverLocationRoutes from "./routes/driverLocationRoutes.js";   // ⭐ NEW (Live Tracking)

dotenv.config();
const app = express();

// -------------------------------
// Middleware
// -------------------------------
app.use(cors());
app.use(express.json());

// Static uploads (driver documents)
app.use("/uploads", express.static("uploads"));

// -------------------------------
// API ROUTES
// -------------------------------
app.use("/api/auth", authRoutes);          // OTP only
app.use("/api/riders", riderRoutes);       // Email login + profile
app.use("/api/driver", driverRoutes);      // Driver auth + rating
app.use("/api/fare", fareRoutes);          // Fare estimator
app.use("/api/bookings", bookingRoutes);   // Ride booking
app.use("/api/location", driverLocationRoutes);  // ⭐ NEW — Driver live tracking

// -------------------------------
// Health check
// -------------------------------
app.get("/", (req, res) => {
  res.send("🚗 Cabify backend running with live tracking enabled.");
});

// -------------------------------
// Start server
// -------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
