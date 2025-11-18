// controllers/fareController.js
import db from "../config/db.js";

// simple Haversine distance
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function calculateFareAndETA(pickup, destination, pickup_lat, pickup_lng, dest_lat, dest_lng) {
  const baseFare = 30;
  const perKmRate = 12;
  const perMinRate = 2;

  let distance = 3; // default km
  if (pickup_lat && pickup_lng && dest_lat && dest_lng) {
    distance = Math.max(1, haversine(pickup_lat, pickup_lng, dest_lat, dest_lng));
  } else {
    // fallback: string heuristic
    distance = Math.abs((pickup || "").length - (destination || "").length) * 0.5 + 3;
  }
  const eta = Math.ceil(distance * 3);
  const fare = baseFare + distance * perKmRate + eta * perMinRate * 0.1;
  return { fare: parseFloat(fare.toFixed(2)), eta };
}

export const getFareEstimate = async (req, res, next) => {
  try {
    const { pickup, destination, pickup_lat, pickup_lng, dest_lat, dest_lng } = req.body;
    if (!pickup || !destination) return res.status(400).json({ message: "Pickup and destination required" });

    const { fare, eta } = calculateFareAndETA(pickup, destination, pickup_lat, pickup_lng, dest_lat, dest_lng);
    await db.execute("INSERT INTO ride_estimates (pickup, destination, fare, eta) VALUES (?, ?, ?, ?)", [pickup, destination, fare, eta]);

    res.json({ pickup, destination, fare, eta });
  } catch (err) {
    next(err);
  }
};
