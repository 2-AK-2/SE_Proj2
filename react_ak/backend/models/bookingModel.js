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

  // 2️⃣ Assign nearest driver using Haversine formula
  async findNearestDriver(pickupLat, pickupLng) {
    const [rows] = await db.execute(
      `
      SELECT 
        id,
        name,
        email,
        latitude,
        longitude,
        (
          6371 * ACOS(
            COS(RADIANS(?)) *
            COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) *
            SIN(RADIANS(latitude))
          )
        ) AS distance
      FROM drivers
      WHERE verified = 1
      ORDER BY distance ASC
      LIMIT 1;
      `,
      [pickupLat, pickupLng, pickupLat]
    );

    return rows[0] || null;
  },

  // 3️⃣ Assign that driver to booking
  async assignDriver(bookingId, driverId) {
    await db.execute(
      `UPDATE rides SET driver_id = ?, status = 'assigned'
       WHERE id = ?`,
      [driverId, bookingId]
    );
  },

  // 4️⃣ Update booking status
  async updateStatus(bookingId, status) {
    await db.execute(
      `UPDATE rides SET status = ? WHERE id = ?`,
      [status, bookingId]
    );
  },

  // 5️⃣ Get booking by ID
  async getBookingById(bookingId) {
    const [rows] = await db.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [bookingId]
    );
    return rows[0] || null;
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
