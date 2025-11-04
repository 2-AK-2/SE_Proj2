import React, { useState } from "react";
import DriverLogin from "./components/DriverLogin";
import DriverRegister from "./components/DriverRegister";
import RideNotifications from "./components/RideNotifications";
import RateRider from "./components/RateRider";

function App() {
  const [page, setPage] = useState("login");

  const handleNavigation = (next) => setPage(next);

  return (
    <div className="min-h-screen bg-gradient-to-br from-olaGray to-white flex items-center justify-center p-4">
      {page === "login" && <DriverLogin onNavigate={handleNavigation} />}
      {page === "register" && <DriverRegister onNavigate={handleNavigation} />}
      {page === "notifications" && (
        <RideNotifications onNavigate={handleNavigation} />
      )}
      {page === "rate" && <RateRider onNavigate={handleNavigation} />}
    </div>
  );
}

export default App;
