// src/pages/BookingConfirm.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookingAPI } from "../api/api";

export default function BookingConfirm() {
  const nav = useNavigate();
  const { state } = useLocation();

  if (!state)
    return (
      <p className="text-center text-red-500">
        Missing booking details. Go back and try again.
      </p>
    );

  const { pickup, destination, fare, eta } = state;

  const handleConfirm = async () => {
    try {
      const res = await bookingAPI.create({
        pickup,
        drop_location: destination,
        fare,
        eta,
      });

      nav(`/booking/${res.bookingId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create booking");
    }
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md text-center border border-olaGray">
      <h2 className="text-3xl font-bold text-olaBlack mb-6">Confirm Ride</h2>

      <div className="text-left space-y-3">
        <p><strong>Pickup:</strong> {pickup}</p>
        <p><strong>Destination:</strong> {destination}</p>
        <p><strong>Fare:</strong> ₹{fare}</p>
        <p><strong>ETA:</strong> {eta} mins</p>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg mt-6 hover:bg-yellow-400"
      >
        Confirm Booking
      </button>

      <button
        onClick={() => nav(-1)}
        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 mt-3"
      >
        Back
      </button>
    </div>
  );
}
