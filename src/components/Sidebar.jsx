import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShieldAlert,
  Banknote,
  Network,
  MapPin,
  MessageCircleWarning,
  Shield,
  Server
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Command Centre', section: 'overview' },
  { to: '/scam-sentinel', icon: ShieldAlert, label: 'Scam Sentinel', badge: 3, section: 'modules' },
  { to: '/notesure', icon: Banknote, label: 'NoteSure', section: 'modules' },
  { to: '/fraudgraph', icon: Network, label: 'FraudGraph', section: 'modules' },
  { to: '/crimemap', icon: MapPin, label: 'CrimeMap', section: 'modules' },
  { to: '/nagrikshield', icon: MessageCircleWarning, label: 'NagrikShield', section: 'modules' },
  { to: '/architecture', icon: Server, label: 'Architecture', section: 'system' },
];

const sectionLabels = {
  overview: 'Overview',
  modules: 'Intelligence Modules',
  system: 'System',
};

const roleColors = {
  national_admin: '#ef5350',
  state_officer: '#42a5f5',
  bank_operator: '#66bb6a',
  district_officer: '#ff9800',
  telecom_operator: '#7c4dff',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  let currentSection = '';

  const avatarColor = user ? roleColors[user.role] || '#4a90d9' : '#4a90d9';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Shield size={20} color="#fff" />
        </div>
        <div className="brand-text">
          <span className="brand-name">RakshaSutra</span>
          <span className="brand-sub">Digital Public Safety AI</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const showSection = item.section !== currentSection;
          if (showSection) currentSection = item.section;

          return (
            <div key={item.to}>
              {showSection && (
                <div className="nav-section-label">
                  {sectionLabels[item.section]}
                </div>
              )}
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            </div>
          );
        })}
      </nav>

      {user && (
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              padding: '16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'background 200ms',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-glass-hover)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-full)',
              background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}aa)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}>
              {user.avatar}
            </div>
            <div className="brand-text" style={{ minWidth: 0 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.unit}
              </span>
            </div>
          </div>
          
          {showProfileMenu && (
            <div className="dropdown-menu animate-fadeInUp" style={{ bottom: '70px', left: '16px', width: '220px' }}>
              <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
              </div>
              <div style={{ padding: '8px' }}>
                <button className="dropdown-item-btn">Profile Settings</button>
                <button className="dropdown-item-btn">Preferences</button>
              </div>
              <div style={{ padding: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <button className="dropdown-item-btn" style={{ color: 'var(--status-danger)' }} onClick={logout}>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
