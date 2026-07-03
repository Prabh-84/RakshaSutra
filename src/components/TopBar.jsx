import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Activity, LogOut, ShieldAlert } from 'lucide-react';

const pageNames = {
  '/': 'Command Centre',
  '/scam-sentinel': 'Scam Sentinel',
  '/notesure': 'NoteSure — Counterfeit Detection',
  '/fraudgraph': 'FraudGraph — Network Intelligence',
  '/crimemap': 'CrimeMap — Geospatial Intelligence',
  '/nagrikshield': 'NagrikShield — Citizen Protection',
  '/architecture': 'System Architecture',
};

export default function TopBar() {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d) => {
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div className="topbar-title">{pageNames[location.pathname] || 'RakshaSutra'}</div>
          <div className="topbar-breadcrumb">
            AI-Powered Digital Public Safety Intelligence Platform
          </div>
        </div>
      </div>

      <div className="topbar-right">
        {user && (
          <div className="topbar-status" style={{ marginRight: 8 }}>
            <ShieldAlert size={14} style={{ color: user.clearanceLevel === 'TOP SECRET' ? 'var(--status-danger)' : 'var(--accent-blue)' }} />
            <span style={{ 
              color: user.clearanceLevel === 'TOP SECRET' ? 'var(--status-danger)' : 'var(--text-secondary)',
              fontWeight: user.clearanceLevel === 'TOP SECRET' ? 700 : 500 
            }}>
              {user.clearanceLevel}
            </span>
          </div>
        )}

        <div className="topbar-status">
          <span className="status-dot" />
          <span>All Systems Operational</span>
        </div>

        <div className="topbar-clock">
          <Activity size={12} style={{ marginRight: 6, display: 'inline' }} />
          {formatDate(time)} • {formatTime(time)} IST
        </div>

        <button className="topbar-btn" title="Search">
          <Search size={18} />
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="topbar-btn" 
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            <span className="notif-dot" />
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu animate-fadeInUp" style={{ right: 0, top: '40px', width: '320px' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Notifications</span>
                <span className="badge badge-danger">2 New</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <div className="dropdown-item" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-danger)', marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Scam Alert Surge</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>47 NagrikShield queries about 'customs parcel scam' in Tamil Nadu in the last hour.</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 6 }}>Just now</div>
                    </div>
                  </div>
                </div>
                <div className="dropdown-item">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)', marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Known FICN Batch Match</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>₹500 note serial 9BQ 234XXX matches RBI flagged FICN series.</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 6 }}>2 mins ago</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid var(--border-subtle)' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="topbar-btn" title="Sign Out" onClick={logout} style={{ color: 'var(--status-danger)' }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
