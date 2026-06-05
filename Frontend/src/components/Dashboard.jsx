import React, { useState, useEffect } from "react";
import accountService from "../services/accountService";
import JournalEntryForm from './JournalEntryForm';
import LedgerHistory from './LedgerHistory';
import { getDecodedToken } from "../utils/authUtils";

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshLedger, setRefreshLedger] = useState(false);
  // This runs automatically the second the component loads on the screen
  const userInfo = getDecodedToken();
  console.log("THE ID BADGE SAYS:", userInfo);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // 1. Read the clean ID Badge
        const userInfo = getDecodedToken();

        // 2. Security Check: If no badge, or no businessId, stop!
        if (!userInfo || !userInfo.businessId) {
          setError("No business ID found on your badge. Please log in again.");
          setLoading(false);
          return;
        }

        // 3. 🌟 DYNAMIC FETCH: Use their actual BusinessId instead of 1!
        const data = await accountService.getAccountsForBusiness(userInfo.businessId);
        setAccounts(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#1f2937", borderBottom: "2px solid #e5e7eb", paddingBottom: "0.5rem" }}>
        📊 Your Chart of Accounts
      </h2>

      {/* INSIDE YOUR DASHBOARD'S RETURN BLOCK */}
      <div style={{ marginBottom: "3rem", marginTop: "2rem" }}>
        <JournalEntryForm
          accounts={accounts}
          businessId={getDecodedToken()?.businessId} // 👈 Pass the dynamic ID to the form!
          onPostSuccess={() => setRefreshLedger(!refreshLedger)}
        />
      </div>

      <div>
        {/* The Ledger sits right under the form, listening to the refreshLedger switch */}
        <LedgerHistory refreshTrigger={refreshLedger} businessId={getDecodedToken()?.businessId} />
      </div>

      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        These are the categories available for logging your transactions.
      </p>

      {loading && <p style={{ color: "#2563eb", fontWeight: "bold" }}>Fetching buckets from the vault...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* The Grid to display the Buckets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>

        {accounts.map((account) => (
          <div key={account.id} style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            borderLeft: `5px solid ${getAccountColor(account.accountType)}` // Dynamic color coding!
          }}>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#111827", fontSize: "1.2rem" }}>
              {account.name}
            </h3>
            <span style={{
              background: "#f3f4f6",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              color: "#4b5563",
              fontWeight: "600"
            }}>
              Type: {account.accountType}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

// A fun little helper function to color-code the buckets based on their type!
const getAccountColor = (type) => {
  switch (type.toLowerCase()) {
    case "asset": return "#10b981"; // Green
    case "expense": return "#ef4444"; // Red
    case "revenue": return "#3b82f6"; // Blue
    case "equity": return "#8b5cf6"; // Purple
    default: return "#6b7280"; // Gray
  }
};

export default Dashboard;