const API_URL = "http://localhost:5151/api/journalentry";

const createEntry = async (entryData) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entryData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to post entry");
  }
  return await response.json();
};
const getRecentEntries = async (businessId, startDate = null, endDate = null) => {
  const token = localStorage.getItem("authToken");
  
  // Build the URL with optional date filters
  let url = `${API_URL}/business/${businessId}`;
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }
  return await response.json();
};

export default { createEntry, getRecentEntries };