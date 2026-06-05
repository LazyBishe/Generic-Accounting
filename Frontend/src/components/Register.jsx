import React, { useState } from "react";
import authService from "/src/services/authService"; 

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    businessName: "",
    businessType: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setError("");
    setSuccess("");
    setIsSubmitting(true);

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
      });
    } catch (err) {
      setError(err.message || "Something went wrong during registration.");
    }
    finally {
      // 3. NEW: Whether it succeeds or fails, unlock the button at the very end
      setIsSubmitting(false); 
    }
  };

 const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1.25rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box", // Ensures padding doesn't push the width out
    fontSize: "1rem",
    outlineColor: "#007bff"
  };

  return (
    // 3. Modern SaaS Card Styling (Shadows, softer borders)
    <div style={{ 
      maxWidth: "450px", 
      margin: "3rem auto", 
      padding: "2.5rem", 
      backgroundColor: "#ffffff",
      border: "1px solid #eaeaea", 
      borderRadius: "12px", 
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
    }}>
      
      <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#111827" }}>
        Create Your Workspace
      </h2>
      <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "2rem" }}>
        Register your business to get started.
      </p>
      
      {error && <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#991b1b", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
      {success && <div style={{ padding: "0.75rem", background: "#dcfce3", color: "#166534", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem" }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        
        <h3 style={{ fontSize: "1.1rem", color: "#374151", borderBottom: "1px solid #eee", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
          Owner Details
        </h3>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#4b5563", fontWeight: "600" }}>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={inputStyle} placeholder="John Doe" />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#4b5563", fontWeight: "600" }}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="john@example.com" />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#4b5563", fontWeight: "600" }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} placeholder="••••••••" />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#4b5563", fontWeight: "600" }}>Phone (Optional)</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="+1 234 567 8900" />
        </div>

        <h3 style={{ fontSize: "1.1rem", color: "#374151", borderBottom: "1px solid #eee", paddingBottom: "0.5rem", marginTop: "1.5rem", marginBottom: "1rem" }}>
          Business Details
        </h3>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#4b5563", fontWeight: "600" }}>Business Name</label>
          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required style={inputStyle} placeholder="Acme Corp" />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#4b5563", fontWeight: "600" }}>Industry / Type</label>
          <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} required style={inputStyle} placeholder="e.g. Retail, IT Services" />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          style={{ 
            width: "100%", 
            padding: "0.85rem", 
            marginTop: "1rem",
            background: isSubmitting ? "#9ca3af" : "#2563eb", // Modern blue
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            cursor: isSubmitting ? "not-allowed" : "pointer", 
            fontWeight: "bold",
            fontSize: "1rem",
            transition: "background 0.2s ease"
          }}>
          {isSubmitting ? "Creating Workspace..." : "Register Business"}
        </button>

      </form>
    </div>
  );
};

export default Register;