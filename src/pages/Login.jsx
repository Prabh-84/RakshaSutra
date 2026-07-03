import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield, Mail, Lock, Eye, EyeOff, ArrowRight,
  Fingerprint, ShieldCheck, AlertTriangle, User,
  Building2, BadgeCheck, ChevronRight, Zap
} from 'lucide-react';

export default function Login({ onSwitchToSignup }) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleDemoLogin = async (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError('');
    const result = await login(demoUser.email, demoUser.password);
    if (!result.success) setError(result.error);
  };

  const roleConfig = {
    national_admin: { color: '#ef5350', label: 'National Admin', icon: '🏛️' },
    state_officer: { color: '#42a5f5', label: 'State Officer', icon: '👮' },
    bank_operator: { color: '#66bb6a', label: 'Bank Operator', icon: '🏦' },
  };

  return (
    <div className="auth-page">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-orb auth-bg-orb-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        {/* Left: Brand panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <div className="auth-logo-icon">
                <Shield size={28} color="#fff" />
              </div>
              <div>
                <h1 className="auth-logo-text">RakshaSutra</h1>
                <p className="auth-logo-sub">Digital Public Safety AI</p>
              </div>
            </div>

            <div className="auth-brand-tagline">
              <h2>Protecting India's<br />Digital Future</h2>
              <p>AI-powered intelligence platform defeating counterfeiting, fraud & digital arrest scams across 28 states.</p>
            </div>

            <div className="auth-brand-stats">
              {[
                { value: '₹423 Cr', label: 'Loss Prevented', icon: Zap },
                { value: '47,832', label: 'Citizens Protected', icon: ShieldCheck },
                { value: '22s', label: 'Avg Detection', icon: Fingerprint },
              ].map((stat, i) => (
                <div key={i} className="auth-stat-item">
                  <stat.icon size={18} className="auth-stat-icon" />
                  <div className="auth-stat-value">{stat.value}</div>
                  <div className="auth-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="auth-brand-modules">
              {['Scam Sentinel', 'NoteSure', 'FraudGraph', 'CrimeMap', 'NagrikShield'].map((mod, i) => (
                <span key={i} className="auth-module-pill">{mod}</span>
              ))}
            </div>
          </div>

          <div className="auth-brand-footer">
            <Lock size={12} />
            <span>End-to-end encrypted • DPDP Act 2023 Compliant</span>
          </div>
        </div>

        {/* Right: Login form */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2>Welcome back</h2>
              <p>Sign in to access the Command Centre</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="auth-error">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="login-email">
                  <Mail size={14} />
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="officer@mha.gov.in"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">
                  <Lock size={14} />
                  Password
                </label>
                <div className="auth-password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="auth-toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-options">
                <label className="auth-remember">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <button type="button" className="auth-link">Forgot password?</button>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="auth-spinner" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>



            <div className="auth-form-footer">
              <span>Don't have an account?</span>
              <button className="auth-link" onClick={onSwitchToSignup}>
                Request Access <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
