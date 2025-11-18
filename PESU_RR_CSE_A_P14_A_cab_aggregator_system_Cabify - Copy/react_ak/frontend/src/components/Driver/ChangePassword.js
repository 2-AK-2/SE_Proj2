// src/components/Driver/ChangePassword.js
import React, { useState } from "react";
import { driverAPI } from "../../api";
import { useNavigate } from "react-router-dom";

export default function DriverChangePassword() {
  const nav = useNavigate();
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");

  const handleChange = async () => {
    try {
      await driverAPI.changePassword({ oldPassword, newPassword });
      alert("Password updated!");
      nav("/driver/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olaGray to-white p-6">
      <div className="bg-white w-full max-w-md shadow-soft rounded-2xl p-8 border border-olaGray">
        <h2 className="text-3xl font-bold text-olaBlack mb-6 text-center">Change Password</h2>

        <div className="space-y-4">
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOld(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNew(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3" />

          <button onClick={handleChange} className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 transition">Update Password</button>
          <button onClick={() => nav("/driver/profile")} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200">Back to Profile</button>
        </div>
      </div>
    </div>
  );
}
