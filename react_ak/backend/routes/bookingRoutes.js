// backend/routes/bookingRoutes.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createBooking,
  getBooking,
  updateBookingStatus,
  payForRide,
  getDriverDetails,
} from "../controllers/bookingController.js";

const router = express.Router();

// Rider creates a booking
router.post("/create", verifyToken, createBooking);

// Get booking info
router.get("/:id", verifyToken, getBooking);

// Driver updates status (accept/reject/complete)
router.post("/:id/update-status", verifyToken, updateBookingStatus);

// Get driver details for a booking
router.get("/:id/driver-details", verifyToken, getDriverDetails);

// Payment (mock) — marks booking paid
router.post("/pay", verifyToken, payForRide);

export default router;
