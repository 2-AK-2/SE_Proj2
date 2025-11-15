// routes/bookingRoutes.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createBooking,
  getBooking,
  getDriverBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

// Rider creates a booking (authenticated)
router.post("/create", verifyToken, createBooking);

// Get booking details
router.get("/:id", verifyToken, getBooking);

// Driver polls for assigned bookings
router.get("/driver/assigned", verifyToken, getDriverBookings);

// Driver (or authorized user) updates status for booking id
router.post("/:id/update-status", verifyToken, updateBookingStatus);

export default router;
