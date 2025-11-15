// src/pages/FareEstimator.js
import React, { useState } from "react";
import { fareAPI } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function FareEstimator() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleEstimate = async () => {
    if (!pickup || !destination) {
      setError("Please enter both locations");
      return;
    }
    try {
      const res = await fareAPI.estimate(pickup, destination);
      setEstimate(res);
      setError("");
    } catch {
      setError("Error fetching estimate");
    }
  };

  const goToBookingConfirm = () => {
    nav("/booking/confirm", {
      state: {
        pickup,
        destination,
        fare: estimate.fare,
        eta: estimate.eta,
      },
    });
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md border border-olaGray">
      <h2 className="text-3xl font-bold text-olaBlack text-center mb-6">
        Fare Estimator
      </h2>

      <input
        type="text"
        placeholder="Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
      />

      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
      />

      <button
        onClick={handleEstimate}
        className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
      >
        Get Estimate
      </button>

      {error && (
        <p className="text-red-500 text-center mt-3 font-medium">{error}</p>
      )}

      {estimate && (
        <div className="mt-5 p-4 bg-gray-100 rounded-xl text-center">
          <h4 className="text-lg font-semibold text-olaBlack">
            Estimated Fare: ₹{estimate.fare}
          </h4>
          <h4 className="text-lg font-semibold text-olaBlack">
            ETA: {estimate.eta} mins
          </h4>

          <button
            onClick={goToBookingConfirm}
            className="w-full mt-4 bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            Book Ride
          </button>
        </div>
      )}
    </div>
  );
}
