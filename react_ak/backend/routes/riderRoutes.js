import express from "express";
import { loginRider, registerRider, getProfile } from "../controllers/riderController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerRider);
router.post("/login", loginRider);
router.get("/profile", verifyToken, getProfile);

export default router;
