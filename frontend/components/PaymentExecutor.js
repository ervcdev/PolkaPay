/**
 * PaymentExecutor Component - KodaPay
 * Payment Automation section with clear action button
 */

const styles = {
  container: {
    backgroundColor: '#F9F9FB',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    marginBottom: '24px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#E6007A',
  },
  info: {},
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111111',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#737373',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  stat: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#111111',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '-0.5px',
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '4px',
  },
  divider: {
    width: '1px',
    height: '40px',
    backgroundColor: '#E5E5E5',
  },
  button: {
    padding: '14px 28px',
    backgroundColor: '#111111',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '2px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  buttonIcon: {
    width: '16px',
    height: '16px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
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
  },
};

const AutomationIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const PlayIcon = () => (
  <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5,3 19,12 5,21 5,3"/>
  </svg>
);

export default function PaymentExecutor({ dueSubscriptions = 0, totalPending = '0.00', onRunSubscriptions, loading }) {
  const hasDue = dueSubscriptions > 0;

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.iconWrapper}>
          <AutomationIcon />
        </div>
        <div style={styles.info}>
          <div style={styles.title}>
            Payment Automation
            {hasDue && <span style={styles.badge}>{dueSubscriptions} Due</span>}
          </div>
          <div style={styles.subtitle}>Execute pending subscription payments and earn 1% fee</div>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statValue}>{dueSubscriptions}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.stat}>
          <div style={styles.statValue}>${totalPending}</div>
          <div style={styles.statLabel}>Total Due</div>
        </div>
      </div>

      <button
        style={{
          ...styles.button,
          ...(loading || !hasDue ? styles.buttonDisabled : {}),
        }}
        onClick={onRunSubscriptions}
        disabled={loading || !hasDue}
        onMouseOver={(e) => {
          if (!loading && hasDue) e.target.style.backgroundColor = '#2a2a2a';
        }}
        onMouseOut={(e) => {
          if (!loading && hasDue) e.target.style.backgroundColor = '#111111';
        }}
      >
        {loading ? (
          <div style={styles.spinner}></div>
        ) : (
          <PlayIcon />
        )}
        {loading ? 'Running...' : 'Run Pending Payments'}
      </button>
    </div>
  );
}
