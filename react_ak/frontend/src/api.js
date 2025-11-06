const API_URL = "http://localhost:5000/api";

export const sendOtp = async phone => {
  const res = await fetch(`${API_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  return res.json();
};

export const verifyOtp = async (phone, otp) => {
  const res = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp })
  });
  return res.json();
};
