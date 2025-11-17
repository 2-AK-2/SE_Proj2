import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createBooking,
  getBooking,
  getDriverBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

// Rider creates a booking
router.post("/create", verifyToken, createBooking);

// DRIVER ROUTE MUST COME BEFORE /:id  ❗❗
router.get("/driver", verifyToken, getDriverBookings);

// Get booking details (rider)
router.get("/:id", verifyToken, getBooking);

// Update booking status
router.post("/:id/update-status", verifyToken, updateBookingStatus);

export default router;
