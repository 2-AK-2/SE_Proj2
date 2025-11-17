// models/bookingModel.js
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
      `UPDATE rides 
       SET driver_id = ?, status = 'accepted'
       WHERE id = ?`,
      [driverId, bookingId]
    );
  },

  async updateStatus(bookingId, status) {
    await db.execute(
      `UPDATE rides SET status = ? WHERE id = ?`,
      [status, bookingId]
    );
  },

  async getBookingById(bookingId) {
    const [rows] = await db.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [bookingId]
    );
    return rows[0] || null;
  },
};

export default bookingModel;
