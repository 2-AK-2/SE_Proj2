import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Phone } from "lucide-react";

const RideNotifications = ({ onNavigate }) => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/driver/rides", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(res.data);
      } catch (err) {
        console.error("Failed to fetch rides", err);
      }
    };
    fetchRides();
  }, []);

  const handleAccept = () => {
    alert("Ride Accepted!");
    onNavigate("rate");
  };

  const handleReject = () => {
    alert("Ride Rejected!");
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-lg border border-olaGray">
      <h2 className="text-3xl font-bold text-olaBlack mb-4 text-center">
        Ride Requests
      </h2>
      {rides.map((ride) => (
        <div
          key={ride.id}
          className="border border-gray-200 p-4 rounded-xl mb-4 bg-gray-50"
        >
          <p className="font-semibold text-olaBlack mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-olaYellow" /> Pickup: {ride.pickup}
          </p>
          <p className="font-semibold text-olaBlack mb-2 flex items-center gap-2">
            <Phone className="w-5 h-5 text-olaYellow" /> Drop: {ride.drop}
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
        onClick={() => onNavigate("login")}
        className="text-olaBlack font-semibold hover:underline block mx-auto mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default RideNotifications;
