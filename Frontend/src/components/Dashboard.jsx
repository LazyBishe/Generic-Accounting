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
    </div>
  );
};
export default Dashboard;