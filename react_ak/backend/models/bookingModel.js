// models/bookingModel.js
import db from "../config/db.js";

const bookingModel = {
  // 1️⃣ Create a new booking (pending)
  async createBooking({ rider_id, pickup, drop_location, fare, eta }) {
    const [result] = await db.execute(
      `INSERT INTO rides (rider_id, pickup, drop_location, fare, eta, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [rider_id, pickup, drop_location, fare, eta]
    );

    return { bookingId: result.insertId };
  },

  // 2️⃣ Assign nearest driver
  async assignDriver(bookingId, driverId) {
    await db.execute(
      `UPDATE rides SET driver_id = ?, status = 'assigned'
       WHERE id = ?`,
      [driverId, bookingId]
    );
  },

  // 3️⃣ Update booking status
  async updateStatus(bookingId, status) {
    await db.execute(
      `UPDATE rides SET status = ? WHERE id = ?`,
      [status, bookingId]
    );
  },

  // 4️⃣ Get booking by ID
  async getBookingById(bookingId) {
    const [rows] = await db.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [bookingId]
    );
    return rows[0] || null;
  },

  // 5️⃣ Find available drivers (for matching)
  async getAvailableDrivers() {
    const [drivers] = await db.execute(
      `SELECT id, name, email
       FROM drivers
       WHERE verified = 1`
    );
    return drivers;
  },

  // 6️⃣ Get all bookings for a rider
  async getBookingsForRider(riderId) {
    const [rows] = await db.execute(
      `SELECT * FROM rides WHERE rider_id = ? ORDER BY created_at DESC`,
      [riderId]
    );
    return rows;
  }
};

export default bookingModel;
