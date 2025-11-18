import axios from "axios";
import { getToken } from "../utils/authHelper";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Normal instance (JSON)
const instance = axios.create({
  baseURL,
});

// Attach JWT token automatically
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

/* ------------------------------
   OTP AUTH
------------------------------ */
export const authAPI = {
  sendOtp: async (phone) =>
    (await instance.post("/auth/send-otp", { phone })).data,

  verifyOtp: async (phone, otp) =>
    (await instance.post("/auth/verify-otp", { phone, otp })).data,
};

/* ------------------------------
   RIDER API
------------------------------ */
export const riderAPI = {
  completeRegistration: async (data) =>
    (await instance.post("/riders/complete-registration", data)).data,

  register: async (data) =>
    (await instance.post("/riders/register", data)).data,

  login: async (credentials) =>
    (await instance.post("/riders/login", credentials)).data,

  getProfile: async () => (await instance.get("/riders/profile")).data,

  updateProfile: async (data) =>
    (await instance.post("/riders/profile/update", data)).data,

  changePassword: async (data) =>
    (await instance.post("/riders/profile/change-password", data)).data,
};

/* ------------------------------
   DRIVER API
------------------------------ */

// SPECIAL — multipart/form-data upload (license + vehicleDoc)
export const driverAPI = {
  register: async (data) =>
    (await axios.post(`${baseURL}/driver/register`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data,

  login: async (data) =>
    (await instance.post("/driver/login", data)).data,

  getNotifications: async () =>
    (await instance.get("/driver/rides")).data,

  getProfile: async () =>
    (await instance.get("/driver/profile")).data,

  updateProfile: async (data) =>
    (await instance.post("/driver/profile/update", data)).data,

  changePassword: async (data) =>
    (await instance.post("/driver/profile/change-password", data)).data,

  respondToRide: async (bookingId, status) =>
    (await instance.post(`/bookings/${bookingId}/update-status`, { status })).data,
};


/* ------------------------------
   FARE API
------------------------------ */
export const fareAPI = {
  estimate: async (pickup, destination) =>
    (
      await instance.post("/fare/estimate", {
        pickup,
        destination,
      })
    ).data,
};

/* ------------------------------
   BOOKING API
------------------------------ */
export const bookingAPI = {
  create: async (data) =>
    (await instance.post("/bookings/create", data)).data,

  getBooking: async (id) =>
    (await instance.get(`/bookings/${id}`)).data,

  updateStatus: async (id, status) =>
    (await instance.post(`/bookings/${id}/update-status`, { status })).data,

  pay: async (payload) =>
    (await instance.post("/bookings/pay", payload)).data,

  getDriverDetails: async (id) =>
    (await instance.get(`/bookings/${id}/driver-details`)).data,
};

/* ------------------------------
   DRIVER LOCATION
------------------------------ */
export const locationAPI = {
  getLocation: async (driverId) =>
    (await instance.get(`/location/${driverId}`)).data,
};

export default instance;
