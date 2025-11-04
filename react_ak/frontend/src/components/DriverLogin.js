import React, { useState } from "react";
import axios from "axios";
import { Car } from "lucide-react"; // nice car icon (optional)

const DriverLogin = ({ onNavigate }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/driver/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      onNavigate("notifications");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md border border-olaGray text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-olaBlack text-olaYellow p-3 rounded-full">
          <Car className="w-8 h-8" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-olaBlack mb-2">Cab Driver</h2>
      <p className="text-gray-600 mb-6">Login to your driver dashboard</p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-olaYellow"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-olaYellow"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-700">
        New Driver?{" "}
        <button
          onClick={() => onNavigate("register")}
          className="text-olaBlack font-semibold hover:underline"
        >
          Register Here
        </button>
      </p>
    </div>
  );
};

export default DriverLogin;
