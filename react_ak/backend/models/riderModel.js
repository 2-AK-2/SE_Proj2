// models/riderModel.js
import db from "../config/db.js";

const riderModel = {
  async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM riders WHERE email = ?", [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.execute("SELECT id, name, email, phone FROM riders WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async create({ name, email, password, phone }) {
    const [result] = await db.execute(
      "INSERT INTO riders (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, password, phone]
    );
    return { insertId: result.insertId };
  },
};

export default riderModel;
