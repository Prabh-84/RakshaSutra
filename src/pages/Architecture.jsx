import { useState, useEffect } from 'react';
import {
  Server, Database, Brain, Shield, Globe, Layers,
  ArrowRight, CheckCircle, Cpu, HardDrive, Wifi, Lock,
  GitBranch, BarChart3, Eye, Radio, FileCheck
} from 'lucide-react';
import { architectureLayers, modulePerformance, impactMetrics, responseTimeData } from '../data/analyticsData';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend);

function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

function LivePulse({ color }) {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: '50%',
      background: color || 'var(--status-safe)',
      display: 'inline-block',
      animation: 'pulse-dot 2s infinite',
      boxShadow: `0 0 8px ${color || 'var(--status-safe)'}`,
    }} />
  );
}

const techStack = [
  { category: 'AI/ML', items: [
    { name: 'IndicBERT', desc: 'Multilingual NLP for scam script classification' },
    { name: 'RawNet3 / AASIST', desc: 'Voice deepfake detection (ASVspoof 2024)' },
    { name: 'EfficientNet-B0', desc: 'Denomination classification (TFLite)' },
    { name: 'YOLOv8-nano', desc: 'Security zone detection on currency notes' },
    { name: 'GraphSAGE / GAT', desc: 'Fraud ring detection via Graph Neural Networks' },
    { name: 'XGBoost + PySAL', desc: 'Geospatial crime hotspot prediction' },
    { name: 'Whisper / IndicWhisper', desc: 'Multi-language ASR for call transcription' },
    { name: 'Pix2Pix GAN', desc: 'UV feature estimation from visible-spectrum images' },
  ]},
  { category: 'Backend', items: [
    { name: 'Apache Kafka', desc: 'Event streaming (100K events/sec)' },
    { name: 'Neo4j', desc: 'Native graph database for fraud networks' },
    { name: 'PostgreSQL + PostGIS', desc: 'Relational + geospatial data' },
    { name: 'Elasticsearch', desc: 'Full-text search & analytics' },
    { name: 'Redis', desc: 'Cache, pub/sub, real-time scoring' },
    { name: 'TimescaleDB', desc: 'Time-series metrics and analytics' },
  ]},
  { category: 'Infrastructure', items: [
    { name: 'Kubernetes', desc: 'Container orchestration + auto-scaling' },
    { name: 'Istio', desc: 'Zero-trust service mesh' },
    { name: 'Prometheus + Grafana', desc: 'Monitoring & observability' },
    { name: 'HashiCorp Vault', desc: 'Secrets management + HSM' },
    { name: 'MLflow + Evidently', desc: 'ML model lifecycle + drift detection' },
    { name: 'Kong API Gateway', desc: 'Rate limiting, auth, routing' },
  ]},
  { category: 'Frontend', items: [
    { name: 'React + Vite', desc: 'Command centre dashboard' },
    { name: 'D3.js', desc: 'Force-directed graph visualisation' },
    { name: 'Chart.js', desc: 'Analytics charts and KPI widgets' },
    { name: 'Leaflet', desc: 'Geospatial map rendering' },
    { name: 'React Native', desc: 'Mobile apps (NoteSure + NagrikShield)' },
    { name: 'WhatsApp Business API', desc: 'Citizen chatbot interface' },
  ]},
];

const securityFeatures = [
  { icon: Lock, name: 'AES-256-GCM', desc: 'Data encrypted at rest with HSM-backed keys' },
  { icon: Shield, name: 'TLS 1.3', desc: 'All communications encrypted in transit' },
  { icon: FileCheck, name: 'Section 65B', desc: 'Evidence packages meet Indian Evidence Act standards' },
  { icon: Eye, name: 'Zero Trust', desc: 'Istio service mesh with mTLS between all services' },
  { icon: GitBranch, name: 'Immutable Audit', desc: 'Cryptographically chained audit trail for evidence' },
  { icon: Globe, name: 'DPDP Act 2023', desc: 'Full compliance with Digital Personal Data Protection Act' },
];

