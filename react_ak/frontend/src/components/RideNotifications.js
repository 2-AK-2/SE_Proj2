import React, { useState, useEffect } from "react";
import { MapPin, Phone } from "lucide-react";
import { driverAPI } from "../api/api";
import { removeToken } from "../utils/authHelper";
import { useNavigate } from "react-router-dom";

const RideNotifications = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const loadRides = async () => {
      try {
        const data = await driverAPI.getNotifications();
        setRides(data);
      } catch (err) {
        console.error("Failed to fetch rides", err);
      }
    };
    loadRides();
  }, []);

  const handleAccept = () => {
    alert("Ride Accepted!");
    navigate("/driver/rate");
  };

  const handleReject = () => alert("Ride Rejected!");

  const logout = () => {
    removeToken();
    navigate("/driver/login");
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-lg border border-olaGray">
      <h2 className="text-3xl font-bold text-olaBlack mb-4 text-center">Ride Requests</h2>

      {rides.map((ride) => (
        <div key={ride.id} className="border p-4 rounded-xl bg-gray-50 mb-4">
          <p className="font-semibold text-olaBlack flex items-center gap-2 mb-2">
            <MapPin className="text-olaYellow" /> Pickup: {ride.pickup}
          </p>

          <p className="font-semibold text-olaBlack flex items-center gap-2 mb-2">
            <Phone className="text-olaYellow" /> Drop: {ride.drop}
          </p>

          <p className="text-gray-700 mb-3">
            Fare: <span className="font-semibold">₹{ride.fare}</span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-olaYellow text-olaBlack font-semibold py-2 rounded-lg hover:bg-yellow-400"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={logout}
        className="text-olaBlack font-semibold hover:underline block mx-auto mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default RideNotifications;
