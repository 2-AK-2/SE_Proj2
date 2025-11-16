// src/pages/TrackDriver.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { locationAPI } from "../api/api";

export default function TrackDriver() {
  const { driverId } = useParams();
  const [location, setLocation] = useState(null);

  // Poll every 3 seconds
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await locationAPI.getLocation(driverId);
        setLocation(data);
      } catch (err) {
        console.error("Location error:", err);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 3000);
    return () => clearInterval(interval);
  }, [driverId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-olaGray to-white">
      <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md text-center border border-olaGray">
        <h2 className="text-3xl font-bold text-olaBlack mb-6">
          Driver Live Location
        </h2>

        {!location ? (
          <p className="text-gray-600">Loading location...</p>
        ) : (
          <div className="text-left space-y-3">
            <p>
              <strong>Latitude:</strong> {location.latitude.toFixed(6)}
            </p>
            <p>
              <strong>Longitude:</strong> {location.longitude.toFixed(6)}
            </p>

            <p className="text-sm text-gray-500 mt-4">
              (Map integration can be added later)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
