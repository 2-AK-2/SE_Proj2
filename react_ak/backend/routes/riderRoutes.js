// backend/routes/riderRoutes.js
import express from "express";
import {
  loginRider,
  registerRider,
  getProfile,
  completeRiderRegistration,
} from "../controllers/riderController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Email-password registration (optional)
router.post("/register", registerRider);

// Finalize after OTP (phone was verified earlier)
router.post("/complete-registration", completeRiderRegistration);

// Login (email/password)
router.post("/login", loginRider);

// Protected profile
router.get("/profile", verifyToken, getProfile);

export default router;
