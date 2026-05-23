import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import authService from './services/authService';

function App() {
  const [currentView, setCurrentView] = useState('login'); // For toggling between login/register
  
  // Check if a token exists in local storage right now
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

  // A handler to tell App.jsx when a user successfully logs in
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // A handler to clear out state when a user logs out
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  // 🛡️ SCENARIO A: The user IS logged in. Show them the private accounting app!
  if (isAuthenticated) {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "1rem" }}>
          <h2>📊 Generic Accounting Ledger</h2>
          <div>
            <span style={{ marginRight: "1rem", color: "#555" }}>User: {localStorage.getItem("userEmail")}</span>
            <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Log Out
            </button>
          </div>
        </header>

        <main style={{ marginTop: "2rem" }}>
          {/* 🚀 This placeholder is where our transaction tables/forms will live next! */}
          <div style={{ padding: "3rem", background: "#f8f9fa", borderRadius: "8px", border: "1px dashed #ccc" }}>
            <h3>🔒 Secure Accounting Workspace Loaded</h3>
            <p>Your requests to the backend are now automatically locked and loaded with a JWT Header keycard.</p>
          </div>
        </main>
      </div>
    );
  }

  // 🛑 SCENARIO B: The user is NOT logged in. Force them to stay on Login/Register.
  return (
    <div className="App" style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "2rem" }}>
      <nav style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => setCurrentView('login')} 
          style={{ padding: "0.5rem 1rem", marginRight: "0.5rem", background: currentView === 'login' ? "#28a745" : "#e7e7e7", color: currentView === 'login' ? "white" : "black", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Go to Login
        </button>
        <button 
          onClick={() => setCurrentView('register')}
          style={{ padding: "0.5rem 1rem", background: currentView === 'register' ? "#007bff" : "#e7e7e7", color: currentView === 'register' ? "white" : "black", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Go to Register
        </button>
      </nav>

      {/* Pass handleLoginSuccess down so the Login component can wake up App.jsx */}
      {currentView === 'login' ? <Login onLoginSuccess={handleLoginSuccess} /> : <Register />}
    </div>
  );
}

export default App;

