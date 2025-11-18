// src/pages/Rider/BookingDetails.js
import React, { useEffect, useState } from "react";
import { bookingAPI } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [booking, setBooking] = useState(null);
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await bookingAPI.getBooking(id);
      setBooking(data);

      if (data.driver_id) {
        const details = await bookingAPI.getDriverDetails(id);
        setDriver(details.driver);
      }
    } catch (err) {
      console.error("Error loading booking", err);
    }
  };

  // ⭐ Rider completes the ride
  const completeRide = async () => {
    try {
      await bookingAPI.updateStatus(id, "completed_rider");  // ⭐ FIXED
      nav(`/rider/pay/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Error completing ride");
    }
  };

  if (!booking) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-2xl">

      <h1 className="text-3xl font-bold mb-4">Ride In Progress</h1>

      <p><strong>Pickup:</strong> {booking.pickup}</p>
      <p><strong>Destination:</strong> {booking.drop_location}</p>
      <p><strong>Fare:</strong> ₹{booking.fare}</p>

      {driver && (
        <div className="mt-6 bg-gray-100 p-4 rounded-xl">
          <h3 className="text-xl font-bold mb-2">Driver Details</h3>
          <p><strong>Name:</strong> {driver.name}</p>
          <p><strong>Phone:</strong> {driver.phone}</p>
          <p><strong>Email:</strong> {driver.email}</p>
        </div>
      )}

      <button
        onClick={completeRide}
        className="w-full bg-green-600 text-white py-3 mt-6 rounded-lg font-semibold hover:bg-green-700"
      >
        Complete Ride
      </button>
    </div>
  );
}
