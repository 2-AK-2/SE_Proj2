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
// 🚗 DRIVER API — Login, Register, Profile, Password, Notifications
// ======================================================
// src/api/api.js

export const driverAPI = {
  register: async (data) =>
    (await instance.post("/driver/register", data)).data,

  login: async (data) =>
    (await instance.post("/driver/login", data)).data,

  // FIXED HERE
  getNotifications: async () =>
    (await instance.get("/driver/rides")).data,

  getProfile: async () =>
    (await instance.get("/driver/profile")).data,

  updateProfile: async (data) =>
    (await instance.post("/driver/profile/update", data)).data,

  changePassword: async (data) =>
    (await instance.post("/driver/profile/change-password", data)).data,
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

  updateStatus: async (id, status) =>
    (await instance.post(`/bookings/${id}/update-status`, { status })).data,
};

export default instance;
