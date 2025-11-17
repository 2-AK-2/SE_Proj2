import React, { useEffect, useState } from "react";
import { bookingAPI } from "../api/api";
import { useParams } from "react-router-dom";

export default function RiderWait() {
  const { id } = useParams(); // bookingId from URL
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await bookingAPI.getBooking(id);
        setBooking(data);
      } catch (err) {
        console.error("Failed to load booking", err);
      }
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [id]);

  if (!booking)
    return <p className="text-center text-gray-600 text-xl">Loading your ride...</p>;

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-2xl text-center">
      <h1 className="text-3xl font-bold mb-4">Searching for Drivers…</h1>

      <p className="text-gray-600 mb-4">
        Pickup: <strong>{booking.pickup}</strong>
      </p>
      <p className="text-gray-600 mb-6">
        Destination: <strong>{booking.drop_location}</strong>
      </p>

      {booking.driver_id ? (
        <div className="bg-green-100 p-4 rounded-xl mt-6">
          <h2 className="text-xl font-semibold text-green-700">
            Driver Assigned!
          </h2>
          <p className="mt-2 text-gray-700">
            Your driver is on the way 🚖
          </p>
        </div>
      ) : (
        <p className="text-yellow-600 font-semibold">
          Waiting for driver assignment…
        </p>
      )}
    </div>
  );
}
