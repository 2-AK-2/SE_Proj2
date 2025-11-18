// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Shared components
import Navbar from "./components/Navbar";

// Landing pages
import RoleSelect from "./pages/Landing/RoleSelect";
import ChooseRider from "./pages/Landing/ChooseRider";
import ChooseDriver from "./pages/Landing/ChooseDriver";

// Rider Components (OLD UI → KEEP)
import RiderSignup from "./components/Rider/Signup";
import RiderLogin from "./components/Rider/Login";

// Rider Booking Flow Pages
import FareEstimator from "./pages/Rider/FareEstimator";
import BookingConfirm from "./pages/Rider/BookingConfirm";
import RiderWait from "./pages/Rider/RiderWait";
import BookingDetails from "./pages/Rider/BookingDetails";
import TrackDriver from "./pages/Rider/TrackDriver";
import PaymentPage from "./pages/Rider/PaymentPage";
import PaymentSuccess from "./pages/Rider/PaymentSuccess";

// Driver Components (OLD UI → KEEP)
import DriverLogin from "./components/Driver/Login";
import DriverRegister from "./components/Driver/Register";
import DriverProfile from "./components/Driver/Profile";
import EditDriverProfile from "./components/Driver/EditProfile";
import DriverChangePassword from "./components/Driver/ChangePassword";

// ⭐ FIXED: Correct import for new notifications page
import NotificationsPage from "./pages/Driver/NotificationsPage";

// Auth helpers
import { getRiderToken, getDriverToken } from "./utils/authHelper";

// Protected Route (role-specific)
function ProtectedRoute({ children, role }) {
  if (role === "driver") {
    return getDriverToken()
      ? children
      : <Navigate to="/driver/login" replace />;
  }

  if (role === "rider") {
    return getRiderToken()
      ? children
      : <Navigate to="/login" replace />;
  }

  // Either rider OR driver must be logged in
  return (getDriverToken() || getRiderToken())
    ? children
    : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-olaGray to-white">
      <Navbar />

      <div className="flex items-center justify-center p-4">
        <Routes>

          {/* Landing */}
          <Route path="/" element={<RoleSelect />} />
          <Route path="/choose-rider" element={<ChooseRider />} />
          <Route path="/choose-driver" element={<ChooseDriver />} />

          {/* Rider Auth */}
          <Route path="/signup" element={<RiderSignup />} />
          <Route path="/login" element={<RiderLogin />} />

          {/* Rider Dashboard (Fare Estimator) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="rider">
                <FareEstimator />
              </ProtectedRoute>
            }
          />

          {/* Booking Flow */}
          <Route
            path="/booking/confirm"
            element={
              <ProtectedRoute role="rider">
                <BookingConfirm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rider/wait/:id"
            element={
              <ProtectedRoute role="rider">
                <RiderWait />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute role="rider">
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/track-driver/:driverId"
            element={
              <ProtectedRoute role="rider">
                <TrackDriver />
              </ProtectedRoute>
            }
          />

          {/* Payment */}
          <Route
            path="/rider/pay/:bookingId"
            element={
              <ProtectedRoute role="rider">
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rider/payment-success/:bookingId"
            element={
              <ProtectedRoute role="rider">
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          {/* Driver Auth */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />

          {/* Driver Dashboard */}
          <Route
            path="/driver/notifications"
            element={
              <ProtectedRoute role="driver">
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/profile"
            element={
              <ProtectedRoute role="driver">
                <DriverProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/profile/edit"
            element={
              <ProtectedRoute role="driver">
                <EditDriverProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/profile/change-password"
            element={
              <ProtectedRoute role="driver">
                <DriverChangePassword />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </div>
  );
}
