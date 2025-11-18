// src/pages/Rider/PaymentSuccess.js
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PaymentSuccess() {
  const { bookingId } = useParams();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-olaGray">
      <div className="bg-white shadow-soft rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>

        <p className="mt-4 text-gray-700">Your ride #{bookingId} has been paid.</p>

        <button
          onClick={() => nav("/dashboard")}
          className="mt-6 bg-olaYellow text-olaBlack py-3 px-6 rounded-lg font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
