// backend/models/bookingModel.js
import db from "../config/db.js";

const bookingModel = {
  
  async createBooking({ rider_id, pickup, drop_location, fare, eta }) {
    const [result] = await db.execute(
      `INSERT INTO rides (rider_id, pickup, drop_location, fare, eta, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [rider_id, pickup, drop_location, fare, eta]
    );
    return { bookingId: result.insertId };
  },

  async assignDriver(bookingId, driverId) {
    await db.execute(
      `UPDATE rides SET driver_id = ?, status='assigned'
       WHERE id = ?`,
      [driverId, bookingId]
    );
  },

  async getBookingById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async updateStatus(id, status) {
    await db.execute(
      `UPDATE rides SET status = ? WHERE id = ?`,
      [status, id]
    );
  },

  async markAsPaid(id) {
    await db.execute(
      `UPDATE rides SET payment_status = 'paid', status='paid' WHERE id = ?`,
      [id]
    );
  },

  // ⭐ FIXED — REMOVE LIMIT
  async getPendingRidesNearby() {
    const [rows] = await db.execute(
      `SELECT id, rider_id, pickup, drop_location, fare, eta, pickup_lat, pickup_lng
       FROM rides
       WHERE status = 'pending'
       ORDER BY created_at DESC`
    );
    return rows;
  }
};

export default bookingModel;
