// frontend/src/components/Driver/RideNotifications.js
import React, { useState, useEffect } from "react";
import { MapPin, Phone, Car } from "lucide-react";
import { driverAPI, bookingAPI } from "../../api/api";

const RideNotifications = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    loadRides();
    const interval = setInterval(loadRides, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadRides = async () => {
    try {
      const data = await driverAPI.getNotifications();
      setRides(data);
    } catch (err) {
      console.error("Failed to fetch rides", err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await bookingAPI.updateStatus(id, "accepted");
      alert("Ride Accepted!");
      loadRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept");
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingAPI.updateStatus(id, "rejected");
      alert("Ride Rejected!");
      loadRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject");
    }
  };

  return (
    <div className="bg-white w-full max-w-xl shadow-soft rounded-2xl p-8 border border-olaGray text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-olaBlack text-olaYellow p-3 rounded-full">
          <Car className="w-8 h-8" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-olaBlack mb-6">Ride Requests</h2>

      {rides.length === 0 && <p className="text-gray-600 text-lg">No ride requests right now.</p>}

      {rides.map((ride) => (
        <div key={ride.id} className="p-5 mb-6 bg-gray-50 border rounded-xl shadow-sm text-left">
          <p className="font-semibold text-olaBlack flex items-center gap-2 mb-2"><MapPin className="text-olaYellow" /> Pickup: {ride.pickup}</p>
          <p className="font-semibold text-olaBlack flex items-center gap-2 mb-2"><Phone className="text-olaYellow" /> Drop: {ride.drop_location}</p>
          <p className="text-gray-700 mb-4">Fare: <span className="font-semibold">₹{ride.fare}</span></p>

          <div className="flex gap-3">
            <button onClick={() => handleAccept(ride.id)} className="flex-1 bg-olaYellow text-olaBlack font-semibold py-2 rounded-lg hover:bg-yellow-400">Accept</button>
            <button onClick={() => handleReject(ride.id)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RideNotifications;
