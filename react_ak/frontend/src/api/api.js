// src/api/api.js
import axios from "axios";
import { getToken } from "../utils/authHelper";

// ================================
// 🌐 BASE URL
// ================================
const baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create Axios instance
const instance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ================================
// 🔐 Attach JWT Token Automatically
// ================================
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// 📱 OTP AUTH — Phone-based
// ======================================================
export const authAPI = {
  sendOtp: async (phone) =>
    (await instance.post("/auth/send-otp", { phone })).data,

  verifyOtp: async (phone, otp) =>
    (await instance.post("/auth/verify-otp", { phone, otp })).data,
};

// ======================================================
// 👤 RIDER AUTH — Email + Password
// ======================================================
export const riderAPI = {
  completeRegistration: async (data) =>
    (await instance.post("/riders/complete-registration", data)).data,

  register: async (data) =>
    (await instance.post("/riders/register", data)).data,

  login: async (credentials) =>
    (await instance.post("/riders/login", credentials)).data,

  getProfile: async () =>
    (await instance.get("/riders/profile")).data,
};

// ======================================================
// 🚗 DRIVER API (not required now but kept)
// ======================================================
export const driverAPI = {
  register: async (formData) =>
    (
      await instance.post("/driver/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,

  login: async (credentials) =>
    (await instance.post("/driver/login", credentials)).data,

  getNotifications: async () =>
    (await instance.get("/driver/rides")).data,

  rateRider: async (data) =>
    (await instance.post("/driver/rate", data)).data,
};

// ======================================================
// 🚕 Fare Estimator
// ======================================================
export const fareAPI = {
  estimate: async (pickup, destination) =>
    (
      await instance.post("/fare/estimate", {
        pickup,
        destination,
      })
    ).data,
};

// ======================================================
// 🚕 BOOKING API
// ======================================================
export const bookingAPI = {
  create: async (data) =>
    (await instance.post("/bookings/create", data)).data,

  getBooking: async (id) =>
    (await instance.get(`/bookings/${id}`)).data,
};

// ======================================================
// 🌍 DRIVER LIVE LOCATION API (⭐ FIXED ENDPOINT)
// ======================================================
export const locationAPI = {
  // Backend route = GET /api/location/:id
  getLocation: async (driverId) =>
    (await instance.get(`/location/${driverId}`)).data,
};

// Export Axios instance
export default instance;