export default function Architecture() {
  const [expandedLayer, setExpandedLayer] = useState(null);
  const [selectedTechCategory, setSelectedTechCategory] = useState('AI/ML');

  const responseTimeChart = {
    data: {
      labels: responseTimeData.labels,
      datasets: [
        {
          label: 'Before (hours)',
          data: responseTimeData.beforeRaksha.map(v => v / 3600),
          backgroundColor: 'rgba(239, 83, 80, 0.5)',
          borderRadius: 4,
          barPercentage: 0.6,
        },
        {
          label: 'After RakshaSutra (seconds)',
          data: responseTimeData.afterRaksha.map(v => v / 60),
          backgroundColor: 'rgba(76, 175, 80, 0.5)',
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, position: 'top', align: 'end',
          labels: { color: '#9ea4b8', font: { family: 'Inter', size: 10 }, boxWidth: 10, padding: 12 },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 20, 40, 0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        },
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#5d6484', font: { family: 'Inter', size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#5d6484', font: { family: 'JetBrains Mono', size: 11 } }, title: { display: true, text: 'Time (hours)', color: '#5d6484', font: { size: 10 } } },
      },
    },
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <Server size={24} style={{ color: 'var(--accent-blue)', marginRight: 8, verticalAlign: 'middle' }} />
            System Architecture
          </h1>
          <p className="page-subtitle">
            Production-grade infrastructure design — 5-layer event-driven microservices architecture
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <LivePulse color="var(--status-safe)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--status-safe)' }}>All Systems Operational</span>
        </div>
      </div>

      {/* Impact KPIs */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Financial Loss Prevented', value: '₹423 Cr', color: 'var(--status-safe)', icon: Shield },
          { label: 'Avg Detection Time', value: '22s', detail: 'vs hours (manual)', color: 'var(--accent-cyan)', icon: Cpu },
          { label: 'States Covered', value: '28', color: 'var(--accent-purple)', icon: Globe },
          { label: 'System Uptime', value: '99.97%', color: 'var(--status-safe)', icon: Radio },
        ].map((item, i) => (
          <div key={i} className="glass-card-static" style={{ textAlign: 'center', padding: '16px' }}>
            <item.icon size={22} style={{ color: item.color, marginBottom: 8 }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>{item.label}</div>
            {item.detail && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.detail}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Architecture Layers */}
        <div className="glass-card-static">
          <h4 style={{ fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={16} style={{ color: 'var(--accent-blue)' }} />
            Architecture Layers
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {architectureLayers.map((layer, i) => (
              <div key={i}>
                <div
                  onClick={() => setExpandedLayer(expandedLayer === i ? null : i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 'var(--radius-md)',
                    background: expandedLayer === i ? `${layer.color}12` : 'var(--bg-tertiary)',
                    border: `1px solid ${expandedLayer === i ? `${layer.color}30` : 'var(--border-subtle)'}`,
                    cursor: 'pointer', transition: 'all 200ms ease',
                  }}
                >
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: layer.color, flexShrink: 0,
                    boxShadow: `0 0 8px ${layer.color}50`,
                  }} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', flex: 1 }}>{layer.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {layer.components.length} components
                  </span>
                  <ArrowRight size={14} style={{
                    color: 'var(--text-muted)', transition: 'transform 200ms',
                    transform: expandedLayer === i ? 'rotate(90deg)' : 'rotate(0)',
                  }} />
                </div>
                {expandedLayer === i && (
                  <div style={{
                    marginTop: 4, marginLeft: 20, padding: '8px 0',
                    borderLeft: `2px solid ${layer.color}30`,
                    paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    {layer.components.map((comp, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                      }}>
                        <LivePulse color={comp.status === 'active' ? 'var(--status-safe)' : 'var(--status-warning)'} />
                        <span style={{ fontWeight: 500, minWidth: 140 }}>{comp.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{comp.tech}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Response Time Impact */}
        <div className="glass-card-static">
          <h4 style={{ fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={16} style={{ color: 'var(--status-safe)' }} />
            Response Time Impact
          </h4>
          <div style={{ height: 200, marginBottom: 12 }}>
            <Bar data={responseTimeChart.data} options={responseTimeChart.options} />
          </div>
          <div style={{
            padding: '10px 14px', background: 'rgba(76, 175, 80, 0.04)',
            borderRadius: 'var(--radius-md)', border: '1px solid rgba(76, 175, 80, 0.1)',
            fontSize: '0.8rem', color: 'var(--text-secondary)',
          }}>
            <strong style={{ color: 'var(--status-safe)' }}>99.7% faster</strong> — From hours of complaint-driven investigation to
            <strong style={{ color: 'var(--accent-cyan)' }}> 22-second real-time detection</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Tech Stack */}
        <div className="glass-card-static">
          <h4 style={{ fontSize: '0.9rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={16} style={{ color: 'var(--accent-purple)' }} />
            Technology Stack
          </h4>
          <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
            {techStack.map(cat => (
              <button
                key={cat.category}
                className={`tab-item ${selectedTechCategory === cat.category ? 'active' : ''}`}
                style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                onClick={() => setSelectedTechCategory(cat.category)}
              >
                {cat.category}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
            {techStack.find(t => t.category === selectedTechCategory)?.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
              }}>
                <CheckCircle size={14} style={{ color: 'var(--status-safe)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="glass-card-static">
          <h4 style={{ fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={16} style={{ color: 'var(--status-danger)' }} />
            Security & Compliance
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {securityFeatures.map((feat, i) => (
              <div key={i} style={{
                padding: '12px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}>
                <feat.icon size={18} style={{ color: 'var(--accent-blue)', marginBottom: 6 }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 2 }}>{feat.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Performance Table */}
      <div className="glass-card-static">
        <h4 style={{ fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={16} style={{ color: 'var(--accent-cyan)' }} />
          Module Performance Benchmarks
        </h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Accuracy</th>
              <th>Latency</th>
              <th>Throughput</th>
              <th>Uptime</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {modulePerformance.map((mod, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{mod.module}</td>
                <td>
                  <span style={{
                    color: mod.accuracy >= 95 ? 'var(--status-safe)' : mod.accuracy >= 90 ? 'var(--status-warning)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                  }}>
                    {mod.accuracy}%
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>
                  {mod.latency < 100 ? `${mod.latency}s` : mod.latency < 1000 ? `${(mod.latency / 1000).toFixed(1)}s` : `${(mod.latency / 1000).toFixed(1)}s`}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>
                  {mod.throughput >= 1000 ? `${(mod.throughput / 1000).toFixed(0)}K/s` : `${mod.throughput}/s`}
                </td>
                <td>
                  <span style={{ color: 'var(--status-safe)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {mod.uptime}%
                  </span>
                </td>
                <td><LivePulse color="var(--status-safe)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
