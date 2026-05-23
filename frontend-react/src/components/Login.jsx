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

// import React, { useState } from "react";

// const Login = ({ onLoginSuccess, onNavigateToRegister }) => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       // 🌐 TRANSMITTING LOGIN DATA FOR DATABASE VERIFICATION
//       const response = await fetch("http://localhost:5151/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Invalid email or password credentials.");
//       }

//       // If your real-life app uses JWT Tokens, store it securely here:
//       // localStorage.setItem("token", data.token);

//       // Signal App.jsx that the database verified this account successfully
//       onLoginSuccess();

//     } catch (err) {
//       setError(err.message || "Failed to reach the authentication server.");
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
            
//             {/* Exactly one top button handling the screen redirect */}
//             <button type="button" className="top-redirect-btn" onClick={onNavigateToRegister}>
//               Dont Have an Account? Sign Up.
//             </button>

//             <h3 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "1.5rem", fontWeight: "600" }}>
//               Sign In to Ledger
//             </h3>

//             {error && <div className="error-message">{error}</div>}

//             <form onSubmit={handleLoginSubmit}>
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

//               <div className="form-group">
//                 <label className="form-label">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   className="form-input"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Exactly one execution button at the bottom */}
//               <button type="submit" className="submit-btn-dark">
//                 Access Dashboard
//               </button>
//             </form>

//           </div>
//         </section>

//       </main>
//     </div>
//   );
// };

// export default Login;