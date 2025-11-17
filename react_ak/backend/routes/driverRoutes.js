import express from "express";
import {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
  changeDriverPassword
} from "../controllers/driverController.js";
import { verifyToken } from "../middleware/auth.js";
import { getRideRequests } from "../controllers/driverController.js";

const router = express.Router();

// Register
router.post("/register", registerDriver);

// Login
router.post("/login", loginDriver);
router.get("/rides", verifyToken, getRideRequests);


// Profile
router.get("/profile", verifyToken, getDriverProfile);

// Update (name + phone)
router.post("/profile/update", verifyToken, updateDriverProfile);

// Change password
router.post("/profile/change-password", verifyToken, changeDriverPassword);

export default router;
