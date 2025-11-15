// -----------------------------------------------------
// src/App.js — FINAL WORKING VERSION WITH BOOKING FLOW
// -----------------------------------------------------

import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";

import RiderSignup from "./components/RiderSignup";
import Login from "./pages/Login";
import FareEstimator from "./pages/FareEstimator";

import BookingConfirm from "./pages/BookingConfirm";

import DriverLogin from "./components/DriverLogin";
import DriverRegister from "./components/DriverRegister";
import RideNotifications from "./components/RideNotifications";
import RateRider from "./components/RateRider";

import { getToken } from "./utils/authHelper";


// -----------------------------------------------------
// 🔐 Protected Route Wrapper
// -----------------------------------------------------
function ProtectedRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}


// -----------------------------------------------------
// 🎨 ROLE SELECTION SCREEN
// -----------------------------------------------------
function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-olaGray to-white p-6">
      <h1 className="text-4xl font-bold text-olaBlack mb-10">🚖 Welcome to Cabify</h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/choose-rider")}
          className="px-8 py-4 bg-olaYellow text-olaBlack rounded-2xl font-semibold shadow-soft hover:bg-yellow-400 transition"
        >
          I am a Rider
        </button>

        <button
          onClick={() => navigate("/choose-driver")}
          className="px-8 py-4 bg-olaBlack text-white rounded-2xl font-semibold shadow-soft hover:bg-gray-800 transition"
        >
          I am a Driver
        </button>
      </div>
    </div>
  );
}


// -----------------------------------------------------
// 🧍 Rider Choice
// -----------------------------------------------------
function ChooseRider() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-olaGray to-white">
      <h2 className="text-3xl font-bold text-olaBlack mb-6">Rider Options</h2>

      <button
        onClick={() => navigate("/signup")}
        className="w-64 py-3 bg-olaYellow text-olaBlack rounded-xl font-semibold shadow-soft hover:bg-yellow-400 mb-4"
      >
        Rider Signup (OTP)
      </button>

      <button
        onClick={() => navigate("/login")}
        className="w-64 py-3 bg-white text-olaBlack border border-gray-300 rounded-xl font-semibold shadow-soft hover:bg-gray-200"
      >
        Rider Login (Email)
      </button>
    </div>
  );
}


// -----------------------------------------------------
// 🚗 Driver Choice
// -----------------------------------------------------
function ChooseDriver() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-olaGray to-white">
      <h2 className="text-3xl font-bold text-olaBlack mb-6">Driver Options</h2>

      <button
        onClick={() => navigate("/driver/register")}
        className="w-64 py-3 bg-olaYellow text-olaBlack rounded-xl font-semibold shadow-soft hover:bg-yellow-400 mb-4"
      >
        Driver Registration
      </button>

      <button
        onClick={() => navigate("/driver/login")}
        className="w-64 py-3 bg-white text-olaBlack border border-gray-300 rounded-xl font-semibold shadow-soft hover:bg-gray-200"
      >
        Driver Login
      </button>
    </div>
  );
}


// -----------------------------------------------------
// 🚀 MAIN APP
// -----------------------------------------------------
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-olaGray to-white">
      <Navbar />

      <div className="flex items-center justify-center p-4">
        <Routes>

          {/* Landing + Choices */}
          <Route path="/" element={<RoleSelect />} />
          <Route path="/choose-rider" element={<ChooseRider />} />
          <Route path="/choose-driver" element={<ChooseDriver />} />

          {/* Rider Auth */}
          <Route path="/signup" element={<RiderSignup />} />
          <Route path="/login" element={<Login />} />

          {/* Rider Dashboard = Fare Estimator */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <FareEstimator />
              </ProtectedRoute>
            }
          />

          {/* BOOKING FLOW */}
          <Route
            path="/booking/confirm"
            element={
              <ProtectedRoute>
                <BookingConfirm />
              </ProtectedRoute>
            }
          />

  

          {/* Driver (Ignore if not needed for rider flow) */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />

          <Route
            path="/driver/notifications"
            element={
              <ProtectedRoute>
                <RideNotifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/rate"
            element={
              <ProtectedRoute>
                <RateRider />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </div>
  );
}
