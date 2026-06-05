import React, { useState, useEffect } from "react";
import journalService from "../services/journalService";

// We pass a "refreshTrigger" so this list updates the exact second you submit a new form!
const LedgerHistory = ({ refreshTrigger, businessId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await journalService.getRecentEntries(businessId); // Hardcoded Business 1
        setEntries(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [refreshTrigger]); // Whenever refreshTrigger changes, it fetches again!

  if (loading) return <p>Loading ledger history...</p>;
  if (entries.length === 0) return <p>No transactions found. The vault is empty!</p>;

  return (
    <div style={{ marginTop: "3rem", fontFamily: "sans-serif" }}>
      <h3 style={{ color: "#374151", borderBottom: "2px solid #e5e7eb", paddingBottom: "0.5rem" }}>
        📖 Recent Transactions
      </h3>

      {entries.map((entry) => (
        <div key={entry.id} style={{ background: "white", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "1rem", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          
          {/* THE ENVELOPE (Header) */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px dashed #ccc" }}>
            <strong>{new Date(entry.date).toLocaleDateString()} - {entry.description}</strong>
            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Entry #{entry.id}</span>
          </div>

          {/* THE SLIPS OF PAPER (Lines) */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ color: "#6b7280", textAlign: "left" }}>
                <th style={{ paddingBottom: "0.5rem" }}>Account</th>
                <th style={{ paddingBottom: "0.5rem", textAlign: "right" }}>Debit</th>
                <th style={{ paddingBottom: "0.5rem", textAlign: "right" }}>Credit</th>
              </tr>
            </thead>
            <tbody>
              {entry.lines.map((line) => (
                <tr key={line.id}>
                  {/* Notice how we indent the Credit lines slightly! Standard accounting practice. */}
                  <td style={{ padding: "0.25rem 0", paddingLeft: line.credit > 0 ? "2rem" : "0" }}>
                    {line.account?.name}
                  </td>
                  <td style={{ textAlign: "right", color: line.debit > 0 ? "#111827" : "#9ca3af" }}>
                    {line.debit > 0 ? `$${line.debit.toFixed(2)}` : "-"}
                  </td>
                  <td style={{ textAlign: "right", color: line.credit > 0 ? "#111827" : "#9ca3af" }}>
                    {line.credit > 0 ? `$${line.credit.toFixed(2)}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}
    </div>
  );
};

export default LedgerHistory;