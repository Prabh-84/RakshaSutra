import { useState, useRef, useEffect } from 'react';
import {
  MessageCircleWarning, Send, Globe, Shield, AlertTriangle,
  CheckCircle, XCircle, Phone, FileText, Wifi, WifiOff
} from 'lucide-react';
import { chatScenarios, supportedLanguages } from '../data/chatScenarios';
import { sendChatMessage, APIError } from '../services/api';


function VerdictCard({ verdict }) {
  const levelConfig = {
    danger: {
      bg: 'var(--status-danger-bg)',
      border: 'rgba(239, 83, 80, 0.25)',
      icon: <XCircle size={20} style={{ color: 'var(--status-danger)' }} />,
    },
    warning: {
      bg: 'var(--status-warning-bg)',
      border: 'rgba(255, 152, 0, 0.25)',
      icon: <AlertTriangle size={20} style={{ color: 'var(--status-warning)' }} />,
    },
    safe: {
      bg: 'var(--status-safe-bg)',
      border: 'rgba(76, 175, 80, 0.25)',
      icon: <CheckCircle size={20} style={{ color: 'var(--status-safe)' }} />,
    },
  };

  const config = levelConfig[verdict.level];

  return (
    <div style={{
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: 'var(--radius-md)',
      padding: '14px',
      marginTop: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {config.icon}
        <strong style={{ fontSize: '0.9rem' }}>{verdict.title}</strong>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
        {verdict.details}
      </p>
      <div style={{
        fontSize: '0.72rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        marginBottom: 10,
      }}>
        Confidence: {(verdict.confidence * 100).toFixed(0)}%
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {verdict.actions.map((action, i) => (
          <div key={i} style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
            {action}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NagrikShield() {
  const sessionId = useRef(`sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '🛡️ Welcome to **NagrikShield** — Your Digital Safety Assistant.\n\nI can help you assess suspicious calls, messages, and payment requests in real-time.\n\nSelect a scenario below or describe your situation:',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [apiError, setApiError] = useState(null);
  const chatEndRef = useRef(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const scenarioStepRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const processScenario = (scenario) => {
    setActiveScenario(scenario);
    scenarioStepRef.current = 0;
    setMessages(prev => [...prev, { type: 'user', text: scenario.trigger }]);

    let delay = 500;
    scenario.steps.forEach((step) => {
      delay += step.delay || 1000;
      if (step.type === 'bot') {
        setTimeout(() => setTyping(true), delay - 600);
        setTimeout(() => {
          setTyping(false);
          setMessages(prev => [...prev, { type: 'bot', text: step.text, verdict: step.verdict || null }]);
        }, delay);
      } else if (step.type === 'user_auto') {
        setTimeout(() => {
          setMessages(prev => [...prev, { type: 'user', text: step.text }]);
        }, delay);
      }
    });
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    setInput('');
    setApiError(null);
    setMessages(prev => [...prev, { type: 'user', text: trimmed }]);
    setTyping(true);

    try {
      const result = await sendChatMessage({
        message: trimmed,
        language: selectedLang,
        session_id: sessionId.current,
      });

      setTyping(false);

      // Map API verdict to UI verdict card format
      const verdictMap = {
        danger: { level: 'danger', title: '🚨 HIGH RISK — Likely Scam', details: result.response, confidence: result.confidence, actions: result.helpline ? [`📞 Call ${result.helpline} immediately`, '✅ Do NOT follow caller instructions', '✅ Disconnect the call now'] : ['Stay vigilant', 'Do not share personal information'] },
        suspicious: { level: 'warning', title: '⚠️ Suspicious Activity Detected', details: result.response, confidence: result.confidence, actions: result.helpline ? [`📞 Report to ${result.helpline} if needed`, '✅ Do NOT share OTP or PIN', '✅ Verify through official channels only'] : ['Proceed with caution', 'Do not share OTP'] },
        safe: { level: 'safe', title: '✅ No Threat Detected', details: result.response, confidence: result.confidence, actions: ['Stay alert for future messages', 'Never share OTP with anyone'] },
      };

      const verdict = verdictMap[result.risk_verdict];

      setMessages(prev => [...prev, {
        type: 'bot',
        text: result.response,
        verdict: verdict || null,
      }]);
    } catch (err) {
      setTyping(false);
      const errMsg = err instanceof APIError
        ? `⚠️ ${err.message}`
        : '⚠️ Unable to connect to the AI assistant. Please check your connection and try again.';
      setApiError(errMsg);
      setMessages(prev => [...prev, { type: 'bot', text: errMsg }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatBotText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="animate-fadeIn" style={{ height: 'calc(100vh - var(--topbar-height) - 48px)' }}>
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-header-left">
          <h1>
            <MessageCircleWarning size={24} style={{ color: 'var(--status-safe)', marginRight: 8, verticalAlign: 'middle' }} />
            NagrikShield
          </h1>
          <p className="page-subtitle">
            Citizen fraud protection assistant — real-time scam risk assessment in 12 languages
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <Globe size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            className="select-styled"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            style={{ minWidth: 140 }}
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeLabel} ({lang.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16, height: 'calc(100% - 60px)' }}>
        {/* Chat */}
        <div className="glass-card-static" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(76, 175, 80, 0.04)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--status-safe), #2e7d32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>NagrikShield AI</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--status-safe)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-safe)', animation: 'pulse-dot 2s infinite' }} />
                Online — Ready to assist
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-secondary" style={{ fontSize: '0.72rem' }}>
                <Phone size={12} /> 1930
              </button>
              <button className="btn btn-sm btn-secondary" style={{ fontSize: '0.72rem' }}>
                <FileText size={12} /> NCRB
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages" style={{ flex: 1, overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.type}`}>
                {msg.type === 'bot' && msg.text && formatBotText(msg.text)}
                {msg.type === 'user' && msg.text}
                {msg.verdict && <VerdictCard verdict={msg.verdict} />}
              </div>
            ))}
            {typing && (
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Scenarios */}
          <div style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
          }}>
            {chatScenarios.map(scenario => (
              <button
                key={scenario.id}
                className="quick-action-btn"
                onClick={() => processScenario(scenario)}
                style={{ fontSize: '0.72rem' }}
              >
                {scenario.quickLabel}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your situation or type a question..."
            />
            <button
              className="btn btn-primary btn-icon"
              onClick={handleSend}
              style={{ borderRadius: 'var(--radius-full)', width: 42, height: 42 }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          <div className="glass-card-static">
            <h4 style={{ fontSize: '0.85rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={14} style={{ color: 'var(--status-safe)' }} />
              Quick Stats
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Queries Today', value: '1,847', color: 'var(--accent-blue)' },
                { label: 'Scams Prevented', value: '342', color: 'var(--status-safe)' },
                { label: 'Active Threats', value: '23', color: 'var(--status-danger)' },
                { label: 'Languages Active', value: '12', color: 'var(--accent-purple)' },
              ].map((stat, i) => (
                <div key={i} className="feature-score-row">
                  <span className="feature-score-label">{stat.label}</span>
                  <span className="feature-score-value" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card-static">
            <h4 style={{ fontSize: '0.85rem', marginBottom: 10 }}>🚨 Trending Scams</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Digital Arrest — CBI', count: 847, trend: '↑ 45%' },
                { name: 'Customs Parcel Scam', count: 312, trend: '↑ 23%' },
                { name: 'OTP Phishing', count: 256, trend: '↑ 12%' },
                { name: 'Investment/Trading', count: 198, trend: '↑ 67%' },
                { name: 'Loan App Fraud', count: 134, trend: '↑ 8%' },
              ].map((scam, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <span style={{ fontSize: '0.78rem' }}>{scam.name}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {scam.count}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--status-danger)', fontWeight: 600 }}>
                      {scam.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card-static">
            <h4 style={{ fontSize: '0.85rem', marginBottom: 10 }}>📞 Emergency Contacts</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cyber Crime Helpline</span>
                <strong style={{ color: 'var(--status-danger)' }}>1930</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Police Emergency</span>
                <strong style={{ color: 'var(--status-danger)' }}>112</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Women Helpline</span>
                <strong style={{ color: 'var(--status-danger)' }}>181</strong>
              </div>
              <div style={{ marginTop: 6 }}>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer"
                  style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>
                  🌐 cybercrime.gov.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
