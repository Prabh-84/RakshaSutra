import { useNavigate } from 'react-router-dom';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '2rem',
    }}>
      <div style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem',
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
      }}>
        <ShieldOff size={56} color="var(--accent-blue)" style={{ marginBottom: '1.25rem', opacity: 0.8 }} />
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '0.5rem',
          letterSpacing: '0.15em',
        }}>
          RAKSHASUTRA / 404
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Route Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          The module or page you are looking for does not exist or has been moved to a different location.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} style={{ marginRight: 6 }} /> Go Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <Home size={16} style={{ marginRight: 6 }} /> Command Centre
          </button>
        </div>
      </div>
    </div>
  );
}
