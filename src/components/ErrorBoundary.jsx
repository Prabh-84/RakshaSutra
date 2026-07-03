import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

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
          border: '1px solid rgba(239, 83, 80, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          maxWidth: 520,
          width: '100%',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
        }}>
          <AlertTriangle size={48} color="var(--status-danger)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            An unexpected error occurred in this module. Your session and data are safe.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              background: 'rgba(239, 83, 80, 0.08)',
              border: '1px solid rgba(239, 83, 80, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              fontSize: '0.72rem',
              color: 'var(--status-danger)',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              marginBottom: '1.5rem',
              maxHeight: 160,
              overflow: 'auto',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <button
            className="btn btn-primary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RefreshCw size={16} style={{ marginRight: 8 }} />
            Try again
          </button>
        </div>
      </div>
    );
  }
}
