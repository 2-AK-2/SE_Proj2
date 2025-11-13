import React, { useState, useEffect } from "react";
import { riderAPI } from "../api/api";
import { setToken, getToken } from "../utils/authHelper";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (getToken()) nav("/dashboard");
  }, [nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await riderAPI.login({ email, password });
      setToken(data.token);
      setMessage("Login successful!");
      setTimeout(() => nav("/dashboard"), 700);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-olaGray to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md border border-olaGray"
      >
        <h2 className="text-3xl font-bold text-olaBlack text-center mb-6">
          Rider Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400"
        >
          {loading ? <Loader /> : "Login"}
        </button>

        {message && (
          <p className="text-center text-red-500 font-medium mt-4">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
