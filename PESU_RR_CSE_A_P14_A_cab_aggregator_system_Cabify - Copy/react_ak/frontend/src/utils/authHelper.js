// src/utils/authHelper.js

// Keys
const RIDER_KEY = "cabify_rider_token";
const DRIVER_KEY = "cabify_driver_token";

// Rider
export const setRiderToken = (token) => localStorage.setItem(RIDER_KEY, token);
export const getRiderToken = () => localStorage.getItem(RIDER_KEY);
export const removeRiderToken = () => localStorage.removeItem(RIDER_KEY);

// Driver
export const setDriverToken = (token) => localStorage.setItem(DRIVER_KEY, token);
export const getDriverToken = () => localStorage.getItem(DRIVER_KEY);
export const removeDriverToken = () => localStorage.removeItem(DRIVER_KEY);

// Universal getter: prefer rider token then driver token (so rider routes work with rider token)
export const getToken = () => getRiderToken() || getDriverToken();

// Remove both tokens
export const clearAllTokens = () => {
  removeRiderToken();
  removeDriverToken();
};
