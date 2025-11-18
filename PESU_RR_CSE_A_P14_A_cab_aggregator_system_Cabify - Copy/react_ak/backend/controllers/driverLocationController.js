// controllers/driverLocationController.js
import db from "../config/db.js";
import driverModel from "../models/driverModel.js";

// GET current driver location (public)
export const getDriverLocation = async (req, res, next) => {
  try {
    const driverId = Number(req.params.id);
    if (!driverId) return res.status(400).json({ message: "Invalid driver id" });

    const driver = await driverModel.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    res.json({ id: driver.id, latitude: driver.latitude || 0, longitude: driver.longitude || 0 });
  } catch (err) {
    next(err);
  }
};

// POST update driver location (authenticated driver)
export const updateDriverLocation = async (req, res, next) => {
  try {
    const driverId = req.user?.id;
    const { latitude, longitude } = req.body;
    if (!driverId) return res.status(401).json({ message: "Unauthorized" });
    if (typeof latitude !== "number" || typeof longitude !== "number") return res.status(400).json({ message: "latitude & longitude required" });

    await driverModel.updateLocation(driverId, latitude, longitude);
    res.json({ message: "Location updated" });
  } catch (err) {
    next(err);
  }
};
