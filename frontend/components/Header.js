/**
 * Header Component - KodaPay
 * Sleek top bar with wallet dropdown
 */

import { useState } from 'react';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
  },
  title: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#737373',
  },
  titleBold: {
    fontWeight: 600,
    color: '#111111',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  walletDropdown: {
    position: 'relative',
  },
  walletButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: '#F9F9FB',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  walletButtonHover: {
    borderColor: '#D4D4D4',
    backgroundColor: '#F4F4F5',
  },
  walletAddress: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    color: '#111111',
  },
  balanceChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
  },
  balanceLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  balanceValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    fontWeight: 500,
    color: '#111111',
  },
  chevron: {
    color: '#737373',
    transition: 'transform 0.15s ease',
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    right: 0,
    minWidth: '240px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    zIndex: 100,
  },
  dropdownSection: {
    padding: '12px 16px',
    borderBottom: '1px solid #F4F4F5',
  },
  dropdownLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#A3A3A3',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  dropdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  dropdownRowLast: {
    marginBottom: 0,
  },
  balanceName: {
    fontSize: '13px',
    color: '#525252',
  },
  balanceAmount: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 500,
    color: '#111111',
  },
  disconnectBtn: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '13px',
    fontWeight: 500,
    color: '#DC2626',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  connectBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#111111',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: 500',
    cursor: 'pointer',
  },
  connectBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

const ChevronIcon = ({ isOpen }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{
      ...styles.chevron,
      ...(isOpen ? styles.chevronOpen : {}),
    }}
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

export default function Header({
  account,
  chainId,
  loading,
  walletReady,
  wndBalance,
  usdtBalance,
  onConnect,
  onDisconnect
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    if (!balance) return '0.00';
    return parseFloat(balance).toFixed(2);
  };

  const getNetworkName = () => {
    if (chainId === 31337) return 'Local Testnet';
    if (chainId === 420420421) return 'Westend Revive';
    return 'Unknown Network';
  };

  return (
    <header style={styles.header}>
      <div>
        <span style={styles.title}>
          Welcome to <span style={styles.titleBold}>KodaPay</span>
        </span>
      </div>

      <div style={styles.right}>
        {account ? (
          <div style={styles.walletDropdown}>
            <button
              style={{
                ...styles.walletButton,
                ...(isHovered ? styles.walletButtonHover : {}),
              }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div style={styles.balanceChip}>
                <span style={styles.balanceLabel}>WND</span>
                <span style={styles.balanceValue}>{formatBalance(wndBalance)}</span>
              </div>
              <span style={styles.walletAddress}>{formatAddress(account)}</span>
              <ChevronIcon isOpen={isDropdownOpen} />
            </button>

            {isDropdownOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownSection}>
                  <div style={styles.dropdownLabel}>Network</div>
                  <div style={{...styles.dropdownRow, ...styles.dropdownRowLast}}>
                    <span style={styles.balanceName}>{getNetworkName()}</span>
                  </div>
                </div>
                <div style={styles.dropdownSection}>
                  <div style={styles.dropdownLabel}>Balances</div>
                  <div style={styles.dropdownRow}>
                    <span style={styles.balanceName}>WND</span>
                    <span style={styles.balanceAmount}>{formatBalance(wndBalance)}</span>
                  </div>
                  <div style={{...styles.dropdownRow, ...styles.dropdownRowLast}}>
                    <span style={styles.balanceName}>mUSDT</span>
                    <span style={styles.balanceAmount}>{formatBalance(usdtBalance)}</span>
                  </div>
                </div>
                <button
                  style={styles.disconnectBtn}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onDisconnect();
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#FEF2F2'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            style={{
              ...styles.connectBtn,
              ...((!walletReady || loading) ? styles.connectBtnDisabled : {}),
            }}
            onClick={onConnect}
            disabled={!walletReady || loading}
            onMouseOver={(e) => {
              if (walletReady && !loading) e.target.style.backgroundColor = '#2a2a2a';
            }}
            onMouseOut={(e) => {
              if (walletReady && !loading) e.target.style.backgroundColor = '#111111';
            }}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  );
}
