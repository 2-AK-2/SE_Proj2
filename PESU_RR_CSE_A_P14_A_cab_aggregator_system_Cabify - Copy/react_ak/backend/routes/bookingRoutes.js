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

router.post("/create", verifyToken, createBooking);
router.get("/:id", verifyToken, getBooking);
router.post("/:id/update-status", verifyToken, updateBookingStatus);
router.post("/pay", verifyToken, payForRide);
router.get("/:id/driver-details", verifyToken, getDriverDetails);

export default router;
