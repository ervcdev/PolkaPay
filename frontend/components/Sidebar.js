/**
 * Sidebar Navigation - KodaPay
 * Fixed full-height sidebar with navigation icons
 */

import { useState } from 'react';

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '72px',
    height: '100vh',
    backgroundColor: '#F9F9FB',
    borderRight: '1px solid #E5E5E5',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
  },
  logoSection: {
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'center',
    borderBottom: '1px solid #E5E5E5',
  },
  logo: {
    width: '36px',
    height: '36px',
    backgroundColor: '#E6007A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '16px',
  },
  nav: {
    flex: 1,
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 0',
    cursor: 'pointer',
    color: '#737373',
    transition: 'all 0.15s ease',
    position: 'relative',
  },
  navItemActive: {
    color: '#E6007A',
    backgroundColor: '#FFFFFF',
  },
  navItemHover: {
    color: '#121212',
    backgroundColor: '#F4F4F5',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '24px',
    backgroundColor: '#E6007A',
    borderRadius: '0 2px 2px 0',
  },
  icon: {
    width: '20px',
    height: '20px',
    marginBottom: '4px',
  },
  label: {
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.3px',
  },
  footer: {
    padding: '16px 0',
    borderTop: '1px solid #E5E5E5',
    display: 'flex',
    justifyContent: 'center',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#16A34A',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
};

// SVG Icons as components
const DashboardIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" rx="1"/>
    <rect x="14" y="3" width="7" height="5" rx="1"/>
    <rect x="14" y="12" width="7" height="9" rx="1"/>
    <rect x="3" y="16" width="7" height="5" rx="1"/>
  </svg>
);

const MerchantIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const SubscriberIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const NetworkIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);

export default function Sidebar({ activeTab = 'dashboard', onTabChange }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'merchant', label: 'Merchant', icon: MerchantIcon },
    { id: 'subscriber', label: 'Subscriber', icon: SubscriberIcon },
    { id: 'network', label: 'Network', icon: NetworkIcon },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoSection}>
        <div style={styles.logo}>
          <span style={styles.logoText}>K</span>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <div
              key={item.id}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                ...(isHovered && !isActive ? styles.navItemHover : {}),
              }}
              onClick={() => onTabChange && onTabChange(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {isActive && <div style={styles.activeIndicator} />}
              <Icon />
              <span style={styles.label}>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div style={styles.statusDot} title="Connected to Network" />
      </div>
    </aside>
  );
}
