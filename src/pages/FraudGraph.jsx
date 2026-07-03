import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Network, Filter, FileText, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { fraudNetworkNodes, fraudNetworkEdges, nodeTypeConfig, clusterInfo } from '../data/fraudNetwork';
import StatusBadge from '../components/StatusBadge';

export default function FraudGraph() {
  const svgRef = useRef();
  const containerRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showPackage, setShowPackage] = useState(false);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));

    svg.call(zoom);

    let filteredNodes = filterType === 'all'
      ? [...fraudNetworkNodes]
      : fraudNetworkNodes.filter(n => n.type === filterType || n.cluster === 0);

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    let filteredEdges = fraudNetworkEdges.filter(
      e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );

    const clusterColors = {
      1: '#ef5350',
      2: '#7c4dff',
      3: '#ff9800',
      0: '#78909c',
    };

    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredEdges).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25));

    simulationRef.current = simulation;

    // Edges
    const link = g.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.12)')
      .attr('stroke-width', d => d.type === 'TRANSFERRED' ? 2 : 1)
      .attr('stroke-dasharray', d => d.type === 'ASSOCIATED' ? '4,4' : 'none');

    // Edge labels
    const linkLabels = g.append('g')
      .selectAll('text')
      .data(filteredEdges.filter(e => e.value))
      .join('text')
      .attr('fill', 'rgba(255,255,255,0.25)')
      .attr('font-size', '8px')
      .attr('font-family', 'var(--font-mono)')
      .attr('text-anchor', 'middle')
      .text(d => d.type === 'TRANSFERRED' ? `₹${(d.value/1000).toFixed(0)}K` : d.value);

    // Node groups
    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }))
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Node glow for high-risk
    node.append('circle')
      .attr('r', d => d.riskScore > 0.9 ? 18 : 0)
      .attr('fill', 'none')
      .attr('stroke', d => clusterColors[d.cluster] || '#78909c')
      .attr('stroke-width', 2)
      .attr('opacity', 0.3)
      .style('animation', 'pulse-dot 2s infinite');

    // Node circles
    node.append('circle')
      .attr('r', d => {
        if (d.type === 'person') return 14;
        if (d.type === 'victim' || d.type === 'complaint') return 10;
        return 11;
      })
      .attr('fill', d => `${nodeTypeConfig[d.type]?.color || '#78909c'}30`)
      .attr('stroke', d => nodeTypeConfig[d.type]?.color || '#78909c')
      .attr('stroke-width', 2);

    // Node icons
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '10px')
      .text(d => nodeTypeConfig[d.type]?.icon || '?');

    // Node labels
    node.append('text')
      .attr('dy', 24)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('font-size', '8px')
      .attr('font-family', 'var(--font-mono)')
      .text(d => d.label.length > 16 ? d.label.slice(0, 14) + '…' : d.label);

    svg.on('click', () => setSelectedNode(null));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [filterType]);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <Network size={24} style={{ color: 'var(--accent-purple)', marginRight: 8, verticalAlign: 'middle' }} />
            FraudGraph
          </h1>
          <p className="page-subtitle">
            Graph AI fraud network intelligence — visualise, explore & generate evidence packages
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button className="btn btn-sm btn-secondary" onClick={() => setShowPackage(true)}>
            <FileText size={14} /> Generate Intelligence Package
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, height: 'calc(100vh - 180px)' }}>
        {/* Graph */}
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            {['all', 'person', 'phone', 'account', 'device'].map(t => (
              <button
                key={t}
                className={`tab-item ${filterType === t ? 'active' : ''}`}
                onClick={() => setFilterType(t)}
                style={{ padding: '5px 12px', fontSize: '0.75rem' }}
              >
                {t === 'all' ? 'All Entities' : nodeTypeConfig[t]?.label || t}
              </button>
            ))}
          </div>
          <div ref={containerRef} className="graph-container" style={{ height: 'calc(100% - 44px)' }}>
            <svg ref={svgRef} />
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          {/* Node Detail */}
          {selectedNode ? (
            <div className="glass-card-static animate-fadeInUp">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: '1.5rem' }}>{nodeTypeConfig[selectedNode.type]?.icon}</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>{selectedNode.label}</h4>
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                    {nodeTypeConfig[selectedNode.type]?.label}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="feature-score-row">
                  <span className="feature-score-label">Risk Score</span>
                  <span className="feature-score-value" style={{
                    color: selectedNode.riskScore > 0.8 ? 'var(--status-danger)' :
                           selectedNode.riskScore > 0.5 ? 'var(--status-warning)' : 'var(--status-safe)',
                  }}>
                    {(selectedNode.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
                {selectedNode.role && (
                  <div className="feature-score-row">
                    <span className="feature-score-label">Role</span>
                    <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                      {selectedNode.role.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="feature-score-row">
                  <span className="feature-score-label">Cluster</span>
                  <span className="feature-score-value">
                    {selectedNode.cluster > 0 ? `Ring #${selectedNode.cluster}` : 'Unaffiliated'}
                  </span>
                </div>
                <div className="feature-score-row">
                  <span className="feature-score-label">Connections</span>
                  <span className="feature-score-value">
                    {fraudNetworkEdges.filter(e =>
                      e.source === selectedNode.id || e.target === selectedNode.id ||
                      e.source?.id === selectedNode.id || e.target?.id === selectedNode.id
                    ).length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card-static" style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
              <Network size={32} style={{ opacity: 0.3, marginBottom: 10 }} />
              <p style={{ fontSize: '0.82rem' }}>Click a node to view details</p>
            </div>
          )}

          {/* Legend */}
          <div className="glass-card-static">
            <h4 style={{ fontSize: '0.85rem', marginBottom: 10 }}>Legend</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(nodeTypeConfig).map(([key, config]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: config.color, display: 'inline-block',
                  }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{config.icon} {config.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cluster Info */}
          <div className="glass-card-static">
            <h4 style={{ fontSize: '0.85rem', marginBottom: 10 }}>Detected Fraud Rings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {clusterInfo.map(c => (
                <div key={c.id} style={{
                  padding: '10px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Ring #{c.id}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{c.name}</p>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
                    <span>👤 {c.suspects} suspects</span>
                    <span>🎯 {c.victims} victims</span>
                    <span>💰 {c.estimatedLoss}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Package Modal */}
      {showPackage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowPackage(false)}>
          <div className="glass-card-static" style={{
            maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', width: '90%',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3>📋 Intelligence Package — Ring #1</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowPackage(false)}>✕</button>
            </div>
            <pre style={{
              background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-cyan)',
              overflow: 'auto', border: '1px solid var(--border-subtle)',
              lineHeight: 1.6, whiteSpace: 'pre-wrap',
            }}>
{JSON.stringify({
  package_id: "IP-2026-0001",
  classification: "CONFIDENTIAL",
  generated_at: new Date().toISOString(),
  campaign_summary: {
    name: "Operation VidTrap — Digital Arrest Ring",
    type: "digital_arrest",
    estimated_victims: 247,
    estimated_loss_inr: 42300000,
    jurisdictions: ["MH", "DL", "KA", "TG"],
  },
  suspects: clusterInfo[0].suspects,
  evidence_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb924...",
  section_65b_compliant: true,
}, null, 2)}
            </pre>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-primary">📥 Download Package</button>
              <button className="btn btn-sm btn-secondary">🖨️ Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
