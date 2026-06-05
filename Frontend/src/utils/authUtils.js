export const getDecodedToken = () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const decodedData = JSON.parse(atob(base64Url));


    const currentTime = Date.now() / 1000;
    
    if (decodedData.exp < currentTime) {
        console.warn("Session expired. Throwing away the old badge.");
        localStorage.removeItem("authToken"); // 🗑️ Delete the expired badge
        return null; // Treat them as logged out
    }
    
    // 🧹 THE TRANSLATOR: Turn the ugly C# keys into a clean React object
    return {
      userId: parseInt(decodedData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]),
      email: decodedData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: decodedData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      fullName: decodedData["FullName"],
      businessId: parseInt(decodedData["BusinessId"]) // Convert "2" to the number 2
    };
  } catch (error) {
    console.error("Error reading the ID badge", error);
    localStorage.removeItem("authToken"); // If the token is corrupted, delete it
    return null;
  }
};