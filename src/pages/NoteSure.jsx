import { useState } from 'react';
import {
  Banknote, Camera, CheckCircle, XCircle, AlertTriangle,
  ScanLine, FileCheck, Shield
} from 'lucide-react';
import { sampleScans, currencyDenominations } from '../data/currencyData';
import ConfidenceGauge from '../components/ConfidenceGauge';
import StatusBadge from '../components/StatusBadge';

function FeatureResult({ name, data }) {
  const statusIcon = {
    pass: <CheckCircle size={16} style={{ color: 'var(--status-safe)' }} />,
    fail: <XCircle size={16} style={{ color: 'var(--status-danger)' }} />,
    warning: <AlertTriangle size={16} style={{ color: 'var(--status-warning)' }} />,
  };

  const statusColor = {
    pass: 'var(--status-safe)',
    fail: 'var(--status-danger)',
    warning: 'var(--status-warning)',
  };

  return (
    <div style={{
      padding: '12px 16px',
      background: 'var(--bg-glass)',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${statusColor[data.status]}20`,
      transition: 'all var(--transition-fast)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {statusIcon[data.status]}
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{name}</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: statusColor[data.status],
        }}>
          {(data.score * 100).toFixed(0)}%
        </span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 8 }}>
        <div
          className={`progress-bar-fill ${data.status === 'pass' ? 'safe' : data.status === 'fail' ? 'danger' : 'warning'}`}
          style={{ width: `${data.score * 100}%` }}
        />
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {data.detail}
      </p>
    </div>
  );
}

export default function NoteSure() {
  const [selectedScan, setSelectedScan] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState('');

  const handleScan = (scan) => {
    setScanning(true);
    setSelectedScan(null);
    const phases = [
      'Aligning image...',
      'Classifying denomination...',
      'Extracting security zones...',
      'Analysing microprint...',
      'Verifying security thread...',
      'Checking watermark...',
      'Validating serial number...',
      'Estimating UV response...',
      'Computing final verdict...',
    ];
    let i = 0;
    const phaseInterval = setInterval(() => {
      if (i < phases.length) {
        setScanPhase(phases[i]);
        i++;
      } else {
        clearInterval(phaseInterval);
        setScanning(false);
        setSelectedScan(scan);
      }
    }, 300);
  };

  const verdictColors = {
    GENUINE: { bg: 'rgba(76, 175, 80, 0.06)', border: 'rgba(76, 175, 80, 0.2)' },
    COUNTERFEIT: { bg: 'rgba(239, 83, 80, 0.06)', border: 'rgba(239, 83, 80, 0.2)' },
    SUSPICIOUS: { bg: 'rgba(255, 152, 0, 0.06)', border: 'rgba(255, 152, 0, 0.2)' },
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <Banknote size={24} style={{ color: 'var(--status-warning)', marginRight: 8, verticalAlign: 'middle' }} />
            NoteSure
          </h1>
          <p className="page-subtitle">
            AI-powered counterfeit currency identification with multi-feature analysis
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <span className="badge badge-info">
            <Shield size={10} /> 98.2% Detection Accuracy
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Scanner */}
        <div>
          {/* Scan Viewport */}
          <div className="glass-card-static" style={{ marginBottom: 20 }}>
            <div className="scan-viewport" style={{ marginBottom: 16 }}>
              {scanning ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="scan-crosshair scanning" style={{ margin: '0 auto' }}>
                    <div style={{
                      position: 'absolute',
                      bottom: -30,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      fontSize: '0.8rem',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {scanPhase}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Camera size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem' }}>Select a sample scan below to analyse</p>
                  <p style={{ fontSize: '0.72rem', marginTop: 4 }}>Supports ₹100, ₹200, ₹500, ₹2000 denominations</p>
                </div>
              )}
            </div>

            <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ScanLine size={16} style={{ color: 'var(--accent-blue)' }} />
              Sample Scans
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sampleScans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => handleScan(scan)}
                  className="glass-card"
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: currencyDenominations.find(d => d.value === scan.denomination)?.color,
                      }}>
                        ₹{scan.denomination}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        S/N: {scan.serialNumber}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{scan.id}</span>
                  </div>
                  <StatusBadge status={scan.verdict} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {selectedScan ? (
            <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Verdict Card */}
              <div className="glass-card-static" style={{
                background: verdictColors[selectedScan.verdict]?.bg,
                borderColor: verdictColors[selectedScan.verdict]?.border,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <ConfidenceGauge
                    value={selectedScan.confidence * 100}
                    size={110}
                    label="Confidence"
                    colorOverride={
                      selectedScan.verdict === 'GENUINE' ? 'var(--status-safe)' :
                      selectedScan.verdict === 'COUNTERFEIT' ? 'var(--status-danger)' :
                      'var(--status-warning)'
                    }
                  />
                  <div>
                    <StatusBadge status={selectedScan.verdict} />
                    <h3 style={{ marginTop: 8 }}>₹{selectedScan.denomination} — {selectedScan.serialNumber}</h3>
                    <p className="text-secondary" style={{ fontSize: '0.82rem', marginTop: 4 }}>
                      Scan ID: {selectedScan.id} • {new Date(selectedScan.timestamp).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Analysis */}
              <div className="glass-card-static">
                <h4 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileCheck size={16} style={{ color: 'var(--accent-blue)' }} />
                  Security Feature Analysis
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <FeatureResult name="Microprint Analysis" data={selectedScan.features.microprint} />
                  <FeatureResult name="Security Thread" data={selectedScan.features.securityThread} />
                  <FeatureResult name="Watermark Verification" data={selectedScan.features.watermark} />
                  <FeatureResult name="Serial Number Check" data={selectedScan.features.serialNumber} />
                  <FeatureResult name="Intaglio Print" data={selectedScan.features.intaglio} />
                  <FeatureResult name="UV Feature Estimate" data={selectedScan.features.uvEstimate} />
                </div>
              </div>

              {/* Audit Trail */}
              <div className="glass-card-static">
                <h4 style={{ marginBottom: 10, fontSize: '0.85rem' }}>📋 Audit Trail</h4>
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  wordBreak: 'break-all',
                  border: '1px solid var(--border-subtle)',
                }}>
                  Evidence Hash: {selectedScan.auditHash}
                </div>
              </div>
            </div>
          ) : !scanning ? (
            <div className="glass-card-static" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              color: 'var(--text-muted)',
            }}>
              <Banknote size={64} style={{ opacity: 0.3, marginBottom: 16 }} />
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>No Scan Selected</h3>
              <p style={{ fontSize: '0.85rem' }}>Select a sample scan from the left panel to view analysis results</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
