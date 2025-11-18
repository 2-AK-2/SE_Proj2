// backend/models/bookingModel.js
import db from "../config/db.js";

const bookingModel = {
  // Create a new ride booking (status = pending)
  async createBooking({ rider_id, pickup, drop_location, fare, eta, pickup_lat = null, pickup_lng = null }) {
    const [result] = await db.execute(
      `INSERT INTO rides (rider_id, pickup, drop_location, pickup_lat, pickup_lng, fare, eta, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [rider_id, pickup, drop_location, pickup_lat, pickup_lng, fare, eta]
    );

    return { bookingId: result.insertId };
  },

  // Assign driver when driver accepts or auto-assign
  async assignDriver(bookingId, driverId) {
    const [result] = await db.execute(
      `UPDATE rides
       SET driver_id = ?, status = 'accepted'
       WHERE id = ? AND (driver_id IS NULL OR driver_id = ?)`,
      [driverId, bookingId, driverId]
    );

    // result.affectedRows === 1 means assignment successful
    return result.affectedRows === 1;
  },

  // Update status (rejected / completed / accepted)
  async updateStatus(bookingId, status) {
    await db.execute(
      `UPDATE rides SET status = ? WHERE id = ?`,
      [status, bookingId]
    );
  },

  // Mark as paid (mock)
  async markAsPaid(bookingId) {
    // Ensure schema includes payment_status. If not present, this query will fail.
    // If your schema doesn't have payment_status, either add it:
    // ALTER TABLE rides ADD COLUMN payment_status ENUM('pending','paid') DEFAULT 'pending';
    try {
      await db.execute(
        `UPDATE rides SET payment_status = 'paid' WHERE id = ?`,
        [bookingId]
      );
    } catch (err) {
      // If column doesn't exist, log but don't crash — you may want to add the column
      console.warn("markAsPaid failed (maybe missing payment_status column):", err.message);
      // fallback: store a small payment log (optional)
      await db.execute(
        `INSERT INTO ride_estimates (pickup, destination, fare, eta) VALUES (?, ?, ?, ?)`,
        ["payment_fallback", "n/a", 0.0, 0]
      );
    }
  },

  // Fetch a booking by ID
  async getBookingById(bookingId) {
    const [rows] = await db.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [bookingId]
    );

    return rows[0] || null;
  },

  // Get all bookings for a rider (history page)
  async getBookingsForRider(riderId) {
    const [rows] = await db.execute(
      `SELECT * FROM rides WHERE rider_id = ? ORDER BY id DESC`,
      [riderId]
    );

    return rows;
  },

  // (optional) get pending rides near drivers - not used currently
  async getPendingRidesNearby() {
    const [rows] = await db.execute(
      `SELECT id, pickup, drop_location, fare, eta FROM rides WHERE driver_id IS NULL AND status = 'pending' ORDER BY id DESC`
    );
    return rows;
  }
};

export default bookingModel;
