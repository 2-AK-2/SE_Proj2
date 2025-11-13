import React, { useState } from "react";
import { authAPI } from "../api/api";
import Loader from "./Loader";

function RiderSignup() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone.match(/^\d{10}$/)) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.sendOtp(phone);
      setOtpSent(true);
      setMessage(res.message || "OTP sent successfully!");
    } catch {
      setMessage("❌ Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.verifyOtp(phone, otp);
      setMessage(res.message || "✅ Verification successful!");
    } catch {
      setMessage("❌ Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-wrapper">
        <h1 className="brand-title">🚖 Cabify Rider Signup</h1>

        <label className="input-label">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter 10-digit phone number"
          className="input-field"
        />

        {!otpSent && (
          <button onClick={sendOtp} className="primary-btn">
            {loading ? <Loader /> : "Send OTP"}
          </button>
        )}

        {otpSent && (
          <>
            <label className="input-label">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="input-field"
            />
            <button onClick={verifyOtp} className="primary-btn">
              {loading ? <Loader /> : "Verify OTP"}
            </button>
          </>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default RiderSignup;
