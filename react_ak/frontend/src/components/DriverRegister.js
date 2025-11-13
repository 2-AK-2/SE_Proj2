import React, { useState } from "react";
import { driverAPI } from "../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const DriverRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    license: null,
    vehicleDoc: null,
  });

  const handleFileChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      await driverAPI.register(formData);
      alert("Registration successful! Pending verification.");
      navigate("/driver/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olaGray to-white p-4">

      <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md border border-olaGray text-center">
        <h2 className="text-3xl font-bold text-olaBlack mb-2">Driver Registration</h2>
        <p className="text-gray-600 mb-6">Join and start earning!</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border border-gray-300 rounded-lg p-3"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded-lg p-3"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded-lg p-3"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Upload Driver License
            </label>
            <input
              type="file"
              name="license"
              accept="image/*,application/pdf"
              required
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Upload Vehicle Documents
            </label>
            <input
              type="file"
              name="vehicleDoc"
              accept="image/*,application/pdf"
              required
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <button className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400">
            {loading ? <Loader /> : "Submit for Verification"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/driver/login")}
            className="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverRe
