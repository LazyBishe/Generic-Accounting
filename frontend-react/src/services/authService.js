const BASE_URL = "http://localhost:5151/api/auth"; 

const authService = {
  register: async (registerData) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Registration failed");
    }
    return await response.json();
  },

  login: async (loginData) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      // If .NET says 401 Unauthorized or 400 Bad Request
      const errorText = await response.text();
      throw new Error(errorText || "Invalid email or password");
    }

    const data = await response.json();

    // If the backend sent back a JWT token, lock it in the browser vault
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", data.userEmail || loginData.email);
    }

    return data;
  },
  logout: () => {
    // Shred the digital passport credentials from browser memory
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
  },authenticatedFetch: async (url, options = {}) => {
    const token = localStorage.getItem("authToken");
    
    // Ensure options has a headers object
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };

    // If a token exists, attach it as a Bearer token
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, options);

    // If the token is expired or invalid, .NET returns 401. 
    // We should log the user out immediately.
    if (response.status === 401) {
      authService.logout();
      window.location.reload(); // Reboots the app to boot them back to login screen
      throw new Error("Session expired. Please log in again.");
    }

    return response;
  }
};
export default authService;