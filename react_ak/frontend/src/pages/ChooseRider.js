import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChooseRider() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-olaGray to-white">
      <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md text-center border border-olaGray">

        <h2 className="text-3xl font-bold text-olaBlack mb-6">Rider</h2>

        <button
          onClick={() => nav("/signup")}
          className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 mb-3"
        >
          Signup
        </button>

        <button
          onClick={() => nav("/login")}
          className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
        >
          Login
        </button>

      </div>
    </div>
  );
}
