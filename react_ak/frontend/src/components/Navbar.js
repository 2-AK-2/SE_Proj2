// src/components/Navbar.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  getRiderToken,
  getDriverToken,
  removeRiderToken,
  removeDriverToken
} from "../utils/authHelper";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const token = getRiderToken() || getDriverToken();
  const isLoggedIn = !!token;

  const isDriver = location.pathname.startsWith("/driver");

  const handleLogout = () => {
    removeRiderToken();
    removeDriverToken();

    if (isDriver) nav("/driver/login");
    else nav("/login");
  };

  return (
    <nav className="w-full bg-white/10 backdrop-blur-lg text-olaYellow py-4 shadow-sm flex items-center justify-between px-6">
      <span
        className="font-semibold tracking-wide text-xl cursor-pointer"
        onClick={() => nav("/")}
      >
        🚖 Cabify
      </span>

      {isLoggedIn && (
        <div className="flex items-center gap-4">
          {isDriver && (
            <>
              <button
                onClick={() => nav("/driver/notifications")}
                className="text-olaBlack bg-white px-4 py-1 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Ride Requests
              </button>

              <button
                onClick={() => nav("/driver/profile")}
                className="text-olaBlack bg-white px-4 py-1 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Profile
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="text-white bg-red-500 px-4 py-1 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
