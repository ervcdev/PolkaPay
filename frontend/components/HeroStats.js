/**
 * HeroStats Component - KodaPay
 * Three elegant stat cards with layered backgrounds
 */

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#F9F9FB',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHighlight: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  iconWrapper: {
    width: '32px',
    height: '32px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  iconWrapperAccent: {
    backgroundColor: 'rgba(230, 0, 122, 0.1)',
    borderColor: 'rgba(230, 0, 122, 0.2)',
  },
  icon: {
    width: '16px',
    height: '16px',
    color: '#737373',
  },
  iconAccent: {
    color: '#E6007A',
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  value: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#111111',
    letterSpacing: '-1px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  unit: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#737373',
  },
  subtext: {
    fontSize: '12px',
    color: '#A3A3A3',
    marginTop: '8px',
  },
  quickActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  actionBtn: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#525252',
    cursor: 'pointer',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: 'rgba(230, 0, 122, 0.1)',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#E6007A',
    marginTop: '12px',
  },
  dot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#E6007A',
    borderRadius: '50%',
  },
};

const ChartIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
);

const UsersIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const VaultIcon = () => (
  <svg style={{...styles.icon, ...styles.iconAccent}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M12 12m-3 0a3 3 0 106 0a3 3 0 10-6 0"/>
    <path d="M6 8h.01M18 8h.01"/>
  </svg>
);

export default function HeroStats({ 
  vaultBalance, 
  totalSubscriptions, 
  activeSubscriptions,
  onDeposit,
  onWithdraw,
}) {
  // Calculate MRR (Monthly Recurring Revenue) - simplified mock
  const mrr = (parseFloat(vaultBalance || 0) * 0.12).toFixed(2);

  return (
    <div style={styles.container}>
      {/* MRR Card */}
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <ChartIcon />
        </div>
        <div style={styles.label}>Monthly Recurring</div>
        <div style={styles.valueRow}>
          <span style={styles.value}>${mrr}</span>
          <span style={styles.unit}>MRR</span>
        </div>
        <div style={styles.subtext}>Estimated from active subscriptions</div>
      </div>

      {/* Active Subscribers */}
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <UsersIcon />
        </div>
        <div style={styles.label}>Active Subscribers</div>
        <div style={styles.valueRow}>
          <span style={styles.value}>{activeSubscriptions || 0}</span>
          <span style={styles.unit}>/ {totalSubscriptions || 0} total</span>
        </div>
        <div style={styles.badge}>
          <span style={styles.dot}></span>
          {activeSubscriptions > 0 ? 'Active' : 'None'}
        </div>
      </div>

      {/* Vault Balance */}
      <div style={{...styles.card, ...styles.cardHighlight}}>
        <div style={{...styles.iconWrapper, ...styles.iconWrapperAccent}}>
          <VaultIcon />
        </div>
        <div style={styles.label}>Vault Balance</div>
        <div style={styles.valueRow}>
          <span style={styles.value}>{parseFloat(vaultBalance || 0).toFixed(2)}</span>
          <span style={styles.unit}>mUSDT</span>
        </div>
        <div style={styles.quickActions}>
          <button 
            style={styles.actionBtn}
            onClick={onDeposit}
            onMouseOver={(e) => e.target.style.borderColor = '#D4D4D4'}
            onMouseOut={(e) => e.target.style.borderColor = '#E5E5E5'}
          >
            Deposit
          </button>
          <button 
            style={styles.actionBtn}
            onClick={onWithdraw}
            onMouseOver={(e) => e.target.style.borderColor = '#D4D4D4'}
            onMouseOut={(e) => e.target.style.borderColor = '#E5E5E5'}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
