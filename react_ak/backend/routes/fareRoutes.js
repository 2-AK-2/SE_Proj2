// routes/fareRoutes.js
import express from "express";
import { getFareEstimate } from "../controllers/fareController.js";

const router = express.Router();

// 🎯 Fare & ETA estimation
router.post("/estimate", getFareEstimate);

export default router;
