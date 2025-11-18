// backend/controllers/bookingController.js
import bookingModel from "../models/bookingModel.js";
import { findNearestDriver } from "../utils/findNearestDriver.js";
import db from "../config/db.js";

/* ----------------------------------------------------------
   CREATE BOOKING + AUTO-ASSIGN DRIVER
----------------------------------------------------------- */
export const createBooking = async (req, res) => {
  try {
    const riderId = req.user?.id;
    if (!riderId) return res.status(401).json({ message: "Unauthorized" });

    const { pickup, drop_location, fare, eta, pickup_lat, pickup_lng } = req.body;

    if (!pickup || !drop_location)
      return res.status(400).json({ message: "pickup & drop_location required" });

    // create ride record (status defaults to pending)
    const { bookingId } = await bookingModel.createBooking({
      rider_id: riderId,
      pickup,
      drop_location,
      fare,
      eta,
      pickup_lat,
      pickup_lng,
    });

    // try to find nearest driver
    const nearestDriver = await findNearestDriver(
      pickup_lat || 12.9716,
      pickup_lng || 77.5946
    );

    if (!nearestDriver) {
      return res.status(200).json({ message: "Booking created, no drivers available", bookingId });
    }

    // assign driver
    await bookingModel.assignDriver(bookingId, nearestDriver.id);

    return res.status(201).json({
      message: "Driver assigned",
      bookingId,
      driver_id: nearestDriver.id,
    });

  } catch (err) {
    console.error("createBooking:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ----------------------------------------------------------
   GET BOOKING
----------------------------------------------------------- */
export const getBooking = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    if (!bookingId) return res.status(400).json({ message: "Invalid booking id" });

    const booking = await bookingModel.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------------------------
   DRIVER ACCEPT/REJECT/COMPLETE RIDE
----------------------------------------------------------- */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driverId = req.user?.id;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status required" });

    const booking = await bookingModel.getBookingById(Number(id));
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Completed: any assigned driver or system can mark completed (business rule)
    if (status === "completed") {
      // only assigned driver OR system/admin maybe should mark completed,
      // but we'll check driver ownership if driver_id exists
      if (booking.driver_id && booking.driver_id !== driverId) {
        return res.status(403).json({ message: "Not authorized to complete this ride" });
      }
      await bookingModel.updateStatus(Number(id), "completed");
      return res.json({ message: "Ride marked completed" });
    }

    // Accept: driver accepts a pending ride
    if (status === "accepted") {
      if (booking.driver_id && booking.driver_id !== driverId) {
        return res.status(400).json({ message: "Ride already assigned" });
      }
      // try to assign to this driver
      await bookingModel.assignDriver(Number(id), driverId);
      await bookingModel.updateStatus(Number(id), "accepted");
      return res.json({ message: "Ride accepted" });
    }

    // Rejected
    if (status === "rejected") {
      // only the assigned driver or system can reject
      if (booking.driver_id && booking.driver_id !== driverId) {
        return res.status(403).json({ message: "Not authorized to reject this ride" });
      }
      await bookingModel.updateStatus(Number(id), "rejected");
      return res.json({ message: "Ride rejected" });
    }

    return res.status(400).json({ message: "Unsupported status" });
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------------------------
   PAY FOR RIDE (mock — marks as paid)
----------------------------------------------------------- */
export const payForRide = async (req, res, next) => {
  try {
    const riderId = req.user?.id;
    const { bookingId, cardId } = req.body;

    if (!bookingId) return res.status(400).json({ message: "bookingId required" });

    const booking = await bookingModel.getBookingById(Number(bookingId));
    if (!booking) return res.status(404).json({ message: "Ride not found" });

    if (booking.rider_id !== riderId) return res.status(403).json({ message: "Not your ride" });

    // If schema lacks payment_status column this will still run but will update nothing.
    if (booking.payment_status === "paid")
      return res.status(400).json({ message: "Already paid" });

    // In production integrate with payment gateway here.
    await bookingModel.markAsPaid(Number(bookingId));

    return res.json({ message: "Payment successful", bookingId: Number(bookingId) });
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------------------------
   GET DRIVER DETAILS FOR A BOOKING
----------------------------------------------------------- */
export const getDriverDetails = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    if (!bookingId) return res.status(400).json({ message: "Invalid booking id" });

    // 1. Get booking
    const [rows] = await db.execute("SELECT driver_id FROM rides WHERE id = ?", [bookingId]);

    if (rows.length === 0) return res.status(404).json({ message: "Booking not found" });

    const driverId = rows[0].driver_id;
    if (!driverId) return res.status(200).json({ driver: null });

    // 2. Fetch assigned driver details
    const [driverRows] = await db.execute(
      "SELECT id, name, email, phone, latitude, longitude FROM drivers WHERE id = ?",
      [driverId]
    );

    if (driverRows.length === 0) return res.status(404).json({ message: "Driver not found" });

    res.json({ driver: driverRows[0] });
  } catch (err) {
    console.error("❌ Driver details error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
