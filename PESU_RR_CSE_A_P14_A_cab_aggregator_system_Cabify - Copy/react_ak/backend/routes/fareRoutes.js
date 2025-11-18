// routes/fareRoutes.js
import express from "express";
import { getFareEstimate } from "../controllers/fareController.js";
const router = express.Router();

router.post("/estimate", getFareEstimate);

export default router;
