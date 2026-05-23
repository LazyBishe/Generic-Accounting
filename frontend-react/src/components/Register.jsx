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


// import React, { useState } from "react";

// const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }

//     try {
//       // 🌐 LINKING THE FRONTEND TO YOUR BACKEND API
//       // Replace the URL with your actual local or production backend API endpoint
//       const response = await fetch("http://localhost:5151/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           role: formData.role,
//           businessName: formData.businessName,
//           businessType: formData.businessType,
//           email: formData.email,
//           password: formData.password
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // Captures backend validation messages (e.g., "Email already exists")
//         throw new Error(data.message || "Something went wrong during registration.");
//       }

//       setError("Registration successful! Redirecting to login...");
      
//       // Delays the view switch slightly so the user reads the success message
//       setTimeout(() => {
//         onRegisterSuccess();
//       }, 1500);

//     } catch (err) {
//       setError(err.message || "Network error. Could not connect to database server.");
//     }
//   };

//   return (
//     <div className="index-container">
//       {/* 🏷️ TOP HEADER */}
//       <header className="app-header">
//         <h1>Generic Accounting App</h1>
//       </header>

//       {/* ↕️ MAIN SPLIT SECTION */}
//       <main className="split-main">
        
//         {/* 🖋️ LEFT HERO COLUMN */}
//         <section className="hero-side">
//           <div className="illustration-box">
//             <svg className="accounting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
//             </svg>
//             <svg className="accounting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
//               <polyline points="14 2 14 8 20 8"/>
//               <line x1="16" y1="13" x2="8" y2="13"/>
//               <line x1="16" y1="17" x2="8" y2="17"/>
//             </svg>
//             <svg className="accounting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
//               <line x1="8" y1="6" x2="16" y2="6"/>
//               <line x1="16" y1="14" x2="16" y2="18"/>
//             </svg>
//           </div>
//           <div className="hero-text-box">
//             <h2>Track everything in one workspace.</h2>
//             <p>Double-entry bookkeeping, digital record holding, and fast reporting compiled inside a highly responsive environment.</p>
//           </div>
//         </section>

//         {/* 🔐 RIGHT AUTH FORM COLUMN */}
//         <section className="form-side">
//           <div className="auth-form-wrapper">
            
//             <h3 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "1.5rem", fontWeight: "600" }}>
//               Create Business Profile
//             </h3>

//             {error && <div className="error-message">{error}</div>}

//             <form onSubmit={handleRegisterSubmit}>
              
//               {/* Row 1: Full Name & Role Dropdown */}
//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Full Name</label>
//                   <input
//                     type="text"
//                     name="fullName"
//                     className="form-input"
//                     placeholder="Jane Doe"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">App Role</label>
//                   <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
//                     <option value="Accountant">Accountant</option>
//                     <option value="Business Owner">Business Owner</option>
//                     <option value="Bookkeeper">Bookkeeper</option>
//                     <option value="Auditor">Auditor</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Row 2: Business Name & Business Type Dropdown */}
//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Business Name</label>
//                   <input
//                     type="text"
//                     name="businessName"
//                     className="form-input"
//                     placeholder="Acme Ledger LLC"
//                     value={formData.businessName}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Business Type</label>
//                   <select name="businessType" className="form-input" value={formData.businessType} onChange={handleChange}>
//                     <option value="LLC">LLC</option>
//                     <option value="Sole Proprietorship">Sole Proprietorship</option>
//                     <option value="S-Corp">S-Corp</option>
//                     <option value="C-Corp">C-Corp</option>
//                     <option value="Partnership">Partnership</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Row 3: Identity Setup */}
//               <div className="form-group">
//                 <label className="form-label">Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className="form-input"
//                   placeholder="name@company.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     className="form-input"
//                     placeholder="••••••••"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Confirm Password</label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     className="form-input"
//                     placeholder="••••••••"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Clean Single Action Submission Button */}
//               <button type="submit" className="submit-btn-blue">
//                 Register Account
//               </button>
//             </form>

//           </div>
//         </section>

//       </main>
//     </div>
//   );
// };

// export default Register;