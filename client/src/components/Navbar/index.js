import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./index.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-logo">
        EventHub
      </Link>
      <ul className="navbar-links">
        <li>
          <Link to="/" className="nav-item">
            Explore
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/dashboard" className="nav-item">
                My Events
              </Link>
            </li>
            <li>
              <button onClick={onLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="nav-item">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="register-link">
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
