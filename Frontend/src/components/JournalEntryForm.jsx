import React, { useState, useEffect } from 'react';
import AccountDropdown from './AccountDropdown';
import accountService from '../services/accountService';
import journalService from '../services/journalService';
import { getDecodedToken } from '../utils/authUtils';

const JournalEntryForm = ({ onEntryPosted }) => {
  const [accounts, setAccounts] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Start with 2 empty lines (Minimum requirement for double-entry)
  const [lines, setLines] = useState([
    { accountId: '', description: '', debit: 0, credit: 0 },
    { accountId: '', description: '', debit: 0, credit: 0 }
  ]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const tokenData = getDecodedToken();
    if (tokenData?.businessId) {
      try {
        const data = await accountService.getAccountsForBusiness(tokenData.businessId);
        console.log("Accounts loaded in JournalEntryForm:", data);
        setAccounts(data);
      } catch (err) {
        console.error("Failed to load accounts", err);
      }
    }
  };

  // --- MATH HELPERS ---
  const calculateTotalDebits = () => lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
  const calculateTotalCredits = () => lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
  
  const totalDebits = calculateTotalDebits();
  const totalCredits = calculateTotalCredits();
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  // --- LINE MANAGEMENT ---
  const handleLineChange = (index, field, value) => {
    const newLines = [...lines];
    newLines[index][field] = value;

    // Rule: If you type in Debit, clear the Credit (and vice versa)
    if (field === 'debit' && value > 0) newLines[index].credit = 0;
    if (field === 'credit' && value > 0) newLines[index].debit = 0;

    setLines(newLines);
  };

  const addLine = () => setLines([...lines, { accountId: '', description: '', debit: 0, credit: 0 }]);
  
  const removeLine = (index) => {
    if (lines.length <= 2) return; // Force at least 2 lines
    const newLines = lines.filter((_, i) => i !== index);
    setLines(newLines);
  };

  // --- SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    // 1. Validation Checks
    if (!isBalanced) return setError("Debits must equal Credits to post an entry.");
    if (lines.some(l => !l.accountId)) return setError("Every line must have an account selected.");

    const tokenData = getDecodedToken();
    
    // 2. Format the data for the C# Backend
    const entryData = {
      date,
      description,
      businessId: tokenData.businessId,
      lines: lines.map(l => ({
        accountId: parseInt(l.accountId),
        description: l.description,
        debit: parseFloat(l.debit) || 0,
        credit: parseFloat(l.credit) || 0
      }))
    };
console.log(entryData);      
    try {
      await journalService.createEntry(entryData);
      setSuccess("Journal Entry successfully posted!");
      // Reset the form
      setDescription('');
      setLines([
        { accountId: '', description: '', debit: 0, credit: 0 },
        { accountId: '', description: '', debit: 0, credit: 0 }
      ]);
      if (onEntryPosted) onEntryPosted(); // Tell Dashboard to refresh history
    } catch (err) {
      setError(err.message || "Failed to post entry.");
    }
  };
  

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        📝 Record New Journal Entry
      </h3>

      {error && <div style={{ color: '#721c24', background: '#f8d7da', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: '#155724', background: '#d4edda', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* TOP CONTROLS: Date and Main Memo */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ flex: '3' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Main Description / Memo</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Monthly Rent Payment" required style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        {/* THE ACCOUNTING GRID */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '35%' }}>Account</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '30%' }}>Line Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', width: '15%' }}>Debit ($)</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', width: '15%' }}>Credit ($)</th>
              <th style={{ padding: '0.75rem', textAlign: 'center', width: '5%' }}></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>
                  {/* 🌟 OUR NEW SMART COMPONENT 🌟 */}
                  <AccountDropdown 
                    accounts={accounts} 
                    value={line.accountId} 
                    onChange={(val) => handleLineChange(index, 'accountId', val)} 
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input type="text" value={line.description} onChange={e => handleLineChange(index, 'description', e.target.value)} placeholder="Description/Memo" style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }} />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input type="number" min="0" step="0.01" value={line.debit === 0 ? '' : line.debit} onChange={e => handleLineChange(index, 'debit', e.target.value)} style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', textAlign: 'right' }} />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input type="number" min="0" step="0.01" value={line.credit === 0 ? '' : line.credit} onChange={e => handleLineChange(index, 'credit', e.target.value)} style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', textAlign: 'right' }} />
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <button type="button" onClick={() => removeLine(index)} disabled={lines.length <= 2} style={{ background: 'transparent', border: 'none', color: lines.length <= 2 ? '#ccc' : '#dc3545', cursor: lines.length <= 2 ? 'not-allowed' : 'pointer', fontSize: '1.2rem' }}>
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* TOTALS FOOTER */}
          <tfoot>
            <tr style={{ fontWeight: 'bold', background: '#f8f9fa' }}>
              <td colSpan="2" style={{ padding: '1rem', textAlign: 'right' }}>TOTALS:</td>
              <td style={{ padding: '1rem', textAlign: 'right', color: totalDebits !== totalCredits ? '#dc3545' : '#28a745' }}>
                ${totalDebits.toFixed(2)}
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: totalDebits !== totalCredits ? '#dc3545' : '#28a745' }}>
                ${totalCredits.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        {/* BOTTOM ACTION BUTTONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={addLine} style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Add Another Line
          </button>
          
          <div style={{ textAlign: 'right' }}>
            {!isBalanced && totalDebits > 0 && (
              <span style={{ color: '#dc3545', marginRight: '1rem', fontWeight: 'bold' }}>
                ⚠️ Debits must equal Credits
              </span>
            )}
            <button type="submit" disabled={!isBalanced} style={{ padding: '0.75rem 2rem', background: isBalanced ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: isBalanced ? 'pointer' : 'not-allowed', fontSize: '1.1rem', fontWeight: 'bold' }}>
              Post Journal Entry
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JournalEntryForm;