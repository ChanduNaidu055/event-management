import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        setErrorMsg(data?.message || "User already exists, Please Login!");
      }
    } catch (err) {
      setErrorMsg("Unable to reach the server. Please check your connection.");
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-card" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Full Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit" className="register-btn">
          Sign Up
        </button>

        <p className="already-account-login-msg">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        {errorMsg && <div className="error-msg">{errorMsg}</div>}
      </form>
    </div>
  );
};

export default Register;
