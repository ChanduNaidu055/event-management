import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./index.css";

const Dashboard = () => {
  const [myEvents, setMyEvents] = useState([]);
  const { token, user } = useContext(AuthContext);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUserSchedule = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMyEvents(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchUserSchedule();
  }, [token, API_URL]);

  const cancelRegistration = async (eventId) => {
    if (!window.confirm("Cancel this registration?")) return;

    try {
      await fetch(`${API_URL}/api/cancel/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await fetch(`${API_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMyEvents(data);
    } catch (err) {
      console.error("Cancellation error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Here are the events you've registered for.</p>
      </div>

      <div className="dashboard-list">
        {myEvents.length > 0 ? (
          myEvents.map((event) => (
            <div key={event.id} className="dashboard-card">
              <div className="card-content">
                <h3>{event.name}</h3>
                <p className="card-meta">
                  {event.location} | {event.date}
                </p>
              </div>
              <button
                className="cancel-btn"
                onClick={() => cancelRegistration(event.id)}
              >
                Cancel
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>You haven't registered for any events yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
