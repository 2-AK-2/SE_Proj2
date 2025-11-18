// routes/driverLocationRoutes.js
import express from "express";
import { getDriverLocation, updateDriverLocation } from "../controllers/driverLocationController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", getDriverLocation);               // public: read location
router.post("/update", verifyToken, updateDriverLocation); // authenticated drivers update their own location

export default router;
