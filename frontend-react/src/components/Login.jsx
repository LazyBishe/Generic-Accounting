import React, { useState } from "react";
import authService from "/src/services/authService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Send credentials to the .NET backend
      const response = await authService.login(formData);
      setSuccess(`Welcome back, ${localStorage.getItem("userEmail")}!`);
      setIsLoggedIn(true);
    } catch (err) {
      // Catches invalid passwords or emails not in SQL database
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setSuccess("");
    setFormData({ email: "", password: "" });
  };

  // If the user successfully logged in, show them a Dashboard state with a Logout button
  if (isLoggedIn) {
    return (
      <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>Dashboard</h2>
        <p style={{ color: "green", fontWeight: "bold" }}>{success || "You are securely logged in!"}</p>
        <p>Your secure JWT Token is safely stored in your browser's LocalStorage.</p>
        <button onClick={handleLogout} style={{ width: "100%", padding: "0.75rem", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginTop: "1rem" }}>
          Log Out
        </button>
      </div>
    );
  }

  // Otherwise, show the classic login form
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