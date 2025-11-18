// src/pages/Rider/BookingDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingAPI } from "../../api/api";

export default function BookingDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await bookingAPI.get(id);
        setBooking(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  if (!booking) return <p className="text-center text-gray-500">Loading booking...</p>;

  return (
    <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md border border-olaGray">
      <h2 className="text-3xl font-bold text-olaBlack mb-6 text-center">Booking Details</h2>

      <div className="space-y-2">
        <p><strong>Pickup:</strong> {booking.pickup}</p>
        <p><strong>Destination:</strong> {booking.drop_location}</p>
        <p><strong>Fare:</strong> ₹{booking.fare}</p>
        <p><strong>ETA:</strong> {booking.eta} mins</p>
        <p><strong>Status:</strong> {booking.status}</p>
      </div>

      {booking.driver_id ? (
        <button
          onClick={() => nav(`/track-driver/${booking.driver_id}`)}
          className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg mt-6"
        >
          Track Driver
        </button>
      ) : (
        <p className="mt-4 text-center text-gray-600">Searching for a driver...</p>
      )}
    </div>
  );
}
