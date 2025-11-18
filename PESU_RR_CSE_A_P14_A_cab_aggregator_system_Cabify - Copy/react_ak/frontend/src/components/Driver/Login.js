// src/components/Driver/Login.js
import React, { useState } from "react";
import { driverAPI } from "../../api/api";
import { setDriverToken } from "../../utils/authHelper";
import { useNavigate } from "react-router-dom";

export default function DriverLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await driverAPI.login({ email, password });
      setDriverToken(res.token);
      nav("/driver/notifications");
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-olaGray flex items-center justify-center p-4">
      <div className="bg-white shadow-soft rounded-2xl p-10 border border-olaGray w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-olaBlack mb-6">Driver Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <button
            className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
