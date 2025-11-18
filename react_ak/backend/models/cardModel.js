// backend/models/cardModel.js
import db from "../config/db.js";

const cardModel = {
  async addCard(riderId, { brand, last4, token }) {
    const [res] = await db.execute(`INSERT INTO cards (rider_id, brand, last4, token) VALUES (?, ?, ?, ?)`, [riderId, brand, last4, token]);
    return { id: res.insertId };
  },

  async getCardsForRider(riderId) {
    const [rows] = await db.execute(`SELECT id, brand, last4, token FROM cards WHERE rider_id = ? ORDER BY created_at DESC`, [riderId]);
    return rows;
  },

  async deleteCard(id, riderId) {
    const [res] = await db.execute(`DELETE FROM cards WHERE id = ? AND rider_id = ?`, [id, riderId]);
    return res.affectedRows > 0;
  }
};

export default cardModel;
