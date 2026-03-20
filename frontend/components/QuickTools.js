/**
 * QuickTools Component - KodaPay
 * Utility card combining Faucet and Add Token functionality
 */

const styles = {
  container: {
    backgroundColor: '#F9F9FB',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E5E5',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    width: '18px',
    height: '18px',
    color: '#737373',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111111',
  },
  subtitle: {
    fontSize: '12px',
    color: '#737373',
    marginTop: '4px',
  },
  body: {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  toolIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#F4F4F5',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#111111',
    marginBottom: '4px',
  },
  toolDesc: {
    fontSize: '12px',
    color: '#737373',
  },
  toolBtn: {
    padding: '8px 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#525252',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  toolBtnPrimary: {
    backgroundColor: '#111111',
    borderColor: '#111111',
    color: '#FFFFFF',
  },
  toolBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  divider: {
    height: '1px',
    backgroundColor: '#E5E5E5',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: '#F4F4F5',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    marginTop: 'auto',
  },
  badgeIcon: {
    width: '14px',
    height: '14px',
    color: '#16A34A',
  },
  badgeText: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#525252',
    letterSpacing: '0.3px',
  },
  badgeMono: {
    fontFamily: "'JetBrains Mono', monospace",
    color: '#111111',
    fontWeight: 600,
  },
};

const ToolboxIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);

const FaucetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
    <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
  </svg>
);

const TokenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v12M8 10h8M8 14h8"/>
  </svg>
);

const CheckIcon = () => (
  <svg style={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

export default function QuickTools({ onMintFaucet, onAddToken, loading, usdtAddress }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <ToolboxIcon />
          <span style={styles.title}>Quick Tools</span>
        </div>
        <div style={styles.subtitle}>Testnet utilities and token management</div>
      </div>
      
      <div style={styles.body}>
        {/* Faucet Tool */}
        <div style={styles.toolCard}>
          <div style={styles.toolIcon}>
            <FaucetIcon />
          </div>
          <div style={styles.toolInfo}>
            <div style={styles.toolTitle}>Testnet Faucet</div>
            <div style={styles.toolDesc}>Get 100 mUSDT for testing</div>
          </div>
          <button
            style={{
              ...styles.toolBtn,
              ...styles.toolBtnPrimary,
              ...(loading ? styles.toolBtnDisabled : {}),
            }}
            onClick={onMintFaucet}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#2a2a2a';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#111111';
            }}
          >
            {loading ? 'Minting...' : 'Mint'}
          </button>
        </div>

        {/* Add Token Tool */}
        <div style={styles.toolCard}>
          <div style={styles.toolIcon}>
            <TokenIcon />
          </div>
          <div style={styles.toolInfo}>
            <div style={styles.toolTitle}>Add mUSDT to Wallet</div>
            <div style={styles.toolDesc}>Import token to MetaMask</div>
          </div>
          <button
            style={styles.toolBtn}
            onClick={onAddToken}
            onMouseOver={(e) => e.target.style.borderColor = '#D4D4D4'}
            onMouseOut={(e) => e.target.style.borderColor = '#E5E5E5'}
          >
            Add Token
          </button>
        </div>

        {/* PVM Badge */}
        <div style={styles.badge}>
          <CheckIcon />
          <span style={styles.badgeText}>
            Secured by <span style={styles.badgeMono}>PolkaVM</span>
          </span>
        </div>
      </div>
    </div>
  );
}
