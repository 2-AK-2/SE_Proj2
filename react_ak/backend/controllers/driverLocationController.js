// controllers/driverLocationController.js
import db from "../config/db.js";

// Simulated movement function
function getRandomOffset() {
  return (Math.random() - 0.5) * 0.001; 
}

export const getDriverLocation = async (req, res) => {
  try {
    const driverId = req.params.id;

    const [[driver]] = await db.execute(
      "SELECT id, latitude, longitude FROM drivers WHERE id = ?",
      [driverId]
    );

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // simulate movement on each request
    driver.latitude += getRandomOffset();
    driver.longitude += getRandomOffset();

    // save updated position
    await db.execute(
      "UPDATE drivers SET latitude = ?, longitude = ? WHERE id = ?",
      [driver.latitude, driver.longitude, driverId]
    );

    res.json(driver);
  } catch (err) {
    console.error("Driver location error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
