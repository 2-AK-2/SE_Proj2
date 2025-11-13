import React, { useState } from "react";
import { authAPI, riderAPI } from "../api/api";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

export default function RiderSignup() {
  const navigate = useNavigate();

  // Step states
  const [step, setStep] = useState(1);

  // Form fields
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // -----------------------
  // STEP 1 — SEND OTP
  // -----------------------
  const sendOtp = async () => {
    if (!phone.match(/^\d{10}$/)) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.sendOtp(phone);
      setMessage(res.message);
      setStep(2);
    } catch {
      setMessage("❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // STEP 2 — VERIFY OTP
  // -----------------------
  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.verifyOtp(phone, otp);
      setMessage("OTP verified!");
      setStep(3); // move to email + password
    } catch {
      setMessage("❌ Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // STEP 3 — COMPLETE REGISTRATION
  // -----------------------
  const completeRegistration = async () => {
    if (!email || !password) {
      setMessage("Email & password required");
      return;
    }

    setLoading(true);
    try {
      const res = await riderAPI.completeRegistration({
        phone,
        email,
        password,
      });

      setMessage("🎉 Registration successful!");
      setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Registration error");
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

        {/* STEP 1 — Phone */}
        {step === 1 && (
          <>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit phone"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            />

            <button
              onClick={sendOtp}
              className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg"
            >
              {loading ? <Loader /> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <>
            <label className="block text-gray-700 mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg"
            >
              {loading ? <Loader /> : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 — EMAIL + PASSWORD */}
        {step === 3 && (
          <>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            />

            <label className="block text-gray-700 mb-1">Create Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            />

            <button
              onClick={completeRegistration}
              className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg"
            >
              {loading ? <Loader /> : "Complete Registration"}
            </button>
          </>
        )}

        {message && (
          <p className="text-center text-olaBlack font-medium mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}
