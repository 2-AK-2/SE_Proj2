// controllers/fareController.js
import db from "../config/db.js";

function calculateFareAndETA(pickup, destination) {
  const baseFare = 30;
  const perKmRate = 12;
  const perMinRate = 2;

  const distance = Math.abs(pickup.length - destination.length) * 0.5 + 3;
  const eta = Math.ceil(distance * 3);
  const fare = baseFare + distance * perKmRate + eta * perMinRate * 0.1;

  return { fare: parseFloat(fare.toFixed(2)), eta };
}

export const getFareEstimate = async (req, res) => {
  try {
    const { pickup, destination } = req.body;

    if (!pickup || !destination)
      return res.status(400).json({ message: "Pickup and destination required" });

    const { fare, eta } = calculateFareAndETA(pickup, destination);

    await db.execute(
      "INSERT INTO ride_estimates (pickup, destination, fare, eta) VALUES (?, ?, ?, ?)",
      [pickup, destination, fare, eta]
    );

    res.json({ pickup, destination, fare, eta });
  } catch (error) {
    console.error("❌ Fare estimation error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
