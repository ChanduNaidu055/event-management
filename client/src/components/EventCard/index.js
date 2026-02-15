import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./index.css";

const EventCard = ({ event }) => {
  const { token } = useContext(AuthContext);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const registerEvent = async () => {
    if (!token) {
      alert("Please login to register for this event!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event.id }),
      });

      const msg = await response.text();

      if (response.ok) {
        alert("Success: " + msg);
      } else {
        alert("Notice: " + msg);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Unable to reach the server. Please try again later.");
    }
  };

  return (
    <div className="event-card">
      <div className="event-badge">{event.category}</div>
      <h3 className="event-title">{event.name}</h3>
      <p className="event-info">
        {event.location} | {event.date}
      </p>
      <p className="event-desc">{event.description}</p>
      <button className="register-btn" onClick={registerEvent}>
        Register
      </button>
    </div>
  );
};

export default EventCard;
