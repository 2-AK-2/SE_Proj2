// models/driverModel.js
import db from "../config/db.js";

const driverModel = {
  async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM drivers WHERE email = ?", [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, name, email, phone, profile_picture, license_doc, vehicle_doc, verified, latitude, longitude FROM drivers WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, phone, password, license_doc, vehicle_doc, verified = 0 }) {
    const [result] = await db.execute(
      `INSERT INTO drivers (name, email, phone, password, license_doc, vehicle_doc, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, password, license_doc, vehicle_doc, verified]
    );
    return { insertId: result.insertId };
  },

  async updateProfile(id, { name, phone, profile_picture }) {
    await db.execute(
      `UPDATE drivers SET name = COALESCE(?, name), phone = COALESCE(?, phone), profile_picture = COALESCE(?, profile_picture) WHERE id = ?`,
      [name, phone, profile_picture, id]
    );
  },

  async updatePassword(id, hashed) {
    await db.execute("UPDATE drivers SET password = ? WHERE id = ?", [hashed, id]);
  },

  async updateLocation(id, lat, lng) {
    await db.execute("UPDATE drivers SET latitude = ?, longitude = ? WHERE id = ?", [lat, lng, id]);
  },
};

export default driverModel;
