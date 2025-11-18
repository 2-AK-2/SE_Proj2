// frontend/src/pages/Rider/PaymentPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingAPI, riderAPI } from "../../api/api";

export default function PaymentPage() {
  const nav = useNavigate();
  const { bookingId } = useParams();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await riderAPI.listCards();
        setCards(res.cards || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handlePay = async () => {
    if (!selectedCard) return alert("Select a card");
    try {
      await bookingAPI.pay({ bookingId: Number(bookingId), cardId: selectedCard });
      nav(`/rider/payment-success/${bookingId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olaGray to-white p-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Select Payment Method</h2>
        <div className="space-y-3">
          {cards.length === 0 && (
            <div className="text-center">
              <p className="mb-3">No saved cards.</p>
              <button onClick={() => nav("/rider/cards/add")} className="bg-olaYellow py-2 px-4 rounded-lg">Add Card</button>
            </div>
          )}
          {cards.map((card) => (
            <div key={card.id} onClick={() => setSelectedCard(card.id)} className={`p-4 border rounded-xl cursor-pointer ${selectedCard === card.id ? "border-olaYellow" : "border-gray-300"}`}>
              <p className="font-semibold">{card.brand}</p>
              <p className="text-gray-600">•••• •••• •••• {card.last4}</p>
            </div>
          ))}
        </div>
        <button onClick={handlePay} className="mt-6 w-full bg-olaYellow text-olaBlack py-3 rounded-lg font-semibold">Pay Now</button>
      </div>
    </div>
  );
}
