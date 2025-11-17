// src/api/api.js
import axios from "axios";
import { getToken } from "../utils/authHelper";

// ==========================================
// 🌐 BASE URL
// ==========================================
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Axios instance
const instance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ==========================================
// 🔐 Automatically attach JWT token
// ==========================================
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// ==========================================
// 📱 OTP AUTH (Phone)
// ==========================================
export const authAPI = {
  sendOtp: async (phone) =>
    (await instance.post("/auth/send-otp", { phone })).data,

  verifyOtp: async (phone, otp) =>
    (await instance.post("/auth/verify-otp", { phone, otp })).data,
};

// ==========================================
// 👤 RIDER AUTH (Email/Password)
// ==========================================
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

// ==========================================
// 🚗 DRIVER API
// ==========================================
export const driverAPI = {
  register: async (data) =>
    (await instance.post("/driver/register", data)).data,

  login: async (data) =>
    (await instance.post("/driver/login", data)).data,

  // 🔥 Correct backend route for driver ride requests:
  // GET /api/driver/rides
  getNotifications: async () =>
    (await instance.get("/driver/rides")).data,

  getProfile: async () =>
    (await instance.get("/driver/profile")).data,

  updateProfile: async (data) =>
    (await instance.post("/driver/profile/update", data)).data,

  changePassword: async (data) =>
    (await instance.post("/driver/profile/change-password", data)).data,
};

// ==========================================
// 🚕 Fare Estimator
// ==========================================
export const fareAPI = {
  estimate: async (pickup, destination) =>
    (
      await instance.post("/fare/estimate", {
        pickup,
        destination,
      })
    ).data,
};

// ==========================================
// 🚕 Booking API
// ==========================================
export const bookingAPI = {
  create: async (data) =>
    (await instance.post("/bookings/create", data)).data,

  getBooking: async (id) =>
    (await instance.get(`/bookings/${id}`)).data,

  updateStatus: async (id, status) =>
    (await instance.post(`/bookings/${id}/update-status`, { status })).data,
};

// ==========================================
// 📍 Driver Live Location API
// (Your backend has GET /api/location/:id)
// ==========================================
export const locationAPI = {
  getLocation: async (driverId) =>
    (await instance.get(`/location/${driverId}`)).data,
};

export default instance;
