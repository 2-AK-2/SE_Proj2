// routes/driverRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.js";
import {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
  changeDriverPassword,
  getRideRequests,
} from "../controllers/driverController.js";

const router = express.Router();

router.post("/register", upload.fields([{ name: "license" }, { name: "vehicleDoc" }]), registerDriver);
router.post("/login", loginDriver);
router.get("/rides", verifyToken, getRideRequests);
router.get("/profile", verifyToken, getDriverProfile);
router.post("/profile/update", verifyToken, upload.fields([{ name: "profile_picture", maxCount: 1 }]), updateDriverProfile);
router.post("/profile/change-password", verifyToken, changeDriverPassword);

export default router;
