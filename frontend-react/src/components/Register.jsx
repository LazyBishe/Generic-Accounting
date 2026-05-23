import React, { useState } from "react";
// 💡 This absolute path tells Vite exactly where to go, bypassing relative dot confusion!
import authService from "/src/services/authService"; 

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    businessName: "",
    businessType: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Calling our separated service file!
      await authService.register(formData);
      setSuccess("Account and Business registered successfully! You can now log in.");
      
      setFormData({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        businessName: "",
        businessType: "",
        role: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong during registration.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h2>Create Your Account</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <h3>Personal Details</h3>
        <div>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: "100%", marginBottom: "1rem", padding: "4px" }} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%", marginBottom: "1rem", padding: "4px" }} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: "100%", marginBottom: "1rem", padding: "4px" }} />
        </div>
        <div>
          <label>Phone (Optional):</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: "100%", marginBottom: "1rem", padding: "4px" }} />
        </div>

        <h3>Business Details</h3>
        <div>
          <label>Business Name:</label>
          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required style={{ width: "100%", marginBottom: "1rem", padding: "4px" }} />
        </div>
        <div>
          <label>Business Type:</label>
          <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} required style={{ width: "100%", marginBottom: "1rem", padding: "4px" }} />
        </div>

        <div>
          <label>Your Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1.5rem" }}>
            <option value="">-- Select Your Role --</option>
            <option value="Owner">Owner / CEO</option>
            <option value="Accountant">Accountant</option>
            <option value="Bookkeeper">Bookkeeper</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          Register Business
        </button>
      </form>
    </div>
  );
};

export default Register;


