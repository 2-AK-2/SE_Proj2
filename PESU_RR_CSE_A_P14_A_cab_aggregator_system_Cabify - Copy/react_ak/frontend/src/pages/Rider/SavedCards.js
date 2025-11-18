// frontend/src/pages/Rider/SavedCards.js
import React, { useEffect, useState } from "react";
import { riderAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function SavedCards() {
  const [cards, setCards] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await riderAPI.listCards();
      setCards(res.cards || []);
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;

    try {
      await riderAPI.deleteCard(id);
      setCards(cards.filter(c => c.id !== id));
    } catch (err) {
      alert("Could not delete card");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-olaGray">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Saved Cards</h2>

        {cards.length === 0 && <p>No saved cards.</p>}

        <div className="space-y-3">
          {cards.map(c => (
            <div key={c.id} className="p-3 border rounded-lg flex justify-between items-center">
              <div>
                <div className="font-semibold">{c.brand}</div>
                <div className="text-sm text-gray-600">•••• •••• •••• {c.last4}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={() => nav("/rider/cards/add")}
            className="bg-olaYellow py-2 px-4 rounded-lg"
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}
