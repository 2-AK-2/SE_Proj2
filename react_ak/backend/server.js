import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import driverRoutes from "./routes/driverRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import fareRoutes from "./routes/fareRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads
app.use("/uploads", express.static("uploads"));

// ROUTES (✔ Corrected)
app.use("/api/auth", authRoutes);        // OTP only
app.use("/api/riders", riderRoutes);     // Login + Register + Profile
app.use("/api/driver", driverRoutes);    // Driver login + register + rating
app.use("/api/fare", fareRoutes);        // Fare estimator

// Health check
app.get("/", (req, res) => {
  res.send("🚗 Cabify backend running.");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
