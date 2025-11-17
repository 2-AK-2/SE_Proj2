// src/pages/DriverProfile.js
import React, { useEffect, useState } from "react";
import { driverAPI } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function DriverProfile() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    try {
      const p = await driverAPI.getProfile();
      setProfile(p);
    } catch (err) {
      alert("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-olaGray flex items-center justify-center p-4">
      <div className="bg-white shadow-soft rounded-2xl p-10 border border-olaGray w-full max-w-lg">

        <h2 className="text-3xl font-bold text-olaBlack text-center mb-6">
          Driver Profile
        </h2>

        <div className="space-y-3 text-lg text-gray-800">
          <p>
            <span className="font-semibold text-olaBlack">Name:</span>{" "}
            {profile.name}
          </p>

          <p>
            <span className="font-semibold text-olaBlack">Email:</span>{" "}
            {profile.email}
          </p>

          <p>
            <span className="font-semibold text-olaBlack">Phone:</span>{" "}
            {profile.phone || "Not set"}
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => nav("/driver/profile/edit")}
            className="flex-1 bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400"
          >
            Edit Profile
          </button>

          <button
            onClick={() => nav("/driver/profile/change-password")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
