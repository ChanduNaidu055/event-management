import React, { useState, useEffect } from "react";
import EventCard from "../../components/EventCard";
import "./index.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/events?search=${search}&category=${category}`,
        );
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [search, category, API_URL]);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Discover Events</h1>
        <div className="filter-section">
          <input
            className="search-input"
            placeholder="Search events..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <select
            className="category-select"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Music">Music</option>
            <option value="Art">Art</option>
          </select>
        </div>
      </div>
      <div className="event-list">
        {events.length > 0 ? (
          events.map((e) => <EventCard key={e.id} event={e} />)
        ) : (
          <p>No events found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
