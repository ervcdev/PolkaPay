/**
 * CreateSubscription Component - KodaPay
 * Prominent card for creating new subscription plans
 */

const styles = {
  container: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    height: '100%',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #F4F4F5',
    backgroundColor: '#F9F9FB',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    width: '18px',
    height: '18px',
    color: '#E6007A',
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
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: '#525252',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#F9F9FB',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', monospace",
    color: '#111111',
  },
  inputFocus: {
    borderColor: '#E6007A',
    backgroundColor: '#FFFFFF',
  },
  inputGroup: {
    display: 'flex',
  },
  inputSuffix: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 14px',
    backgroundColor: '#F4F4F5',
    border: '1px solid #E5E5E5',
    borderLeft: 'none',
    borderRadius: '0 2px 2px 0',
    fontSize: '11px',
    fontWeight: 600,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputWithSuffix: {
    borderRadius: '2px 0 0 2px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  button: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#E6007A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '2px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

const PlusIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

export default function CreateSubscription({
  receiver,
  setReceiver,
  amount,
  setAmount,
  frequency,
  setFrequency,
  onCreateSubscription,
  loading
}) {
  const isFormValid = receiver && amount && frequency && parseFloat(amount) > 0 && parseInt(frequency) > 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <PlusIcon />
          <span style={styles.title}>Create New Subscription</span>
        </div>
        <div style={styles.subtitle}>Set up automated recurring payments</div>
      </div>
      
      <div style={styles.body}>
        <div style={styles.field}>
          <label style={styles.label}>Recipient Address</label>
          <input
            type="text"
            style={styles.input}
            placeholder="0x..."
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = '#E6007A';
              e.target.style.backgroundColor = '#FFFFFF';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E5E5';
              e.target.style.backgroundColor = '#F9F9FB';
            }}
          />
        </div>
        
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Amount</label>
            <div style={styles.inputGroup}>
              <input
                type="number"
                style={{...styles.input, ...styles.inputWithSuffix, flex: 1}}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E6007A';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E5E5';
                  e.target.style.backgroundColor = '#F9F9FB';
                }}
              />
              <span style={styles.inputSuffix}>mUSDT</span>
            </div>
          </div>
          
          <div style={styles.field}>
            <label style={styles.label}>Billing Cycle</label>
            <div style={styles.inputGroup}>
              <input
                type="number"
                style={{...styles.input, ...styles.inputWithSuffix, flex: 1}}
                placeholder="30"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E6007A';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E5E5';
                  e.target.style.backgroundColor = '#F9F9FB';
                }}
              />
              <span style={styles.inputSuffix}>Days</span>
            </div>
          </div>
        </div>

        <button
          style={{
            ...styles.button,
            ...(loading || !isFormValid ? styles.buttonDisabled : {}),
          }}
          onClick={onCreateSubscription}
          disabled={loading || !isFormValid}
          onMouseOver={(e) => {
            if (!loading && isFormValid) e.target.style.backgroundColor = '#C70066';
          }}
          onMouseOut={(e) => {
            if (!loading && isFormValid) e.target.style.backgroundColor = '#E6007A';
          }}
        >
          {loading && <div style={styles.spinner}></div>}
          {loading ? 'Creating...' : 'Create Subscription'}
        </button>
      </div>
    </div>
  );
}
