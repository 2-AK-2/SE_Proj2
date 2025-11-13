import express from "express";
import {
  loginRider,
  registerRider,
  getProfile,
  completeRiderRegistration,   // ✅ ADDED IMPORT
} from "../controllers/riderController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Email-password registration (unused now)
router.post("/register", registerRider);

// Final step after OTP → email + password
router.post("/complete-registration", completeRiderRegistration);   // ✅ FIXED

// Login
router.post("/login", loginRider);

// Protected profile
router.get("/profile", verifyToken, getProfile);

export default router;
