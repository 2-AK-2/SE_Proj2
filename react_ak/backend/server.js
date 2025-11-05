import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import driverRoutes from "./routes/driverRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ use import instead of require

dotenv.config();
const app = express();

// ✅ Middleware setup
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/driver", driverRoutes);
app.use("/api/rider", authRoutes); // Rider registration (your feature)

// ✅ Root route for quick health check
app.get("/", (req, res) => {
  res.send("🚗 Cabify backend is running with Rider Registration enabled!");
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
