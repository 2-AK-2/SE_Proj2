// frontend/src/pages/Rider/AddCard.js
import React, { useState } from "react";
import { riderAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddCard() {
  const [brand, setBrand] = useState("Visa");
  const [last4, setLast4] = useState("");
  const nav = useNavigate();

  const handleAdd = async () => {
    if (!/^\d{4}$/.test(last4)) return alert("Enter last 4 digits");
    try {
      await riderAPI.addCard({ brand, last4, token: `tok_${Date.now()}` });
      alert("Card added");
      nav("/rider/cards");
    } catch (err) {
      alert("Failed to add card");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-olaGray">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Card (demo)</h2>
        <div className="space-y-3">
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 border rounded-lg">
            <option>Visa</option>
            <option>MasterCard</option>
            <option>Amex</option>
          </select>

          <input value={last4} onChange={(e) => setLast4(e.target.value)} placeholder="Last 4 digits" className="w-full p-3 border rounded-lg" />

          <button onClick={handleAdd} className="w-full bg-olaYellow py-3 rounded-lg font-semibold">Add Card</button>
        </div>
      </div>
    </div>
  );
}
