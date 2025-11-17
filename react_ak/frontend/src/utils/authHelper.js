// Rider Token
const RIDER_KEY = "cabify_token";

// Driver Token
const DRIVER_KEY = "cabify_driver_token";

// ---- RIDER ----
export const setRiderToken = (token) => localStorage.setItem(RIDER_KEY, token);
export const getRiderToken = () => localStorage.getItem(RIDER_KEY);
export const removeRiderToken = () => localStorage.removeItem(RIDER_KEY);

// ---- DRIVER ----
export const setDriverToken = (token) => localStorage.setItem(DRIVER_KEY, token);
export const getDriverToken = () => localStorage.getItem(DRIVER_KEY);
export const removeDriverToken = () => localStorage.removeItem(DRIVER_KEY);

// Universal getter
export const getToken = () => getRiderToken() || getDriverToken();
