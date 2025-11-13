import express from "express";
import { loginRider, registerRider, getProfile } from "../controllers/riderController.js";
import { verifyToken } from "../utils/auth.js";

const router = express.Router();

// POST /api/riders/register
router.post("/register", registerRider);

// POST /api/riders/login
router.post("/login", loginRider);

// GET /api/riders/profile (protected)
router.get("/profile", verifyToken, getProfile);

export default router;
