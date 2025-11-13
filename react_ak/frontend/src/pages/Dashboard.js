import React, { useEffect, useState } from "react";
import { riderAPI } from "../api/api";
import { removeToken } from "../utils/authHelper";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [rider, setRider] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await riderAPI.getProfile();
        setRider(res.rider);
      } catch {
        removeToken();
        nav("/login");
      }
    };
    load();
  }, [nav]);

  return (
    <div className="bg-white shadow-soft rounded-2xl p-8 w-full max-w-md border border-olaGray">
      <h2 className="text-3xl font-bold text-olaBlack text-center mb-6">
        Rider Dashboard
      </h2>

      {!rider && <p className="text-center text-gray-600">Loading...</p>}

      {rider && (
        <>
          <p className="text-lg text-center mb-4">
            Welcome,{" "}
            <span className="font-semibold text-olaBlack">{rider.name}</span>
            <br />
            <span className="text-gray-700">{rider.email}</span>
          </p>

          <button
            onClick={() => nav("/dashboard")}
            className="w-full bg-olaYellow text-olaBlack font-semibold py-3 rounded-lg hover:bg-yellow-400 mb-3"
          >
            Open Fare Estimator
          </button>

          <button
            onClick={() => {
              removeToken();
              nav("/login");
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
