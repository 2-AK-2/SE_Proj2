// src/api/api.js
import axios from "axios";
import { getToken } from "../utils/authHelper";

// ================================
// 🌐 BASE URL (Environment Support)
// ================================
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// Create Axios instance
const instance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach JWT token for protected routes
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// 📱 AUTH (OTP-based + Cleaned)
// ================================
export const authAPI = {
  // Send OTP
  sendOtp: async (phone) => {
    const response = await instance.post("/auth/send-otp", { phone });
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (phone, otp) => {
    const response = await instance.post("/auth/verify-otp", { phone, otp });
    return response.data;
  },
};

// ================================
// 👤 RIDER ACCOUNT (JWT Protected)
// ================================
export const riderAPI = {
  register: async (data) => {
    const response = await instance.post("/riders/register", data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await instance.post("/riders/login", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await instance.get("/riders/profile");
    return response.data;
  },
};

// ================================
// 🚗 FARE ESTIMATION
// ================================
export const fareAPI = {
  estimate: async (pickup, destination) => {
    const response = await instance.post("/fare/estimate", {
      pickup,
      destination,
    });
    return response.data;
  },
};

export default instance;
