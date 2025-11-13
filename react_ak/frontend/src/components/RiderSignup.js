import React, { useState } from "react";
import { authAPI } from "../api/api";
import Loader from "./Loader";

export default function RiderSignup() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olaGray to-white p-4">
      <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md border border-olaGray">

        <h1 className="text-3xl font-bold text-olaBlack text-center mb-6">
          🚖 Cabify Rider Signup
        </h1>

        {/* Phone Input */}
        <label className="block text-gray-700 font-semibold mb-1">
          Phone Number
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter 10-digit phone number"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-olaYellow"
        />

        {/* Button — Send OTP */}
        {!otpSent && (
          <button
            onClick={sendOtp}
            className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            {loading ? <Loader /> : "Send OTP"}
          </button>
        )}

        {/* OTP Input */}
        {otpSent && (
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-olaYellow"
            />

            {/* Verify OTP Button */}
            <button
              onClick={verifyOtp}
              className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
            >
              {loading ? <Loader /> : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <p className="text-center text-olaBlack font-medium mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
