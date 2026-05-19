import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  // 'login' means show login screen, 'register' means show registration screen
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="App" style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "2rem" }}>
      
      {/* 🧭 Simple Navigation Bar */}
      <nav style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => setCurrentView('login')} 
          style={{
            padding: "0.5rem 1rem", 
            marginRight: "0.5rem",
            background: currentView === 'login' ? "#28a745" : "#e7e7e7",
            color: currentView === 'login' ? "white" : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Go to Login
        </button>
        
        <button 
          onClick={() => setCurrentView('register')}
          style={{
            padding: "0.5rem 1rem", 
            background: currentView === 'register' ? "#007bff" : "#e7e7e7",
            color: currentView === 'register' ? "white" : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Go to Register
        </button>
      </nav>

      <hr style={{ maxWidth: "400px", margin: "1rem auto", border: "0", borderTop: "1px solid #eee" }} />

      {/* 🎭 Conditional Rendering: Show the screen based on state */}
      {currentView === 'login' ? <Login /> : <Register />}
      
    </div>
  );
}

export default App;