// controllers/bookingController.js
import bookingModel from "../models/bookingModel.js";
import db from "../config/db.js";

// -----------------------------------------------------------------------
// 1️⃣ Rider creates a booking → status = 'pending'
// -----------------------------------------------------------------------
export const createBooking = async (req, res) => {
  try {
    const riderId = req.user?.id;
    if (!riderId)
      return res.status(401).json({ message: "Unauthorized" });

    const { pickup, drop_location, fare, eta } = req.body;

    if (!pickup || !drop_location)
      return res.status(400).json({ message: "pickup and drop_location required" });

    // Create pending ride
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
// 2️⃣ Rider fetches booking status
// -----------------------------------------------------------------------
export const getBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    if (!bookingId)
      return res.status(400).json({ message: "Invalid booking id" });

    const booking = await bookingModel.getBookingById(bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    return res.json(booking);

  } catch (err) {
    console.error("❌ getBooking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------------------------
// 3️⃣ Driver sees pending ride requests (driver_id NULL)
// -----------------------------------------------------------------------
export const getDriverBookings = async (req, res) => {
  try {
    const driverId = req.user?.id;
    if (!driverId)
      return res.status(401).json({ message: "Unauthorized" });

    const [rows] = await db.execute(
      `SELECT id, pickup, drop_location, fare, status
       FROM rides
       WHERE driver_id IS NULL
       AND status = 'pending'
       ORDER BY id DESC`
    );

    return res.json(rows);

  } catch (err) {
    console.error("❌ getDriverBookings error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------------------------
// 4️⃣ Driver updates booking status → accepted / rejected / completed
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

    // Accept ride = assign driver
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
