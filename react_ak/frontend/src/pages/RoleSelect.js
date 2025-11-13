import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-olaGray to-white">
      <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md text-center border border-olaGray">
        
        <h1 className="text-3xl font-bold text-olaBlack mb-6">
          🚖 Cabify
        </h1>
        <p className="text-gray-600 mb-6">Continue as a:</p>

        {/* Rider Button */}
        <button
          onClick={() => nav("/choose-rider")}
          className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 transition mb-4"
        >
          🚕 Rider
        </button>

        {/* Driver Button */}
        <button
          onClick={() => nav("/choose-driver")}
          className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
        >
          🚗 Driver
        </button>

      </div>
    </div>
  );
}
