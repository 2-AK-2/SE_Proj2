// models/bookingModel.js
import db from "../config/db.js";

const bookingModel = {

  // -------------------------------------------------------------------
  // 1️⃣ Create a new ride booking (status = pending)
  // -------------------------------------------------------------------
  async createBooking({ rider_id, pickup, drop_location, fare, eta }) {
    const [result] = await db.execute(
      `INSERT INTO rides (rider_id, pickup, drop_location, fare, eta, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [rider_id, pickup, drop_location, fare, eta]
    );

    return { bookingId: result.insertId };
  },

  // -------------------------------------------------------------------
  // 2️⃣ Assign driver when driver accepts
  // -------------------------------------------------------------------
  async assignDriver(bookingId, driverId) {
    await db.execute(
      `UPDATE rides
       SET driver_id = ?, status = 'accepted'
       WHERE id = ?`,
      [driverId, bookingId]
    );
  },

  // -------------------------------------------------------------------
  // 3️⃣ Update status (rejected / completed)
  // -------------------------------------------------------------------
  async updateStatus(bookingId, status) {
    await db.execute(
      `UPDATE rides SET status = ? WHERE id = ?`,
      [status, bookingId]
    );
  },

  // -------------------------------------------------------------------
  // 4️⃣ Fetch a booking by ID
  // -------------------------------------------------------------------
  async getBookingById(bookingId) {
    const [rows] = await db.execute(
      `SELECT *
       FROM rides
       WHERE id = ?`,
      [bookingId]
    );

    return rows[0] || null;
  },

  // -------------------------------------------------------------------
  // 5️⃣ Get all bookings for a rider (history page)
  // -------------------------------------------------------------------
  async getBookingsForRider(riderId) {
    const [rows] = await db.execute(
      `SELECT *
       FROM rides
       WHERE rider_id = ?
       ORDER BY id DESC`,
      [riderId]
    );

    return rows;
  }
};

export default bookingModel;
