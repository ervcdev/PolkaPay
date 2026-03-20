/**
 * SubscriptionsTable Component - KodaPay
 * Institutional-grade professional table
 */

import { useState } from 'react';

const styles = {
  container: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E5E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9FB',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  count: {
    fontSize: '12px',
    color: '#737373',
    fontFamily: "'JetBrains Mono', monospace",
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 24px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: 600,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #E5E5E5',
    backgroundColor: '#FAFAFA',
  },
  thRight: {
    textAlign: 'right',
  },
  tr: {
    transition: 'background-color 0.1s ease',
  },
  trHover: {
    backgroundColor: '#FAFAFA',
  },
  td: {
    padding: '16px 24px',
    fontSize: '13px',
    color: '#111111',
    borderBottom: '1px solid #F4F4F5',
    verticalAlign: 'middle',
  },
  tdMono: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
  },
  addressCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  copyBtn: {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#A3A3A3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
  },
  copyIcon: {
    width: '14px',
    height: '14px',
  },
  statusActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: 'rgba(230, 0, 122, 0.1)',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#E6007A',
  },
  statusInactive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#F4F4F5',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#737373',
  },
  statusDue: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#FFF7ED',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#EA580C',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  btnExecute: {
    padding: '6px 12px',
    backgroundColor: '#E6007A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnCancel: {
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    color: '#DC2626',
    border: '1px solid #FECACA',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnView: {
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    color: '#525252',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  emptyState: {
    padding: '64px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    color: '#D4D4D4',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#111111',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '13px',
    color: '#737373',
    maxWidth: '300px',
    margin: '0 auto',
  },
};

const TableIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
  </svg>
);

const CopyIcon = () => (
  <svg style={styles.copyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

const EmptyIcon = () => (
  <svg style={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

export default function SubscriptionsTable({ subscriptions = [], onCancel, onExecute, loading }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatNextPayment = (lastPayment, frequency) => {
    const next = (parseInt(lastPayment) + parseInt(frequency)) * 1000;
    const date = new Date(next);
    if (date.getTime() <= Date.now()) return 'Due Now';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const activeCount = subscriptions.filter(s => s.active).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <TableIcon />
          <span style={styles.title}>Subscriptions</span>
        </div>
        <span style={styles.count}>{activeCount} active / {subscriptions.length} total</span>
      </div>

      {subscriptions.length === 0 ? (
        <div style={styles.emptyState}>
          <EmptyIcon />
          <h4 style={styles.emptyTitle}>No Subscriptions Yet</h4>
          <p style={styles.emptyText}>
            Create your first subscription to automate recurring payments on-chain.
          </p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Subscription ID</th>
              <th style={styles.th}>Recipient</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={{...styles.th, ...styles.thRight}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr 
                key={sub.id}
                style={{
                  ...styles.tr,
                  ...(hoveredRow === sub.id ? styles.trHover : {}),
                }}
                onMouseEnter={() => setHoveredRow(sub.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={{...styles.td, ...styles.tdMono}}>#{sub.id}</td>
                <td style={{...styles.td, ...styles.tdMono}}>
                  <div style={styles.addressCell}>
                    {formatAddress(sub.receiver)}
                    <button
                      style={styles.copyBtn}
                      onClick={() => copyToClipboard(sub.receiver, sub.id)}
                      title="Copy address"
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </td>
                <td style={{...styles.td, ...styles.tdMono}}>{sub.amount} mUSDT</td>
                <td style={styles.td}>
                  {!sub.active ? (
                    <span style={styles.statusInactive}>
                      <span style={{...styles.statusDot, backgroundColor: '#737373'}}></span>
                      Inactive
                    </span>
                  ) : sub.isDue ? (
                    <span style={styles.statusDue}>
                      <span style={{...styles.statusDot, backgroundColor: '#EA580C'}}></span>
                      Due
                    </span>
                  ) : (
                    <span style={styles.statusActive}>
                      <span style={{...styles.statusDot, backgroundColor: '#E6007A'}}></span>
                      Active
                    </span>
                  )}
                </td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  <div style={styles.actions}>
                    {sub.active && sub.isDue && (
                      <button
                        style={{
                          ...styles.btnExecute,
                          ...(loading ? styles.btnDisabled : {}),
                        }}
                        onClick={() => onExecute(sub.id)}
                        disabled={loading}
                        onMouseOver={(e) => {
                          if (!loading) e.target.style.backgroundColor = '#C70066';
                        }}
                        onMouseOut={(e) => {
                          if (!loading) e.target.style.backgroundColor = '#E6007A';
                        }}
                      >
                        Execute
                      </button>
                    )}
                    {sub.active && (
                      <button
                        style={{
                          ...styles.btnCancel,
                          ...(loading ? styles.btnDisabled : {}),
                        }}
                        onClick={() => onCancel(sub.id)}
                        disabled={loading}
                        onMouseOver={(e) => {
                          if (!loading) e.target.style.backgroundColor = '#FEF2F2';
                        }}
                        onMouseOut={(e) => {
                          if (!loading) e.target.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
