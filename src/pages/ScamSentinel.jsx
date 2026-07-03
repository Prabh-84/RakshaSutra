import { useState } from 'react';
import {
  ShieldAlert, Phone, Clock, AlertTriangle, CheckCircle,
  XCircle, FileText, Send, Radio, Eye
} from 'lucide-react';
import { scamSessions } from '../data/scamSessions';
import ConfidenceGauge from '../components/ConfidenceGauge';
import StatusBadge from '../components/StatusBadge';

function ScoreBar({ label, score, icon }) {
  const getColor = (s) => {
    if (s >= 0.8) return 'danger';
    if (s >= 0.5) return 'warning';
    return 'safe';
  };

  return (
    <div className="feature-score-row">
      <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>{icon}</span>
      <span className="feature-score-label">{label}</span>
      <div className="feature-score-bar">
        <div className="progress-bar">
          <div
            className={`progress-bar-fill ${getColor(score)}`}
            style={{ width: `${score * 100}%` }}
          />
        </div>
      </div>
      <span className="feature-score-value" style={{
        color: score >= 0.8 ? 'var(--status-danger)' :
               score >= 0.5 ? 'var(--status-warning)' : 'var(--status-safe)',
      }}>
        {(score * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export default function ScamSentinel() {
  const [selectedSession, setSelectedSession] = useState(scamSessions[0]);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSelect = (session) => {
    setAnalyzing(true);
    setSelectedSession(null);
    setTimeout(() => {
      setSelectedSession(session);
      setAnalyzing(false);
    }, 1800);
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <ShieldAlert size={24} style={{ color: 'var(--status-danger)', marginRight: 8, verticalAlign: 'middle' }} />
            Scam Sentinel
          </h1>
          <p className="page-subtitle">
            Real-time digital arrest scam detection & alerting system
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <span className="badge badge-danger" style={{ animation: 'pulse-dot 2s infinite' }}>
            <Radio size={10} /> 3 Active Sessions
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>
        {/* Session List */}
        <div className="glass-card-static" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h4 style={{ fontSize: '0.9rem' }}>Call Sessions</h4>
            <span className="badge badge-neutral">{scamSessions.length} sessions</span>
          </div>
          <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            {scamSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelect(session)}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  background: selectedSession?.id === session.id ? 'var(--accent-blue-glow)' : 'transparent',
                  borderLeft: selectedSession?.id === session.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {session.id}
                  </span>
                  <StatusBadge status={session.verdict} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: 12 }}>
                  <span><Phone size={12} style={{ verticalAlign: 'middle' }} /> {session.caller}</span>
                  <span><Clock size={12} style={{ verticalAlign: 'middle' }} /> {formatDuration(session.duration)}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {session.calleeCity} • {session.impersonatedAgency !== 'N/A' ? session.impersonatedAgency : 'No impersonation'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Panel */}
        <div>
          {analyzing ? (
            <div className="glass-card-static" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              gap: 20,
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '3px solid var(--accent-blue)',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }} />
              <h3 style={{ color: 'var(--accent-blue)' }}>Analyzing Call Session...</h3>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
                Running AI classification pipeline: CDR Pattern → Spoofing → NLP Script → Deepfake
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : selectedSession ? (
            <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Verdict Header */}
              <div className="glass-card-static" style={{
                background: selectedSession.verdict === 'SCAM_DETECTED' ? 'rgba(239, 83, 80, 0.06)' :
                             selectedSession.verdict === 'SUSPICIOUS' ? 'rgba(255, 152, 0, 0.06)' :
                             'rgba(76, 175, 80, 0.06)',
                borderColor: selectedSession.verdict === 'SCAM_DETECTED' ? 'rgba(239, 83, 80, 0.2)' :
                              selectedSession.verdict === 'SUSPICIOUS' ? 'rgba(255, 152, 0, 0.2)' :
                              'rgba(76, 175, 80, 0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <ConfidenceGauge
                    value={selectedSession.confidence * 100}
                    size={100}
                    label="Confidence"
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <StatusBadge status={selectedSession.verdict} />
                      <StatusBadge status={selectedSession.status} />
                    </div>
                    <h3 style={{ marginBottom: 4 }}>{selectedSession.scamCategory}</h3>
                    <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
                      Session {selectedSession.id} • {selectedSession.caller} → {selectedSession.callee}
                      {' '}• Duration: {formatDuration(selectedSession.duration)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-scores + Key Phrases */}
              <div className="grid-2">
                <div className="glass-card-static">
                  <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Eye size={16} style={{ color: 'var(--accent-blue)' }} />
                    AI Analysis Breakdown
                  </h4>
                  <ScoreBar label="Call Pattern Match" score={selectedSession.subScores.callPattern} icon="📊" />
                  <ScoreBar label="Number Spoofing" score={selectedSession.subScores.spoofing} icon="📱" />
                  <ScoreBar label="Script Pattern Match" score={selectedSession.subScores.scriptMatch} icon="📝" />
                  <ScoreBar label="Deepfake Detection" score={selectedSession.subScores.deepfake} icon="🎭" />
                </div>

                <div className="glass-card-static">
                  <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={16} style={{ color: 'var(--status-warning)' }} />
                    Key Phrases Detected
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedSession.keyPhrases.map((phrase, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--status-danger-bg)',
                          border: '1px solid rgba(239, 83, 80, 0.15)',
                          color: 'var(--status-danger)',
                          fontSize: '0.78rem',
                          fontWeight: 500,
                        }}
                      >
                        "{phrase}"
                      </span>
                    ))}
                    {selectedSession.keyPhrases.length === 0 && (
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>No scam phrases detected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="glass-card-static">
                <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} style={{ color: 'var(--accent-blue)' }} />
                  Call Transcript (ASR Output)
                </h4>
                <div style={{
                  padding: '14px 18px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  {selectedSession.transcript}
                </div>
              </div>

              {/* Actions */}
              {selectedSession.recommendedActions.length > 0 && (
                <div className="glass-card-static">
                  <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Send size={16} style={{ color: 'var(--status-safe)' }} />
                    Recommended Actions
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedSession.recommendedActions.map((action, i) => {
                      const actionLabels = {
                        NOTIFY_VICTIM: { label: '🔔 Notify Victim', cls: 'btn-primary' },
                        BLOCK_CALLER: { label: '🚫 Block Caller', cls: 'btn-danger' },
                        ALERT_MHA: { label: '🏛️ Alert MHA/I4C', cls: 'btn-secondary' },
                        ESCALATE_NATIONAL: { label: '⬆️ National Escalation', cls: 'btn-danger' },
                        DISPATCH_LOCAL_POLICE: { label: '🚔 Dispatch Local Police', cls: 'btn-primary' },
                        MONITOR: { label: '👁️ Continue Monitoring', cls: 'btn-secondary' },
                        FLAG_NUMBER: { label: '🚩 Flag Number', cls: 'btn-secondary' },
                      };
                      const config = actionLabels[action] || { label: action, cls: 'btn-secondary' };
                      return (
                        <button key={i} className={`btn btn-sm ${config.cls}`}>
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{
                    marginTop: 16,
                    padding: '10px 14px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    Evidence Hash: {selectedSession.evidenceHash}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
