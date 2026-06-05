import React, { useState, useEffect } from 'react'; // Added useEffect just in case
import Register from './components/Register';
import Login from './components/Login';
import authService from './services/authService';
import Dashboard from './components/Dashboard';
import { getDecodedToken } from './utils/authUtils'; // 🌟 NEW: Import our smart badge reader

function App() {
  const [currentView, setCurrentView] = useState('login'); 
  
  // 🌟 FIX: Use the smart reader! If the token is expired, getDecodedToken() 
  // automatically deletes it and returns null, keeping this false.
  const [isAuthenticated, setIsAuthenticated] = useState(!!getDecodedToken());

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  // 🛡️ SCENARIO A: The user IS logged in. Show them the private accounting app!
  if (isAuthenticated) {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "1rem" }}>
          <h2>🏛️ Generic Accounting Ledger</h2>
          <div>
            <span style={{ marginRight: "1rem", color: "#555" }}>User: {localStorage.getItem("userEmail")}</span>
            <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Log Out
            </button>
          </div>
        </header>

        <main style={{ marginTop: "2rem" }}>
          <Dashboard />
        </main>
      </div>
    );
  }

 // 🛑 SCENARIO B: The user is NOT logged in. Show Auth forms.
  return (
    <div className="App" style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "2rem" }}>
      
      <div style={{ marginBottom: "1rem" }}>
        {currentView === 'login' ? (
          <p style={{ color: "#555", fontSize: "1.1rem" }}>
            Don't Have an Account?{" "}
            <span 
              onClick={() => setCurrentView('register')}
              style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold" }}
              onMouseOver={(e) => e.target.style.textDecoration = "underline"}
              onMouseOut={(e) => e.target.style.textDecoration = "none"}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p style={{ color: "#555", fontSize: "1.1rem" }}>
            Already have an account?{" "}
            <span 
              onClick={() => setCurrentView('login')}
              style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold" }}
              onMouseOver={(e) => e.target.style.textDecoration = "underline"}
              onMouseOut={(e) => e.target.style.textDecoration = "none"}
            >
              Log in
            </span>
          </p>
        )}
      </div>

      {currentView === 'login' ? <Login onLoginSuccess={handleLoginSuccess} /> : <Register />}
    </div>
  );
}

export default App;