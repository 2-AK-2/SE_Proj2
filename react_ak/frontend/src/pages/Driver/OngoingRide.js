// frontend/src/pages/Driver/OngoingRide.js
import React, { useEffect, useState } from "react";
import { driverAPI, bookingAPI } from "../../api/api";

export default function DriverOngoing() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // If backend has an endpoint for driver ongoing, use it. Fallback: driver API getNotifications
        const data = await driverAPI.getOngoing?.() || await driverAPI.getNotifications();
        setRides(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (id) => {
    if (!window.confirm("Mark ride as completed?")) return;

    try {
      await bookingAPI.updateStatus(id, "completed");
      alert("Ride completed");
      setRides(rides.filter(r => r.id !== id));
    } catch (err) {
      alert("Could not complete ride");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-olaGray">
      <div className="bg-white w-full max-w-xl shadow-soft rounded-2xl p-8 border border-olaGray">
        <h2 className="text-3xl font-bold text-olaBlack mb-6">Ongoing Rides</h2>

        {rides.length === 0 && <p className="text-gray-600">No ongoing rides</p>}

        {rides.map(r => (
          <div key={r.id} className="p-4 mb-4 border rounded-lg">
            <p><strong>Pickup:</strong> {r.pickup}</p>
            <p><strong>Drop:</strong> {r.drop_location}</p>
            <p><strong>Fare:</strong> ₹{r.fare}</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleComplete(r.id)}
                className="bg-olaYellow py-2 px-4 rounded-lg"
              >
                Complete Ride
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
