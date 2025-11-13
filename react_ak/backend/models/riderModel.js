import db from "../utils/db.js";

const riderModel = {
  // Find a rider by email (for login)
  async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM riders WHERE email = ?",
        [email]
      );
      return rows[0] || null;
    } catch (err) {
      console.error("❌ findByEmail error:", err.message);
      throw err;
    }
  },

  // Find a rider by ID
  async findById(id) {
    try {
      const [rows] = await db.execute(
        "SELECT id, name, email FROM riders WHERE id = ?",
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      console.error("❌ findById error:", err.message);
      throw err;
    }
  },

  // Create a new rider (registration)
  async create({ name, email, password }) {
    try {
      const [result] = await db.execute(
        "INSERT INTO riders (name, email, password) VALUES (?, ?, ?)",
        [name, email, password]
      );
      return { insertId: result.insertId, name, email };
    } catch (err) {
      console.error("❌ create error:", err.message);
      throw err;
    }
  },
};

export default riderModel;
