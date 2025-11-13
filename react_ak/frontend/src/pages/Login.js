import React, { useState, useEffect } from "react";
import { riderAPI } from "../api/api";
import { setToken, getToken } from "../utils/authHelper";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
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
      setMessage("✅ Login successful!");
      setTimeout(() => nav("/dashboard"), 600);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Rider Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Login"}
        </button>

        <p className="message">{message}</p>
      </form>
    </div>
  );
};

export default Login;
