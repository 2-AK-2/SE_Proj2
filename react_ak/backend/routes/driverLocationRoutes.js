import express from "express";
import { getDriverLocation } from "../controllers/driverLocationController.js";

const router = express.Router();

router.get("/:id", getDriverLocation);

export default router;
