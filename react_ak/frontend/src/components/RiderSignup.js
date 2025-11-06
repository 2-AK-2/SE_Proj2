import React, { useState } from "react";

function RiderSignup() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  // Generate a 6-digit OTP locally
  const sendOtp = () => {
    if (!phone.match(/^\d{10}$/)) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random OTP
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setMessage(`Demo OTP (for testing): ${newOtp}`);
  };

  const verifyOtp = () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    if (otp === generatedOtp) {
      setMessage("✅ Registration successful!");
    } else {
      setMessage("❌ Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="signup-card">
      <label className="input-label">Phone Number</label>
      <input
        type="text"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input-field"
      />

      {!otpSent && (
        <button onClick={sendOtp} className="primary-btn">
          Send OTP
        </button>
      )}

      {otpSent && (
        <>
          <label className="input-label">Enter OTP</label>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-field"
          />
          <button onClick={verifyOtp} className="primary-btn">
            Verify OTP
          </button>
        </>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default RiderSignup;
