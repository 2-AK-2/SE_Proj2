// src/api/axiosConfig.js
import axios from "axios";
import { getToken } from "../utils/authHelper";

// ✅ Use environment variable or fallback for local dev
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// ✅ Create a pre-configured Axios instance
const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Interceptor: attach JWT token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: centralized error logging (optional, but helpful)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
