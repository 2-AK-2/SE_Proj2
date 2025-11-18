// src/components/Driver/EditProfile.js
import React, { useEffect, useState } from "react";
import { driverAPI } from "../../api";
import { useNavigate } from "react-router-dom";

export default function EditDriverProfile() {
  const nav = useNavigate();
  const [profile, setProfile] = useState({ name: "", phone: "" });

  useEffect(() => {
    driverAPI.getProfile().then((data) => {
      setProfile({
        name: data.name || "",
        phone: data.phone || "",
      });
    });
  }, []);

  const handleSave = async () => {
    try {
      await driverAPI.updateProfile(profile);
      alert("Profile updated!");
      nav("/driver/profile");
    } catch (err) {
      alert("Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-olaGray flex items-center justify-center p-4">
      <div className="bg-white shadow-soft rounded-2xl p-10 border border-olaGray w-full max-w-md">
        <h2 className="text-3xl font-bold text-olaBlack text-center mb-6">Edit Profile</h2>

        <div className="space-y-4">
          <input type="text" placeholder="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg" />
          <input type="text" placeholder="Phone Number" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg" />

          <button onClick={handleSave} className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400">Save</button>
          <button onClick={() => nav("/driver/profile")} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    </div>
  );
}
