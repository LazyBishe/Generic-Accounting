import React, { useState, useEffect } from 'react';
import journalService from '../services/journalService';
import { getDecodedToken } from '../utils/authUtils';

const LedgerHistory = ({ refreshTrigger }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date Filtering State
  const currentYearMonth = new Date().toISOString().slice(0, 7); // e.g., "2026-05"
  const [filterMonth, setFilterMonth] = useState(currentYearMonth);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger, filterMonth]); // Reload if user posts a new entry OR changes the month

  const loadHistory = async () => {
    setLoading(true);
    const tokenData = getDecodedToken();
    if (tokenData?.businessId) {
      try {
        // Calculate the exact Start and End dates for the selected month
        const year = parseInt(filterMonth.split('-')[0]);
        const month = parseInt(filterMonth.split('-')[1]);
        
        // e.g., "2026-05-01" to "2026-05-31"
        const startDate = `${filterMonth}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]; 

        const data = await journalService.getRecentEntries(tokenData.businessId, startDate, endDate);
        setEntries(data);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    }
    setLoading(false);
  };

  // Helper to format currency safely
  const formatMoney = (amount) => {
    const num = parseFloat(amount);
    return num === 0 ? '' : `$${num.toFixed(2)}`;
  };

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
      
      {/* HEADER & FILTERS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>📖 Journal History</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>Filter by Month:</label>
          <input 
            type="month" 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading ledger...</p>
      ) : entries.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '4px', color: '#6c757d' }}>
          No journal entries found for {filterMonth}.
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ background: '#343a40', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem', width: '12%' }}>Date</th>
              <th style={{ padding: '0.75rem', width: '33%' }}>Account</th>
              <th style={{ padding: '0.75rem', width: '25%' }}>Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', width: '15%' }}>Debit</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', width: '15%' }}>Credit</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <React.Fragment key={entry.id}>
                {/* Optional: Add a subtle spacer row between distinct journal entries */}
                <tr><td colSpan="5" style={{ height: '10px' }}></td></tr>
                
                {entry.lines.map((line, index) => (
                  <tr key={line.id} style={{ 
                    borderBottom: index === entry.lines.length - 1 ? '2px solid #dee2e6' : '1px solid #eee',
                    background: '#fff'
                  }}>
                    {/* Only show the Date on the very first line of the Journal Entry */}
                    <td style={{ padding: '0.5rem', verticalAlign: 'top', color: '#495057', fontWeight: index === 0 ? 'bold' : 'normal' }}>
                      {index === 0 ? new Date(entry.date).toLocaleDateString() : ''}
                    </td>
                    
                    {/* Account Name. Indent Credits slightly for professional look */}
                    <td style={{ padding: '0.5rem', paddingLeft: line.credit > 0 ? '2rem' : '0.5rem' }}>
                      <span style={{ color: '#6c757d', marginRight: '8px' }}>{line.account?.accountNumber}</span>
                      {line.account?.name || 'Unknown Account'}
                    </td>
                    
                    {/* Show line description, or fallback to the main entry description */}
                    <td style={{ padding: '0.5rem', color: '#666', fontStyle: line.description ? 'normal' : 'italic' }}>
                      {line.description || (index === 0 ? entry.description : '')}
                    </td>
                    
                    {/* Amounts */}
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '500' }}>
                      {formatMoney(line.debit)}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '500' }}>
                      {formatMoney(line.credit)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LedgerHistory;