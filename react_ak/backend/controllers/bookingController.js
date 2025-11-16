// controllers/bookingController.js
import bookingModel from "../models/bookingModel.js";
import db from "../config/db.js";

// POST /api/bookings/create
export const createBooking = async (req, res) => {
  try {
    const riderId = req.user?.id;
    if (!riderId) return res.status(401).json({ message: "Unauthorized" });

    const { pickup, drop_location, fare, eta, pickup_lat, pickup_lng } = req.body;

    if (!pickup || !drop_location)
      return res.status(400).json({ message: "pickup and drop_location required" });

    // 1️⃣ Create booking with pending status
    const { bookingId } = await bookingModel.createBooking({
      rider_id: riderId,
      pickup,
      drop_location,
      fare: fare || 0,
      eta: eta || 0,
    });

    // 2️⃣ Validate coordinates
    const lat = pickup_lat || 12.9716;
    const lng = pickup_lng || 77.5946;

    // 3️⃣ Find nearest driver using Haversine formula
    const nearestDriver = await bookingModel.findNearestDriver(lat, lng);

    // No drivers → return booking but pending
    if (!nearestDriver) {
      return res.status(200).json({
        message: "Booking created but no drivers available",
        bookingId,
      });
    }

    // 4️⃣ Assign driver
    await bookingModel.assignDriver(bookingId, nearestDriver.id);

    res.status(200).json({
      message: "Driver assigned successfully",
      bookingId,
      driver: {
        id: nearestDriver.id,
        name: nearestDriver.name,
        email: nearestDriver.email,
        latitude: nearestDriver.latitude,
        longitude: nearestDriver.longitude,
      },
    });
  } catch (err) {
    console.error("❌ createBooking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/bookings/:id
export const getBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    if (!bookingId)
      return res.status(400).json({ message: "Invalid booking id" });

    const booking = await bookingModel.getBookingById(bookingId);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    console.error("❌ getBooking error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Driver assigned bookings
export const getDriverBookings = async (req, res) => {
  try {
    const driverId = req.user?.id;
    if (!driverId) return res.status(401).json({ message: "Unauthorized" });

    const [rows] = await db.execute(
      `SELECT r.id, r.rider_id, r.pickup, r.drop_location, r.fare, r.eta, r.status, r.created_at,
              ri.name AS rider_name, ri.phone AS rider_phone
       FROM rides r
       LEFT JOIN riders ri ON ri.id = r.rider_id
       WHERE r.driver_id = ? AND r.status IN ('assigned', 'pending')`,
      [driverId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ getDriverBookings error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const driverId = req.user?.id;
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!bookingId || !status)
      return res.status(400).json({ message: "bookingId and status required" });

    const allowed = ["accepted", "rejected", "completed", "ongoing"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    if (["accepted", "rejected"].includes(status)) {
      const booking = await bookingModel.getBookingById(bookingId);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
      if (booking.driver_id !== driverId)
        return res.status(403).json({ message: "Only assigned driver can update status" });
    }

    await bookingModel.updateStatus(bookingId, status);
    res.json({ message: `Booking ${status}` });
  } catch (err) {
    console.error("❌ updateBookingStatus error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
