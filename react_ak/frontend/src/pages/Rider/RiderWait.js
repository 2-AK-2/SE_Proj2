// src/pages/Rider/RiderWait.js
import React, { useEffect, useState } from "react";
import { bookingAPI } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function RiderWait() {
  const { id } = useParams(); // booking id
  const nav = useNavigate();

  const [booking, setBooking] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const data = await bookingAPI.getBooking(id);
        if (!mounted) return;
        setBooking(data);
        setLoading(false);

        if (data.driver_id) {
          // fetch full driver details
          try {
            const details = await bookingAPI.getDriverDetails(id);
            if (!mounted) return;
            setDriver(details.driver || null);
          } catch (err) {
            console.error("Failed to fetch driver details", err);
            setDriver(null);
          }
        } else {
          setDriver(null);
        }
      } catch (err) {
        console.error("Failed to load booking", err);
      }
    };

    // initial fetch
    poll();
    // poll every 3s
    const interval = setInterval(poll, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-600 text-xl">Loading your ride...</p>;

  if (!booking)
    return <p className="text-center text-red-500">Booking not found.</p>;

  const goToPayment = () => {
    nav(`/rider/pay/${booking.id}`);
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-2xl text-center">
      <h1 className="text-3xl font-bold mb-4">
        {driver ? "Driver Assigned!" : "Searching for Drivers…"}
      </h1>

      <p className="text-gray-600 mb-2">
        Pickup: <strong>{booking.pickup}</strong>
      </p>
      <p className="text-gray-600 mb-6">
        Destination: <strong>{booking.drop_location}</strong>
      </p>

      {!driver && (
        <p className="text-yellow-600 font-semibold">Waiting for driver assignment…</p>
      )}

      {driver && (
        <div className="mt-6 bg-green-50 border border-green-300 p-6 rounded-xl text-left">
          <h2 className="text-xl font-bold text-green-700 mb-4">Your Driver</h2>

          <p><strong>Name:</strong> {driver.name}</p>
          <p><strong>Phone:</strong> {driver.phone}</p>
          <p><strong>Email:</strong> {driver.email}</p>

          <p className="mt-4 text-gray-700">Driver is on the way 🚕</p>

          <div className="mt-4 space-y-3">
            <button
              onClick={() => nav(`/track-driver/${driver.id}`)}
              className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400"
            >
              Track Driver Live
            </button>

            {booking.status === "completed" && (
              <button
                onClick={goToPayment}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700"
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
      )}

      {!driver && (
        <div className="mt-6">
          <p className="text-sm text-gray-500">We will notify you when a driver accepts the ride.</p>
        </div>
      )}
    </div>
  );
}
