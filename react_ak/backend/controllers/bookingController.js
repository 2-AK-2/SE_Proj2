// controllers/bookingController.js
import bookingModel from "../models/bookingModel.js";
import db from "../config/db.js";

/**
 * Very small helper to pick a driver from an array.
 * For now: random selection among verified drivers.
 * Later: replace with spatial nearest-driver logic.
 */
const selectDriverMock = (drivers) => {
  if (!drivers || drivers.length === 0) return null;
  const idx = Math.floor(Math.random() * drivers.length);
  return drivers[idx];
};

// POST /api/bookings/create
export const createBooking = async (req, res) => {
  try {
    // rider must be authenticated (verifyToken sets req.user)
    const riderId = req.user?.id;
    if (!riderId) return res.status(401).json({ message: "Unauthorized" });

    const { pickup, drop_location, fare, eta } = req.body;
    if (!pickup || !drop_location) {
      return res.status(400).json({ message: "pickup and drop_location required" });
    }

    // Create booking (pending)
    const { bookingId } = await bookingModel.createBooking({
      rider_id: riderId,
      pickup,
      drop_location,
      fare: fare || 0,
      eta: eta || 0,
    });

    // Attempt to find an available driver (mock)
    const drivers = await bookingModel.getAvailableDrivers();
    const driver = selectDriverMock(drivers);

    if (!driver) {
      // No driver found: leave booking pending
      return res.status(200).json({
        message: "Booking created, but no drivers currently available",
        bookingId,
      });
    }

    // Assign the driver
    await bookingModel.assignDriver(bookingId, driver.id);

    // Optionally: notify driver via socket / push (TODO)
    // For now driver will poll /api/bookings/driver to see assigned bookings

    return res.status(200).json({
      message: "Driver assigned",
      bookingId,
      driver: { id: driver.id, name: driver.name, email: driver.email },
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
    if (!bookingId) return res.status(400).json({ message: "Invalid booking id" });

    const booking = await bookingModel.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.json(booking);
  } catch (err) {
    console.error("❌ getBooking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/bookings/driver (driver polls assigned bookings)
export const getDriverBookings = async (req, res) => {
  try {
    const driverId = req.user?.id;
    if (!driverId) return res.status(401).json({ message: "Unauthorized" });

    // Fetch assigned rides for this driver
    const [rows] = await db.execute(
      `SELECT r.id, r.rider_id, r.pickup, r.drop_location, r.fare, r.eta, r.status, r.created_at, 
              ri.name AS rider_name, ri.phone AS rider_phone
       FROM rides r
       LEFT JOIN riders ri ON ri.id = r.rider_id
       WHERE r.driver_id = ? AND r.status IN ('assigned', 'pending')`,
      [driverId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("❌ getDriverBookings error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/bookings/:id/update-status
export const updateBookingStatus = async (req, res) => {
  try {
    const driverId = req.user?.id; // driver or rider can call depending on flow
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!bookingId || !status)
      return res.status(400).json({ message: "bookingId and status required" });

    const allowed = ["accepted", "rejected", "completed", "ongoing"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    // Optional: you may enforce that only assigned driver can accept/reject
    // Simple check: if updating to accepted/rejected, ensure req.user is the assigned driver
    if (["accepted", "rejected"].includes(status)) {
      const booking = await bookingModel.getBookingById(bookingId);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
      if (booking.driver_id !== driverId)
        return res.status(403).json({ message: "Only assigned driver may update status" });
    }

    await bookingModel.updateStatus(bookingId, status);

    return res.json({ message: `Booking ${status}` });
  } catch (err) {
    console.error("❌ updateBookingStatus error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
