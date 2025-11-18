// src/pages/Rider/PaymentPage.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingAPI } from "../../api/api";

export default function PaymentPage() {
  const nav = useNavigate();
  const { bookingId } = useParams();

  const [selectedCard, setSelectedCard] = useState(null);

  const cards = [
    { id: 1, brand: "Visa", last4: "4242" },
    { id: 2, brand: "MasterCard", last4: "5588" },
  ];

  const handlePay = async () => {
    if (!selectedCard) return alert("Select a card");

    try {
      await bookingAPI.pay({ bookingId, cardId: selectedCard });
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
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className={`p-4 border rounded-xl cursor-pointer ${
                selectedCard === card.id ? "border-olaYellow" : "border-gray-300"
              }`}
            >
              <p className="font-semibold">{card.brand}</p>
              <p className="text-gray-600">•••• •••• •••• {card.last4}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handlePay}
          className="mt-6 w-full bg-olaYellow text-olaBlack py-3 rounded-lg font-semibold"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
