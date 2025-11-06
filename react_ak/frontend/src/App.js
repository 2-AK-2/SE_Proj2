import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DriverLogin from "./components/DriverLogin";
import DriverRegister from "./components/DriverRegister";
import RideNotifications from "./components/RideNotifications";
import RateRider from "./components/RateRider";
import RiderSignup from "./components/RiderSignup";

function App() {
  const [page, setPage] = useState("login");

  const handleNavigation = (next) => setPage(next);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-olaGray to-white flex items-center justify-center p-4">
        <Routes>
          {/* ✅ Rider registration route */}
          <Route path="/rider/register" element={<RiderSignup />} />

          {/* ✅ Driver and other app pages */}
          <Route
            path="/"
            element={<DriverLogin onNavigate={handleNavigation} />}
          />
          <Route
            path="/driver/register"
            element={<DriverRegister onNavigate={handleNavigation} />}
          />
          <Route
            path="/notifications"
            element={<RideNotifications onNavigate={handleNavigation} />}
          />
          <Route
            path="/rate"
            element={<RateRider onNavigate={handleNavigation} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
