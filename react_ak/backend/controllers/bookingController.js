// controllers/bookingController.js
import bookingModel from "../models/bookingModel.js";
import db from "../config/db.js";

// -----------------------------------------------------------------------
// 1️⃣ Rider creates booking → status = 'pending', NO driver assigned
// -----------------------------------------------------------------------
export const createBooking = async (req, res) => {
  try {
    const riderId = req.user?.id;
    if (!riderId) return res.status(401).json({ message: "Unauthorized" });

    const { pickup, drop_location, fare, eta } = req.body;
    if (!pickup || !drop_location)
      return res.status(400).json({ message: "pickup & drop required" });

    const { bookingId } = await bookingModel.createBooking({
      rider_id: riderId,
      pickup,
      drop_location,
      fare,
      eta,
    });

    return res.json({
      message: "Booking created. Waiting for driver acceptance.",
      bookingId,
    });

  } catch (err) {
    console.error("❌ createBooking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------------------------
// 2️⃣ Rider fetches booking status (used by wait page)
// -----------------------------------------------------------------------
export const getBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    if (!bookingId) return res.status(400).json({ message: "Invalid booking id" });

    const booking = await bookingModel.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.json(booking);
  } catch (err) {
    console.error("❌ getBooking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------------------------
// 3️⃣ Driver sees ALL pending rides (driver_id NULL)
// -----------------------------------------------------------------------
export const getDriverBookings = async (req, res) => {
  try {
    const driverId = req.user?.id;
    if (!driverId) return res.status(401).json({ message: "Unauthorized" });

    const [rows] = await db.execute(
      `SELECT r.id, r.pickup, r.drop_location, r.fare, r.status
       FROM rides r
       WHERE r.driver_id IS NULL
       AND r.status = 'pending'
       ORDER BY r.created_at ASC`
    );

    return res.json(rows);
  } catch (err) {
    console.error("❌ getDriverBookings error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------------------------
// 4️⃣ Driver accepts → driver_id set, status = "accepted"
// -----------------------------------------------------------------------
export const updateBookingStatus = async (req, res) => {
  try {
    const driverId = req.user?.id;
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!bookingId || !status)
      return res.status(400).json({ message: "bookingId and status required" });

    const allowed = ["accepted", "rejected", "completed"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    if (status === "accepted") {
      await bookingModel.assignDriver(bookingId, driverId);
    } else {
      await bookingModel.updateStatus(bookingId, status);
    }

    return res.json({ message: `Booking ${status}` });

  } catch (err) {
    console.error("❌ updateBookingStatus error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
