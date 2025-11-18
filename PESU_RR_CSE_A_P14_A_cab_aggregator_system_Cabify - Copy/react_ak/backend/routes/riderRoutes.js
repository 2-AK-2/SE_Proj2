// backend/routes/riderRoutes.js
import express from "express";
import {
  loginRider,
  registerRider,
  getProfile,
  completeRiderRegistration,
  addCard,
  listCards,
  deleteCard,
} from "../controllers/riderController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// =======================================
// Rider Authentication Routes
// =======================================

// Email/password registration
router.post("/register", registerRider);

// Final step after OTP verification
router.post("/complete-registration", completeRiderRegistration);

// Login
router.post("/login", loginRider);

// Protected profile route
router.get("/profile", verifyToken, getProfile);

// =======================================
// Rider Card Routes
// =======================================

// Add a new card
router.post("/cards", verifyToken, addCard);

// List all saved cards
router.get("/cards", verifyToken, listCards);

// Delete a card by ID
router.delete("/cards/:id", verifyToken, deleteCard);

export default router;
