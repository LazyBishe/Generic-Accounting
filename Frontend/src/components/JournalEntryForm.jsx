import React, { useState } from "react";
import journalService from "../services/journalService";

const JournalEntryForm = ({ accounts, onPostSuccess, businessId }) => {
  const [entry, setEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    businessId: businessId,
    lines: [
        { accountId: "", debit: "", credit: "" }, // Line 1
        { accountId: "", debit: "", credit: "" }  // Line 2 (Every entry needs at least 2!)
    ] 
  });

  const addLine = () => {
    setEntry({
      ...entry,
      lines: [...entry.lines, { accountId: "", debit: "", credit: "" }]
    });
  };

  const handleLineChange = (index, e) => {
    const newLines = [...entry.lines];
    newLines[index][e.target.name] = e.target.value;
    setEntry({ ...entry, lines: newLines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🧹 THE CLEANUP SQUAD: Format the data perfectly for C#
      const formattedEntry = {
        date: entry.date,
        description: entry.description,
        businessId: businessId, // Use the dynamic business ID
        lines: entry.lines.map(line => ({
          accountId: parseInt(line.accountId), // Converts text "2" to integer 2
          debit: parseFloat(line.debit) || 0,  // Converts blank "" to number 0
          credit: parseFloat(line.credit) || 0 // Converts blank "" to number 0
        }))
      };
      await journalService.createEntry(formattedEntry);
      
      alert("Entry saved successfully!");

      if (onPostSuccess) onPostSuccess();
      
      // Reset the form back to blank state after success!
      setEntry({ 
          ...entry, 
          description: "", 
          lines: [
              { accountId: "", debit: "", credit: "" }, 
              { accountId: "", debit: "", credit: "" }
          ] 
      });

    } catch (err) {
      // If it still fails, let's print the actual C# error to the browser console!
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  // 🧮 THE NEW MATH ENGINE: Calculate live totals as the user types
  const totalDebits = entry.lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
  const totalCredits = entry.lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  return (
    <form onSubmit={handleSubmit} style={{ background: "#ffffff", padding: "2rem", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
      <h3 style={{ marginTop: 0, color: "#111827", borderBottom: "1px solid #eee", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        📝 Record New Transaction
      </h3>
      
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <input type="date" value={entry.date} onChange={(e) => setEntry({...entry, date: e.target.value})} style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}/>
        <input type="text" placeholder="What happened? (e.g., Bought an office chair)" value={entry.description} onChange={(e) => setEntry({...entry, description: e.target.value})} style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} required />
      </div>

      {/* The Dynamic Lines */}
      {entry.lines.map((line, index) => (
        <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          
          <select onChange={(e) => handleLineChange(index, e)} name="accountId" value={line.accountId} required style={{ flex: 2, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="">-- Select Account Bucket --</option>
            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.accountType})</option>)}
          </select>
          
          <input type="number" min="0" step="0.01" name="debit" placeholder="Debit ($ In)" value={line.debit} onChange={(e) => handleLineChange(index, e)} style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
          <input type="number" min="0" step="0.01" name="credit" placeholder="Credit ($ Out)" value={line.credit} onChange={(e) => handleLineChange(index, e)} style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
        
        </div>
      ))}

      <button type="button" onClick={addLine} style={{ background: "#f3f4f6", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", marginTop: "0.5rem", color: "#374151", fontWeight: "bold" }}>
        + Add Another Line
      </button>

      {/* 📊 THE LIVE BALANCER DISPLAY */}
      <div style={{ marginTop: "2rem", padding: "1.5rem", background: isBalanced ? "#dcfce3" : "#fee2e2", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ display: "block", color: "#4b5563", fontSize: "0.9rem" }}>Total Debits: <strong style={{ color: "black", fontSize: "1.2rem" }}>${totalDebits.toFixed(2)}</strong></span>
          <span style={{ display: "block", color: "#4b5563", fontSize: "0.9rem" }}>Total Credits: <strong style={{ color: "black", fontSize: "1.2rem" }}>${totalCredits.toFixed(2)}</strong></span>
        </div>
        
        <div style={{ textAlign: "right" }}>
            {!isBalanced ? (
                <span style={{ color: "#991b1b", fontWeight: "bold" }}>❌ Transaction is out of balance!</span>
            ) : (
                <span style={{ color: "#166534", fontWeight: "bold" }}>✅ Balanced! Ready to post.</span>
            )}
            <br />
            {/* The Submit button is DISABLED if math is wrong! */}
            <button type="submit" disabled={!isBalanced} style={{ marginTop: "0.5rem", padding: "0.75rem 1.5rem", background: isBalanced ? "#2563eb" : "#9ca3af", color: "white", border: "none", borderRadius: "6px", cursor: isBalanced ? "pointer" : "not-allowed", fontWeight: "bold" }}>
            Post Transaction to Vault
            </button>
        </div>
      </div>
    </form>
  );
};

export default JournalEntryForm;