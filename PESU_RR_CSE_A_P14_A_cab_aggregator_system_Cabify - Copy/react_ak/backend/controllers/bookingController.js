// backend/controllers/bookingController.js
import bookingModel from "../models/bookingModel.js";
import { findNearestDriver } from "../utils/findNearestDriver.js";
import db from "../config/db.js";

/* =====================================================
   Helpers
   - deriveRole: makes controller tolerant of tokens that
     don't include a role claim (backwards compatible).
===================================================== */
function deriveRole(user) {
  if (!user) return undefined;
  if (user.role) return user.role;
  // tokens created for riders earlier contained email/id — treat those as riders
  if (user.email || user.riderId || user.id) return "rider";
  return undefined;
}

/* ===========================================
   CREATE BOOKING
   - creates a ride and tries to auto-assign a driver
=========================================== */
export const createBooking = async (req, res) => {
  try {
    const riderId = req.user?.id;
    if (!riderId) return res.status(401).json({ message: "Unauthorized" });

    const { pickup, drop_location, fare, eta, pickup_lat, pickup_lng } = req.body;
    if (!pickup || !drop_location)
      return res.status(400).json({ message: "pickup & drop_location required" });

    const { bookingId } = await bookingModel.createBooking({
      rider_id: riderId,
      pickup,
      drop_location,
      fare,
      eta,
      pickup_lat,
      pickup_lng,
    });

    // Try auto assign nearest driver (demo purpose)
    const nearestDriver = await findNearestDriver(
      pickup_lat || 12.9716,
      pickup_lng || 77.5946
    );

    if (nearestDriver) {
      await bookingModel.assignDriver(bookingId, nearestDriver.id);
      await bookingModel.updateStatus(bookingId, "assigned");
      return res.json({
        message: "Driver assigned automatically",
        bookingId,
        driver_id: nearestDriver.id,
      });
    }

    return res.json({
      message: "Booking created, waiting for driver",
      bookingId,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===========================================
   GET BOOKING DETAILS
=========================================== */
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

/* ===========================================
   UPDATE BOOKING STATUS (driver/rider actions)
   - Accept / Reject (driver)
   - on_the_way (driver)
   - start (rider)
   - completed (rider)  <-- fixed to permit rider completion
=========================================== */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const actorId = req.user?.id;
    const rawRole = deriveRole(req.user);
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!bookingId || !status)
      return res.status(400).json({ message: "bookingId and status required" });

    const booking = await bookingModel.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // DRIVER: Accept
    if (status === "accepted") {
      if (rawRole !== "driver")
        return res.status(403).json({ message: "Only driver can accept" });

      // Try to assign driver (will fail if already assigned to another)
      const ok = await bookingModel.assignDriver(bookingId, actorId);
      if (!ok) return res.status(400).json({ message: "Ride already assigned" });

      await bookingModel.updateStatus(bookingId, "accepted");
      return res.json({ message: "Ride accepted" });
    }

    // DRIVER: Reject
    if (status === "rejected") {
      if (rawRole !== "driver")
        return res.status(403).json({ message: "Only driver can reject" });

      await bookingModel.rejectRide(bookingId);
      return res.json({ message: "Ride rejected" });
    }

    // DRIVER: on_the_way
    if (status === "on_the_way") {
      if (rawRole !== "driver")
        return res.status(403).json({ message: "Only driver can set on_the_way" });

      await bookingModel.markOnTheWay(bookingId);
      return res.json({ message: "Driver is on the way" });
    }

    // RIDER: start ride (move to in_progress)
    if (status === "start") {
      if (rawRole !== "rider")
        return res.status(403).json({ message: "Only rider can start ride" });

      if (!booking.driver_id)
        return res.status(400).json({ message: "No driver assigned" });

      if (!["accepted", "assigned", "on_the_way"].includes(booking.status))
        return res.status(400).json({ message: `Cannot start ride from status '${booking.status}'` });

      await bookingModel.setInProgress(bookingId);
      return res.json({ message: "Ride started" });
    }

    // RIDER: complete ride (rider finalizes and triggers payment flow)
    if (status === "completed") {
      if (rawRole !== "rider")
        return res.status(403).json({ message: "Only rider can complete ride" });

      if (actorId !== booking.rider_id)
        return res.status(403).json({ message: "Not your ride" });

      if (!["in_progress", "accepted", "on_the_way"].includes(booking.status))
        return res.status(400).json({ message: `Cannot complete ride from status '${booking.status}'` });

      await bookingModel.updateStatus(bookingId, "completed");
      return res.json({ message: "Ride completed by rider" });
    }

    // Unknown action
    return res.status(400).json({ message: "Unknown status action" });
  } catch (err) {
    console.error("updateBookingStatus error:", err);
    next(err);
  }
};

/* ===========================================
   PAYMENT (demo)
=========================================== */
export const payForRide = async (req, res, next) => {
  try {
    const riderId = req.user.id;
    const { bookingId, cardId } = req.body;

    const booking = await bookingModel.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ message: "Ride not found" });
    if (booking.rider_id !== riderId) return res.status(403).json({ message: "Not your ride" });
    if (booking.payment_status === "paid") return res.status(400).json({ message: "Already paid" });

    // Demo: mark paid
    await bookingModel.markAsPaid(bookingId);
    return res.json({ message: "Payment successful", bookingId });
  } catch (err) {
    console.error("payForRide error:", err);
    next(err);
  }
};

/* ===========================================
   GET DRIVER DETAILS (for a booking)
=========================================== */
export const getDriverDetails = async (req, res) => {
  try {
    const { id } = req.params; // booking id

    const [rows] = await db.execute("SELECT driver_id FROM rides WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Booking not found" });

    const driverId = rows[0].driver_id;
    if (!driverId) return res.json({ driver: null });

    const [driverRows] = await db.execute(
      "SELECT id, name, email, phone, latitude, longitude FROM drivers WHERE id = ?",
      [driverId]
    );

    if (driverRows.length === 0) return res.status(404).json({ message: "Driver not found" });
    res.json({ driver: driverRows[0] });
  } catch (err) {
    console.error("Driver details error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
