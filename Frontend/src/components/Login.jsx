import React, { useState } from "react";
import authService from "../services/authService";
const Login = ({ onLoginSuccess }) => { 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await authService.login(formData);
      // 2. 🚀 Fire this function to tell App.jsx to load the private workspace!
      if (onLoginSuccess) onLoginSuccess(); 
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h2>Login to Your Account</h2>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email Address:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%", marginBottom: "1rem", padding: "6px", boxSizing: "border-box" }} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: "100%", marginBottom: "1.5rem", padding: "6px", boxSizing: "border-box" }} />
        </div>
        <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;

