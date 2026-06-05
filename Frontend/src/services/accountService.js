
const API_URL = "http://localhost:5151/api/account"; 

const getAccountsForBusiness = async (businessId) => {
  // 1. Grab the ID badge from the user's browser
  const token = localStorage.getItem("authToken");

  // 2. Knock on the C# Controller's door
  const response = await fetch(`${API_URL}/business/${businessId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`, // 🛡️ Present the ID badge to the Bouncer
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }

  // 3. Return the array of buckets to React!
  return await response.json();
};

const accountService = {
  getAccountsForBusiness
};

export default accountService;