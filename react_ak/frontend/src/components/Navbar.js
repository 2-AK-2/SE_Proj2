import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, removeToken } from "../utils/authHelper";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    removeToken();
    nav("/login");
  };

  return (
    <nav className="w-full bg-white/10 backdrop-blur-lg text-olaYellow py-4 shadow-sm flex items-center justify-between px-6">
      <span className="font-semibold tracking-wide text-xl">🚖 Cabify</span>

      {isLoggedIn && location.pathname !== "/login" && (
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 px-4 py-1 rounded-lg font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
