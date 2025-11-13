import React, { useEffect, useState } from "react";
import { riderAPI } from "../api/api";
import { removeToken } from "../utils/authHelper";
import { useNavigate } from "react-router-dom";
import "../styles/fare.css";

export default function Dashboard() {
  const [rider, setRider] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await riderAPI.getProfile();
        setRider(res.rider);
      } catch (err) {
        console.error(err);
        removeToken();
        nav("/login");
      }
    };
    fetchProfile();
  }, [nav]);

  const handleLogout = () => {
    removeToken();
    nav("/login");
  };

  return (
    <div className="fare-container">
      <h2>Rider Dashboard</h2>
      {rider ? (
        <div>
          <p>
            Welcome, <strong>{rider.name}</strong> ({rider.email})
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
