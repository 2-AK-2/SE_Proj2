import express from "express";
import multer from "multer";
import {
  registerDriver,
  loginDriver,
  getRideRequests,
  rateRider,
} from "../controllers/driverController.js";

const router = express.Router();

// File storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder =
      file.fieldname === "license"
        ? "uploads/licenses"
        : "uploads/vehicles";
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post(
  "/register",
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "vehicleDoc", maxCount: 1 },
  ]),
  registerDriver
);
router.post("/login", loginDriver);
router.get("/rides", getRideRequests);
router.post("/rate", rateRider);

export default router;
