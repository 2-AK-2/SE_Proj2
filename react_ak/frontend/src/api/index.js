// src/api/index.js
import axios from "axios";
import { getToken, getDriverToken, getRiderToken } from "../utils/authHelper";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const instance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach token if present (prefers rider token, falls back to driver token)
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// ---------- AUTH (OTP) ----------
export const authAPI = {
  sendOtp: async (phone) =>
    (await instance.post("/auth/send-otp", { phone })).data,
  verifyOtp: async (phone, otp) =>
    (await instance.post("/auth/verify-otp", { phone, otp })).data,
};

// ---------- RIDER ----------
export const riderAPI = {
  completeRegistration: async (data) =>
    (await instance.post("/riders/complete-registration", data)).data,
  register: async (data) => (await instance.post("/riders/register", data)).data,
  login: async (credentials) =>
    (await instance.post("/riders/login", credentials)).data,
  getProfile: async () => (await instance.get("/riders/profile")).data,
};

// ---------- DRIVER ----------
// For register we must send multipart/form-data
export const driverAPI = {
  register: async (formData) =>
    (
      await axios.post(`${baseURL}/driver/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,

  login: async (data) => (await instance.post("/driver/login", data)).data,

  getNotifications: async () => (await instance.get("/driver/rides")).data,

  getProfile: async () => (await instance.get("/driver/profile")).data,

  updateProfile: async (data) =>
    (await instance.post("/driver/profile/update", data)).data,

  changePassword: async (data) =>
    (await instance.post("/driver/profile/change-password", data)).data,

  rateRider: async (payload) =>
    (await instance.post("/driver/rate", payload)).data,
};

// ---------- FARE ----------
export const fareAPI = {
  estimate: async (pickup, destination, coords = {}) =>
    (
      await instance.post("/fare/estimate", {
        pickup,
        destination,
        ...coords,
      })
    ).data,
};

// ---------- BOOKING ----------
export const bookingAPI = {
  create: async (data) => (await instance.post("/bookings/create", data)).data,
  getBooking: async (id) => (await instance.get(`/bookings/${id}`)).data,
  get: async (id) => (await instance.get(`/bookings/${id}`)).data, // alias
  updateStatus: async (id, status) =>
    (await instance.post(`/bookings/${id}/update-status`, { status })).data,
};

// ---------- LOCATION ----------
export const locationAPI = {
  getLocation: async (driverId) =>
    (await instance.get(`/location/${driverId}`)).data,
};

export default instance;
