import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, Banknote, Network, MapPin, MessageCircleWarning,
  TrendingUp, AlertTriangle, Users, Zap, Eye, Activity,
  BarChart3, Target, Shield, ArrowRight, Clock, Radio, Layers
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { liveAlerts } from '../data/scamSessions';
import {
  threatCategoryData, weeklyTrends, impactMetrics,
  monthlyTrend, fusionCorrelations
} from '../data/analyticsData';
import StatusBadge from '../components/StatusBadge';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 20, 40, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleFont: { family: 'Inter', weight: '600' },
      bodyFont: { family: 'JetBrains Mono', size: 12 },
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
      ticks: { color: '#5d6484', font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
      ticks: { color: '#5d6484', font: { family: 'JetBrains Mono', size: 11 } },
    },
  },
};

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

function DataPipelineViz() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { label: 'Ingest', icon: '📡', color: '#42a5f5' },
    { label: 'Process', icon: '⚙️', color: '#7c4dff' },
    { label: 'Classify', icon: '🧠', color: '#26c6da' },
    { label: 'Correlate', icon: '🔗', color: '#ff9800' },
    { label: 'Alert', icon: '🚨', color: '#ef5350' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(p => (p + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '10px 16px', background: 'var(--bg-glass)',
      borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)',
    }}>
      <Activity size={14} style={{ color: 'var(--accent-cyan)', marginRight: 4 }} />
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: 8 }}>PIPELINE</span>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: i === activeStep ? `${step.color}25` : 'transparent',
            border: `2px solid ${i <= activeStep ? step.color : 'var(--border-subtle)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', transition: 'all 400ms ease',
            boxShadow: i === activeStep ? `0 0 12px ${step.color}40` : 'none',
            transform: i === activeStep ? 'scale(1.15)' : 'scale(1)',
          }}>
            {step.icon}
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 24, height: 2,
              background: i < activeStep
                ? `linear-gradient(90deg, ${steps[i].color}, ${steps[i + 1].color})`
                : 'var(--border-subtle)',
              transition: 'background 400ms ease',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

const kpis = [
  { icon: ShieldAlert, label: 'Scams Blocked', value: 12847, trend: '+342 today', trendDir: 'up', accent: 'var(--status-danger)', bg: 'var(--status-danger-bg)' },
  { icon: Banknote, label: 'FICN Detected', value: 3421, trend: '+23 today', trendDir: 'up', accent: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
  { icon: Network, label: 'Fraud Rings Disrupted', value: 156, trend: '+8 this week', trendDir: 'up', accent: 'var(--accent-purple)', bg: 'rgba(124, 77, 255, 0.12)' },
  { icon: Users, label: 'Citizens Protected', value: 47832, trend: '+1,847 today', trendDir: 'up', accent: 'var(--accent-cyan)', bg: 'rgba(38, 198, 218, 0.12)' },
  { icon: Clock, label: 'Avg Detection Time', value: 22, trend: '99.7% faster', suffix: 's', trendDir: 'up', accent: 'var(--status-safe)', bg: 'var(--status-safe-bg)' },
];

const moduleCards = [
  { to: '/scam-sentinel', icon: ShieldAlert, title: 'Scam Sentinel', desc: 'Real-time digital arrest scam detection with AI call analysis, spoofing detection, and automated MHA alerting.', stats: '7 active • 342 blocked today', color: 'var(--status-danger)' },
  { to: '/notesure', icon: Banknote, title: 'NoteSure', desc: 'Computer vision counterfeit detection with microprint analysis, security thread verification, and serial validation.', stats: '23 FICN detected • 98.2% accuracy', color: 'var(--status-warning)' },
  { to: '/fraudgraph', icon: Network, title: 'FraudGraph', desc: 'Graph AI network intelligence with community detection, money mule identification, and evidence packages.', stats: '156 networks • 3 active rings', color: 'var(--accent-purple)' },
  { to: '/crimemap', icon: MapPin, title: 'CrimeMap', desc: 'Geospatial crime intelligence with predictive hotspots, patrol optimisation, and command dashboards.', stats: '28 hotspots • 8 states', color: 'var(--accent-cyan)' },
  { to: '/nagrikshield', icon: MessageCircleWarning, title: 'NagrikShield', desc: 'Citizen fraud shield with real-time risk assessment, guided NCRB reporting, and 12-language support.', stats: '1,847 queries • 12 languages', color: 'var(--status-safe)' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [visibleAlerts, setVisibleAlerts] = useState(liveAlerts.slice(0, 5));
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleAlerts(prev => {
        const newAlert = { ...liveAlerts[Math.floor(Math.random() * liveAlerts.length)], id: Date.now(), time: 'Just now' };
        return [newAlert, ...prev.slice(0, 6)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const blockRateChart = {
    data: {
      labels: monthlyTrend.labels,
      datasets: [
        {
          label: 'Total Scam Cases',
          data: monthlyTrend.scamCases,
          borderColor: '#ef5350',
          backgroundColor: 'rgba(239, 83, 80, 0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#ef5350',
        },
        {
          label: 'Blocked by RakshaSutra',
          data: monthlyTrend.blocked,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#4caf50',
        },
      ],
    },
    options: {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { color: '#9ea4b8', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 },
        },
      },
    },
  };

  const threatDonut = {
    data: {
      labels: threatCategoryData.labels,
      datasets: [{
        data: threatCategoryData.values,
        backgroundColor: threatCategoryData.colors,
        borderWidth: 0,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: { color: '#9ea4b8', font: { family: 'Inter', size: 10 }, boxWidth: 10, padding: 8 },
        },
        tooltip: chartDefaults.plugins.tooltip,
      },
    },
  };

  const weeklyBar = {
    data: {
      labels: weeklyTrends.labels,
      datasets: [
        {
          label: 'Scam Detections',
          data: weeklyTrends.scamDetections,
          backgroundColor: 'rgba(239, 83, 80, 0.6)',
          borderRadius: 4,
          barPercentage: 0.6,
        },
        {
          label: 'FICN Detections',
          data: weeklyTrends.ficnDetections,
          backgroundColor: 'rgba(255, 152, 0, 0.6)',
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ],
    },
    options: {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { color: '#9ea4b8', font: { family: 'Inter', size: 10 }, boxWidth: 10, padding: 12 },
        },
      },
    },
  };

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1><span className="text-gradient">Command Centre</span></h1>
          <p className="page-subtitle">National Digital Public Safety Intelligence — Real-time Overview</p>
        </div>
        <div className="flex items-center gap-md">
          <DataPipelineViz />
          <StatusBadge status="ACTIVE" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-5" style={{ marginBottom: 24 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card" style={{ '--kpi-accent': kpi.accent, '--kpi-bg': kpi.bg }}>
            <div className="kpi-card-header">
              <div className="kpi-card-icon"><kpi.icon size={20} /></div>
              <span className={`kpi-card-trend ${kpi.trendDir === 'up' ? 'up' : 'down'}`}>
                <TrendingUp size={12} style={{ marginRight: 3 }} />{kpi.trend}
              </span>
            </div>
            <div className="kpi-card-value">
              <AnimatedCounter target={kpi.value} />{kpi.suffix && <span style={{ fontSize: '1rem', marginLeft: 2 }}>{kpi.suffix}</span>}
            </div>
            <div className="kpi-card-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="tabs" style={{ marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'fusion', label: 'Intelligence Fusion', icon: Layers },
          { id: 'modules', label: 'Modules', icon: Shield },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <tab.icon size={14} />{tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="animate-fadeIn" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 20 }}>
          {/* Scam Blocking Trend */}
          <div className="glass-card-static">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={16} style={{ color: 'var(--accent-blue)' }} />Scam Detection vs Blocking
              </h4>
              <span className="badge badge-safe" style={{ fontSize: '0.6rem' }}>94% Block Rate</span>
            </div>
            <div style={{ height: 220 }}>
              <Line data={blockRateChart.data} options={blockRateChart.options} />
            </div>
          </div>

          {/* Threat Category Distribution */}
          <div className="glass-card-static">
            <h4 style={{ fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={16} style={{ color: 'var(--accent-purple)' }} />Threat Distribution
            </h4>
            <div style={{ height: 220 }}>
              <Doughnut data={threatDonut.data} options={threatDonut.options} />
            </div>
          </div>

          {/* Live Alert Feed */}
          <div>
            <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
              <AlertTriangle size={16} style={{ color: 'var(--status-danger)' }} />
              Live Threat Feed
              <span style={{
                marginLeft: 'auto', width: 8, height: 8,
                background: 'var(--status-danger)', borderRadius: '50%',
                animation: 'pulse-dot 1.5s infinite',
              }} />
            </h4>
            <div className="alert-feed" style={{ maxHeight: 260 }}>
              {visibleAlerts.map(alert => (
                <div key={alert.id} className="alert-item">
                  <div className={`alert-severity ${alert.severity}`} />
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-desc">{alert.desc}</div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.58rem', marginTop: 4, display: 'inline-flex' }}>{alert.module}</span>
                  </div>
                  <span className="alert-time">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Detections Bar Chart (full width) */}
          <div className="glass-card-static" style={{ gridColumn: '1 / -1' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} style={{ color: 'var(--status-warning)' }} />Weekly Detection Activity
            </h4>
            <div style={{ height: 180 }}>
              <Bar data={weeklyBar.data} options={weeklyBar.options} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fusion' && (
        <div className="animate-fadeIn">
          {/* Intelligence Fusion Engine */}
          <div className="glass-card-static" style={{
            marginBottom: 20, padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.06), rgba(38, 198, 218, 0.06))',
            borderColor: 'rgba(124, 77, 255, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Layers size={20} style={{ color: 'var(--accent-purple)' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Intelligence Fusion Engine</h3>
              <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>Cross-module Correlation</span>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
              The central nervous system of RakshaSutra — correlating signals across all 5 modules in real-time
              to detect complex, multi-vector threats that no single module could catch alone.
            </p>
          </div>

          {/* Fusion Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {fusionCorrelations.map((fc, i) => (
              <div key={fc.id} className="glass-card" style={{
                borderLeft: `3px solid ${fc.severity === 'critical' ? 'var(--status-danger)' : fc.severity === 'high' ? 'var(--status-warning)' : 'var(--accent-blue)'}`,
                cursor: 'default',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: fc.severity === 'critical' ? 'var(--status-danger)' : fc.severity === 'high' ? 'var(--status-warning)' : 'var(--accent-blue)',
                      animation: fc.severity === 'critical' ? 'pulse-dot 1.5s infinite' : 'none',
                    }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fc.id}</span>
                    {fc.modules.map((mod, j) => (
                      <span key={j} className="badge badge-neutral" style={{ fontSize: '0.58rem' }}>{mod}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{fc.timestamp}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 10, alignItems: 'center' }}>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>TRIGGER</div>
                    {fc.trigger}
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--accent-purple)' }} />
                  <div style={{ padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>CORRELATION</div>
                    {fc.correlation}
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--status-safe)' }} />
                  <div style={{ padding: '8px 12px', background: 'rgba(76, 175, 80, 0.04)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', border: '1px solid rgba(76, 175, 80, 0.1)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--status-safe)', marginBottom: 4, fontWeight: 600 }}>ACTION</div>
                    {fc.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {moduleCards.map((mod, i) => (
            <div
              key={i}
              className="glass-card"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
              onClick={() => navigate(mod.to)}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 'var(--radius-md)',
                background: `${mod.color}18`, border: `1px solid ${mod.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: mod.color, flexShrink: 0,
              }}>
                <mod.icon size={24} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <h4 style={{ fontSize: '1rem' }}>{mod.title}</h4>
                  <span style={{ fontSize: '0.72rem', color: mod.color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mod.stats}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{mod.desc}</p>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
