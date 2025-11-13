// src/api/api.js
import axios from "axios";
import { getToken } from "../utils/authHelper";

// ================================
// 🌐 BASE URL (Environment Support)
// ================================
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create Axios instance
const instance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ================================
// 🔐 Attach token automatically
// ================================
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// 📱 OTP AUTH (Phone-based signup/login)
// ================================
export const authAPI = {
  sendOtp: async (phone) => {
    const response = await instance.post("/auth/send-otp", { phone });
    return response.data;
  },

  verifyOtp: async (phone, otp) => {
    const response = await instance.post("/auth/verify-otp", { phone, otp });
    return response.data;
  },
};

// ================================
// 👤 RIDER AUTH (Email + Password)
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
// 🚗 DRIVER AUTH + DASHBOARD
// ================================
export const driverAPI = {
  register: async (formData) => {
    const response = await instance.post("/driver/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await instance.post("/driver/login", credentials);
    return response.data;
  },

  getNotifications: async () => {
    const response = await instance.get("/driver/rides");
    return response.data;
  },

  rateRider: async (data) => {
    const response = await instance.post("/driver/rate", data);
    return response.data;
  },
};

// ================================
// 🚕 Fare Estimator
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
