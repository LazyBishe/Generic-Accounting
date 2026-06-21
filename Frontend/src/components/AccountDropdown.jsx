import React, { useState, useEffect, useRef } from 'react';

const AccountDropdown = ({ accounts, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null); // Tracks which folder is clicked open
  const dropdownRef = useRef(null);

  const selectedAccount = accounts.find(a => a.id === value);
  console.log("🔍 RENDERING AccountDropdown with accounts:", accounts);
  console.log("🔍 Selected Account:", selectedAccount);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setExpandedCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLower = searchTerm.toLowerCase();
  const isSearching = searchTerm.trim().length > 0;

  // Filter based on search (searches BOTH Name and Number)
  const filteredAccounts = accounts.filter(account => {
    return (
      account.name.toLowerCase().includes(searchLower) ||
      (account.accountNumber && account.accountNumber.toString().includes(searchLower))
    );
  });

  // Group into Assets, Liabilities, etc.
  const groupedAccounts = filteredAccounts.reduce((groups, account) => {
    const type = account.accountType || 'Other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(account);
    return groups;
  }, {});

  const typeOrder = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

  const handleSelect = (accountId) => {
    onChange(accountId); // Tell the form which account was picked
    setIsOpen(false);    // Close the menu
    setSearchTerm('');   // Clear search text
    setExpandedCategory(null); // Close folders
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      
      {/* THE SEARCH BAR */}
      <input
        type="text"
        value={isOpen ? searchTerm : (selectedAccount ? `${selectedAccount.accountNumber} - ${selectedAccount.name}` : '')}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setSearchTerm('');
        }}
        placeholder="Search number or select category..."
        style={{ width: '100%', padding: '0.6rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.95rem' }}
      />

      {/* THE DROPDOWN MENU */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          maxHeight: '350px', overflowY: 'auto',
          background: 'white', border: '1px solid #ccc', zIndex: 50, // High z-index so it floats over the grid
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)', borderRadius: '4px', marginTop: '4px'
        }}>
          {typeOrder.map(type => {
            const accs = groupedAccounts[type];
            if (!accs || accs.length === 0) return null; // Hide empty categories

            // A folder is OPEN if the user is typing, OR if they clicked this specific folder
            const isFolderOpen = isSearching || expandedCategory === type;

            return (
              <div key={type} style={{ borderBottom: '1px solid #eee' }}>
                
                {/* 📁 FOLDER HEADER */}
                <div 
                  onClick={() => {
                    // Only allow clicking to open/close folders if they ARE NOT searching
                    if (!isSearching) {
                      setExpandedCategory(expandedCategory === type ? null : type);
                    }
                  }}
                  style={{ 
                    background: '#f8f9fa', padding: '10px 12px', fontWeight: 'bold', 
                    fontSize: '0.85rem', color: '#495057', cursor: isSearching ? 'default' : 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {type}s
                  </span>
                  {!isSearching && (
                    <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                      {isFolderOpen ? '▼' : '▶'}
                    </span>
                  )}
                </div>
                
                {/* 📄 ACCOUNTS INSIDE THE FOLDER */}
                {isFolderOpen && accs.map(account => (
                  <div
                    key={account.id}
                    onClick={() => handleSelect(account.id)}
                    style={{
                      padding: '8px 12px 8px 24px', cursor: 'pointer',
                      backgroundColor: value === account.id ? '#e6f2ff' : 'transparent',
                      display: 'flex', alignItems: 'center', fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f3f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = value === account.id ? '#e6f2ff' : 'transparent'}
                  >
                    <span style={{ fontWeight: 'bold', marginRight: '15px', color: '#6c757d', minWidth: '45px' }}>
                      {account.accountNumber}
                    </span>
                    <span style={{ color: '#212529' }}>
                      {account.name}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
          
          {Object.keys(groupedAccounts).length === 0 && (
             <div style={{ padding: '16px', color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
               No accounts found matching "{searchTerm}"
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;