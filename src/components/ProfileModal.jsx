import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/api';
import { Shield, User, Building2, BadgeCheck, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ProfileModal({ onClose }) {
  const { user, updateUserState } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
    unit: user?.unit || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await updateProfileApi(form);
      if (res.success) {
        updateUserState(res.user);
        setSuccess('Profile updated successfully.');
        setTimeout(() => onClose(), 1500);
      } else {
        setError(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div className="glass-card-static animate-fadeInUp" style={{
        maxWidth: 450, width: '90%',
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold'
            }}>
              {user?.avatar}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Profile Settings</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{user?.email}</p>
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ fontSize: '0.85rem', color: 'var(--status-danger)', padding: '10px', background: 'rgba(239,83,80,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}
          {success && (
            <div style={{ fontSize: '0.85rem', color: 'var(--status-safe)', padding: '10px', background: 'rgba(102,187,106,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={14} /> {success}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
              <User size={14} /> Full Name
            </label>
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})}
              style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                padding: '10px 14px', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
              <BadgeCheck size={14} /> Designation
            </label>
            <input 
              type="text" 
              value={form.designation} 
              onChange={e => setForm({...form, designation: e.target.value})}
              style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                padding: '10px 14px', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
              <Building2 size={14} /> Unit / Organisation
            </label>
            <input 
              type="text" 
              value={form.unit} 
              onChange={e => setForm({...form, unit: e.target.value})}
              style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                padding: '10px 14px', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
