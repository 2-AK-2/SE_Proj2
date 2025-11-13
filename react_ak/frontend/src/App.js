import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import RiderSignup from "./components/RiderSignup";
import Login from "./pages/Login";
import FareEstimator from "./pages/FareEstimator";

import DriverLogin from "./components/DriverLogin";
import DriverRegister from "./components/DriverRegister";
import RideNotifications from "./components/RideNotifications";
import RateRider from "./components/RateRider";

import { getToken } from "./utils/authHelper";

// ----------------------------
// 🔐 Protected Route for Riders
// ----------------------------
function ProtectedRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

// ----------------------------
// 🚀 Main App Component
// ----------------------------
export default function App() {
  return (
    <Router>
      <Navbar />

      {/* Gradient wrapper for UI */}
      <div className="min-h-screen bg-gradient-to-br from-olaGray to-white flex items-center justify-center p-4">
        <Routes>
          {/* --------------------------- */}
          {/* 🚖 Rider App Routes */}
          {/* --------------------------- */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<RiderSignup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <FareEstimator />
              </ProtectedRoute>
            }
          />

          {/* --------------------------- */}
          {/* 🚗 Driver App Routes */}
          {/* --------------------------- */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />
          <Route path="/driver/notifications" element={<RideNotifications />} />
          <Route path="/driver/rate" element={<RateRider />} />
        </Routes>
      </div>
    </Router>
  );
}
