import React, { useState } from "react";
import { Car } from "lucide-react";
import { driverAPI } from "../api/api";
import { setToken } from "../utils/authHelper";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await driverAPI.login(form);
      setToken(res.token);
      alert("Login successful!");
      navigate("/driver/notifications");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olaGray to-white p-4">
      <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md border border-olaGray text-center">

        <div className="flex justify-center mb-4">
          <div className="bg-olaBlack text-olaYellow p-3 rounded-full">
            <Car className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-olaBlack mb-2">Cab Driver Login</h2>
        <p className="text-gray-600 mb-6">Access your driver dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-olaYellow"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-olaYellow"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            {loading ? <Loader /> : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700">
          New Driver?{" "}
          <button
            onClick={() => navigate("/driver/register")}
            className="text-olaBlack font-semibold hover:underline"
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default DriverLogin;
