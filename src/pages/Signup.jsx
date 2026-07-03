import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  User, Building2, BadgeCheck, AlertTriangle, Zap,
  Fingerprint, ShieldCheck, CheckCircle
} from 'lucide-react';

const roleOptions = [
  { value: 'national_admin', label: 'National Command (MHA/I4C)', icon: '🏛️', desc: 'Full platform access including intelligence fusion and cross-state data', color: '#ef5350' },
  { value: 'state_officer', label: 'State Cyber Cell Officer', icon: '👮', desc: 'State-level intelligence, case management, and investigation tools', color: '#42a5f5' },
  { value: 'district_officer', label: 'District Field Officer', icon: '🎖️', desc: 'District-level alerts, patrol routes, and field operations', color: '#ff9800' },
  { value: 'bank_operator', label: 'Bank / Financial Institution', icon: '🏦', desc: 'NoteSure counterfeit detection and fraud alert integration', color: '#66bb6a' },
  { value: 'telecom_operator', label: 'Telecom Provider', icon: '📡', desc: 'Scam Sentinel API feeds and call interception workflows', color: '#7c4dff' },
];

export default function Signup({ onSwitchToLogin }) {
  const { signup, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    designation: '',
    unit: '',
    agreeTerms: false,
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!form.email.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { setError('Please select your role.'); return; }
    if (!form.agreeTerms) { setError('You must agree to the terms.'); return; }

    const result = await signup(form);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-orb auth-bg-orb-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        {/* Left Brand */}
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
              <h2>Join the Network<br />of Digital Safety</h2>
              <p>Request authorized access to India's most advanced public safety intelligence platform.</p>
            </div>

            {/* Onboarding steps */}
            <div className="auth-steps">
              {[
                { num: 1, label: 'Create Account', desc: 'Personal & credentials' },
                { num: 2, label: 'Select Role', desc: 'Access level & unit' },
                { num: 3, label: 'Verification', desc: 'Admin approval' },
              ].map((s, i) => (
                <div key={i} className={`auth-step ${step >= s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}>
                  <div className="auth-step-num">
                    {step > s.num ? <CheckCircle size={16} /> : s.num}
                  </div>
                  <div>
                    <div className="auth-step-label">{s.label}</div>
                    <div className="auth-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-brand-stats">
              {[
                { value: '28', label: 'States Connected', icon: Zap },
                { value: '500+', label: 'LEA Users', icon: ShieldCheck },
                { value: '99.97%', label: 'Uptime', icon: Fingerprint },
              ].map((stat, i) => (
                <div key={i} className="auth-stat-item">
                  <stat.icon size={18} className="auth-stat-icon" />
                  <div className="auth-stat-value">{stat.value}</div>
                  <div className="auth-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-brand-footer">
            <Lock size={12} />
            <span>End-to-end encrypted • DPDP Act 2023 Compliant</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {step === 2 && (
                  <button className="auth-back-btn" onClick={() => setStep(1)}>
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div>
                  <h2>{step === 1 ? 'Create Account' : 'Select Your Role'}</h2>
                  <p>{step === 1 ? 'Enter your details to request access' : 'Choose your access level and unit'}</p>
                </div>
              </div>

              {/* Step indicator pills */}
              <div className="auth-step-pills">
                <div className={`auth-pill ${step >= 1 ? 'active' : ''}`} />
                <div className={`auth-pill ${step >= 2 ? 'active' : ''}`} />
              </div>
            </div>

            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="auth-form">
              {error && (
                <div className="auth-error">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {step === 1 && (
                <>
                  <div className="auth-field">
                    <label htmlFor="signup-name"><User size={14} /> Full Name</label>
                    <input
                      id="signup-name"
                      type="text"
                      value={form.name}
                      onChange={e => updateField('name', e.target.value)}
                      placeholder="Inspector Meera Sharma"
                      autoComplete="name"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="auth-field">
                    <label htmlFor="signup-email"><Mail size={14} /> Official Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={form.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder="officer@mha.gov.in"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="auth-field-row">
                    <div className="auth-field">
                      <label htmlFor="signup-password"><Lock size={14} /> Password</label>
                      <div className="auth-password-wrap">
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={e => updateField('password', e.target.value)}
                          placeholder="Min 6 characters"
                          autoComplete="new-password"
                          disabled={isLoading}
                        />
                        <button type="button" className="auth-toggle-pw" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="auth-field">
                      <label htmlFor="signup-confirm"><Lock size={14} /> Confirm Password</label>
                      <input
                        id="signup-confirm"
                        type="password"
                        value={form.confirmPassword}
                        onChange={e => updateField('confirmPassword', e.target.value)}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn">
                    Continue <ArrowRight size={18} />
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="auth-role-grid">
                    {roleOptions.map(role => (
                      <button
                        key={role.value}
                        type="button"
                        className={`auth-role-card ${form.role === role.value ? 'selected' : ''}`}
                        style={{ '--role-color': role.color }}
                        onClick={() => updateField('role', role.value)}
                      >
                        <div className="auth-role-icon">{role.icon}</div>
                        <div className="auth-role-label">{role.label}</div>
                        <div className="auth-role-desc">{role.desc}</div>
                        {form.role === role.value && (
                          <CheckCircle size={18} className="auth-role-check" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="auth-field-row">
                    <div className="auth-field">
                      <label htmlFor="signup-designation"><BadgeCheck size={14} /> Designation</label>
                      <input
                        id="signup-designation"
                        type="text"
                        value={form.designation}
                        onChange={e => updateField('designation', e.target.value)}
                        placeholder="e.g. Senior Inspector"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="auth-field">
                      <label htmlFor="signup-unit"><Building2 size={14} /> Unit / Organisation</label>
                      <input
                        id="signup-unit"
                        type="text"
                        value={form.unit}
                        onChange={e => updateField('unit', e.target.value)}
                        placeholder="e.g. MH Cyber Cell"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <label className="auth-terms">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={e => updateField('agreeTerms', e.target.checked)}
                    />
                    <span>I agree to the <button type="button" className="auth-link">Terms of Service</button>, <button type="button" className="auth-link">Privacy Policy</button>, and acknowledge that access is subject to admin verification.</span>
                  </label>

                  <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <div className="auth-spinner" />
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Request Access
                      </>
                    )}
                  </button>
                </>
              )}
            </form>

            <div className="auth-form-footer">
              <span>Already have an account?</span>
              <button className="auth-link" onClick={onSwitchToLogin}>
                Sign In <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
