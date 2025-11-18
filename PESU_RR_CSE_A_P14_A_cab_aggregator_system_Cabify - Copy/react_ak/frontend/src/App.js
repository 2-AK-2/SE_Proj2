// frontend/src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Landing
import RoleSelect from "./pages/Landing/RoleSelect";
import ChooseRider from "./pages/Landing/ChooseRider";
import ChooseDriver from "./pages/Landing/ChooseDriver";

// Rider (old UI kept)
import RiderSignup from "./components/Rider/Signup";
import RiderLogin from "./components/Rider/Login";

// Booking Flow Pages
import FareEstimator from "./pages/Rider/FareEstimator";
import BookingConfirm from "./pages/Rider/BookingConfirm";
import RiderWait from "./pages/Rider/RiderWait";
import BookingDetails from "./pages/Rider/BookingDetails";
import TrackDriver from "./pages/Rider/TrackDriver";
import PaymentPage from "./pages/Rider/PaymentPage";
import PaymentSuccess from "./pages/Rider/PaymentSuccess";
import SavedCards from "./pages/Rider/SavedCards";
import AddCard from "./pages/Rider/AddCard";

// Driver components
import DriverLogin from "./components/Driver/Login";
import DriverRegister from "./components/Driver/Register";
import DriverProfile from "./components/Driver/Profile";
import EditDriverProfile from "./components/Driver/EditProfile";
import DriverChangePassword from "./components/Driver/ChangePassword";
import NotificationsPage from "./components/Driver/RideNotifications";
import DriverOngoing from "./pages/Driver/OngoingRide";

// Auth helper
import { getRiderToken, getDriverToken } from "./utils/authHelper";

function ProtectedRoute({ children, role }) {
  if (role === "driver") {
    return getDriverToken() ? children : <Navigate to="/driver/login" replace />;
  } else if (role === "rider") {
    return getRiderToken() ? children : <Navigate to="/login" replace />;
  } else {
    return (getDriverToken() || getRiderToken()) ? children : <Navigate to="/" replace />;
  }
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-olaGray to-white">
      <Navbar />
      <div className="flex items-center justify-center p-4">
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/choose-rider" element={<ChooseRider />} />
          <Route path="/choose-driver" element={<ChooseDriver />} />

          <Route path="/signup" element={<RiderSignup />} />
          <Route path="/login" element={<RiderLogin />} />

          <Route path="/dashboard" element={<ProtectedRoute role="rider"><FareEstimator /></ProtectedRoute>} />

          <Route path="/booking/confirm" element={<ProtectedRoute role="rider"><BookingConfirm /></ProtectedRoute>} />
          <Route path="/rider/wait/:id" element={<ProtectedRoute role="rider"><RiderWait /></ProtectedRoute>} />
          <Route path="/booking/:id" element={<ProtectedRoute role="rider"><BookingDetails /></ProtectedRoute>} />
          <Route path="/track-driver/:driverId" element={<ProtectedRoute role="rider"><TrackDriver /></ProtectedRoute>} />

          <Route path="/rider/pay/:bookingId" element={<ProtectedRoute role="rider"><PaymentPage /></ProtectedRoute>} />
          <Route path="/rider/payment-success/:bookingId" element={<ProtectedRoute role="rider"><PaymentSuccess /></ProtectedRoute>} />

          <Route path="/rider/cards" element={<ProtectedRoute role="rider"><SavedCards /></ProtectedRoute>} />
          <Route path="/rider/cards/add" element={<ProtectedRoute role="rider"><AddCard /></ProtectedRoute>} />

          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />

          <Route path="/driver/notifications" element={<ProtectedRoute role="driver"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/driver/ongoing" element={<ProtectedRoute role="driver"><DriverOngoing /></ProtectedRoute>} />
          <Route path="/driver/profile" element={<ProtectedRoute role="driver"><DriverProfile /></ProtectedRoute>} />
          <Route path="/driver/profile/edit" element={<ProtectedRoute role="driver"><EditDriverProfile /></ProtectedRoute>} />
          <Route path="/driver/profile/change-password" element={<ProtectedRoute role="driver"><DriverChangePassword /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}
