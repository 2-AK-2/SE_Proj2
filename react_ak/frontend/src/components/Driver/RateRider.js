// src/components/Driver/RateRider.js
import React, { useState } from "react";
import { Star } from "lucide-react";
import { driverAPI } from "../../api";
import { useNavigate } from "react-router-dom";

const RateRider = ({ riderId = 1 }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    try {
      await driverAPI.rateRider({ riderId, rating });
      alert(`Rider rated ${rating}/5`);
      navigate("/driver/notifications");
    } catch {
      alert("Failed to submit rating");
    }
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md text-center border border-olaGray">
      <h2 className="text-3xl font-bold text-olaBlack mb-4">Rate Your Rider</h2>

      <div className="flex justify-center gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} onClick={() => setRating(star)} className={`w-8 h-8 cursor-pointer ${star <= rating ? "text-olaYellow fill-olaYellow" : "text-gray-400"}`} />
        ))}
      </div>

      <button onClick={handleSubmit} className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400">Submit Rating</button>
    </div>
  );
};

export default RateRider;
