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

        <button className="topbar-btn" title="Notifications">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        <button className="topbar-btn" title="Sign Out" onClick={logout} style={{ color: 'var(--status-danger)' }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
