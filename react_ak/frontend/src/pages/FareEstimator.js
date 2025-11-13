import React, { useState } from "react";
import { fareAPI } from "../api/api";
import "../styles/fare.css";

export default function FareEstimator() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState("");

  const handleEstimate = async () => {
    if (!pickup || !destination) {
      setError("Please enter both locations");
      return;
    }
    try {
      const res = await fareAPI.estimate(pickup, destination);
      setEstimate(res);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching estimate");
    }
  };

  return (
    <div className="fare-container">
      <h2>Get Fare Estimate</h2>

      <input
        type="text"
        placeholder="Enter Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <button onClick={handleEstimate}>Get Estimate</button>

      {error && <p className="error">{error}</p>}

      {estimate && (
        <div className="estimate-box">
          <h4>Estimated Fare: ₹{estimate.fare}</h4>
          <h4>ETA: {estimate.eta} mins</h4>
        </div>
      )}
    </div>
  );
}
