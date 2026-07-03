import { useState, useEffect, useRef } from 'react';
import { MapPin, Filter, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { crimeEvents, crimeTypeConfig, stateStats } from '../data/crimeEvents';

export default function CrimeMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const leafletRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersRef = useRef(null);
  const [selectedTypes, setSelectedTypes] = useState(Object.keys(crimeTypeConfig));
  const [mapReady, setMapReady] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [timeRange, setTimeRange] = useState(90);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      // leaflet.heat attaches itself to window.L
      await import('leaflet.heat');

      const leaflet = L.default || L;
      leafletRef.current = leaflet;

      if (!mapRef.current) return;

      const map = leaflet.map(mapRef.current, {
        center: [22.5, 79],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
      }).addTo(map);

      leaflet.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !leafletRef.current) return;

    const L = leafletRef.current;
    const map = mapInstanceRef.current;

    // Remove existing layers
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }
    if (markersRef.current) {
      markersRef.current.forEach(m => map.removeLayer(m));
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);

    const filtered = crimeEvents.filter(e =>
      selectedTypes.includes(e.type) &&
      new Date(e.date) >= cutoffDate
    );

    // Heatmap
    const heatData = filtered.map(e => [e.lat, e.lng, e.severity * 0.3]);
    try {
      if (typeof L.heatLayer === 'function') {
        heatLayerRef.current = L.heatLayer(heatData, {
          radius: 25,
          blur: 20,
          maxZoom: 10,
          gradient: {
            0.2: '#4a90d9',
            0.4: '#26c6da',
            0.6: '#ffc107',
            0.8: '#ff9800',
            1.0: '#ef5350',
          },
        }).addTo(map);
      }
    } catch (e) {
      // fallback: just show markers
    }

    // Markers for high-severity events
    const markers = [];
    filtered.filter(e => e.severity >= 4).forEach(e => {
      const config = crimeTypeConfig[e.type];
      const marker = L.circleMarker([e.lat, e.lng], {
        radius: 6,
        fillColor: config?.color || '#fff',
        color: config?.color || '#fff',
        weight: 1,
        fillOpacity: 0.7,
      }).addTo(map);

      marker.on('click', () => setSelectedEvent(e));
      marker.bindTooltip(
        `<div style="font-size:12px"><b>${config?.icon} ${config?.label}</b><br/>${e.city}, ${e.state}<br/>₹${(e.lossAmount/100000).toFixed(1)}L loss</div>`,
        { className: 'custom-tooltip' }
      );
      markers.push(marker);
    });
    markersRef.current = markers;

  }, [mapReady, selectedTypes, timeRange]);

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredEvents = crimeEvents.filter(e => selectedTypes.includes(e.type));
  const totalLoss = filteredEvents.reduce((sum, e) => sum + e.lossAmount, 0);

  return (
    <div className="animate-fadeIn" style={{ height: 'calc(100vh - var(--topbar-height) - 48px)' }}>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-header-left">
          <h1>
            <MapPin size={24} style={{ color: 'var(--accent-cyan)', marginRight: 8, verticalAlign: 'middle' }} />
            CrimeMap
          </h1>
          <p className="page-subtitle">
            Geospatial crime pattern intelligence — real-time hotspot analysis & patrol optimisation
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, height: 'calc(100% - 70px)' }}>
        {/* Map */}
        <div style={{ position: 'relative' }}>
          <div ref={mapRef} className="map-container" style={{ height: '100%' }} />

          {/* Map overlay controls */}
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 500,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {/* Filter pills */}
            <div className="glass-card-static" style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Filter size={12} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>CRIME TYPE FILTER</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {Object.entries(crimeTypeConfig).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${selectedTypes.includes(type) ? config.color : 'var(--border-subtle)'}`,
                      background: selectedTypes.includes(type) ? `${config.color}20` : 'transparent',
                      color: selectedTypes.includes(type) ? config.color : 'var(--text-muted)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-primary)',
                      transition: 'all 150ms',
                    }}
                  >
                    {config.icon} {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="glass-card-static" style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>TIME RANGE</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[7, 30, 60, 90].map(d => (
                  <button
                    key={d}
                    className={`tab-item ${timeRange === d ? 'active' : ''}`}
                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                    onClick={() => setTimeRange(d)}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KPI overlay bottom */}
          <div style={{
            position: 'absolute', bottom: 12, left: 12, right: 60, zIndex: 500,
            display: 'flex', gap: 8,
          }}>
            {[
              { label: 'Total Events', value: filteredEvents.length, color: 'var(--accent-blue)' },
              { label: 'Total Loss', value: `₹${(totalLoss / 10000000).toFixed(1)} Cr`, color: 'var(--status-danger)' },
              { label: 'Hotspots', value: '28', color: 'var(--status-warning)' },
              { label: 'States Affected', value: '8', color: 'var(--accent-purple)' },
            ].map((kpi, i) => (
              <div key={i} className="glass-card-static" style={{ padding: '8px 14px', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {/* Selected Event */}
          {selectedEvent && (
            <div className="glass-card-static animate-fadeInUp">
              <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>📍 Event Details</h4>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="feature-score-row">
                  <span className="feature-score-label">Type</span>
                  <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                    {crimeTypeConfig[selectedEvent.type]?.label}
                  </span>
                </div>
                <div className="feature-score-row">
                  <span className="feature-score-label">Location</span>
                  <span className="feature-score-value">{selectedEvent.city}, {selectedEvent.state}</span>
                </div>
                <div className="feature-score-row">
                  <span className="feature-score-label">Loss</span>
                  <span className="feature-score-value" style={{ color: 'var(--status-danger)' }}>
                    ₹{(selectedEvent.lossAmount / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="feature-score-row">
                  <span className="feature-score-label">Severity</span>
                  <span className="feature-score-value">{selectedEvent.severity}/5</span>
                </div>
                <div className="feature-score-row">
                  <span className="feature-score-label">Date</span>
                  <span className="feature-score-value">{selectedEvent.date}</span>
                </div>
              </div>
            </div>
          )}

          {/* State Rankings */}
          <div className="glass-card-static">
            <h4 style={{ fontSize: '0.85rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={14} style={{ color: 'var(--accent-blue)' }} />
              Top States by Cases
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {stateStats.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                  background: i < 3 ? 'rgba(239, 83, 80, 0.04)' : 'transparent',
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: 'var(--radius-sm)',
                    background: i < 3 ? 'var(--status-danger-bg)' : 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                    color: i < 3 ? 'var(--status-danger)' : 'var(--text-muted)',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 500 }}>{s.state}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {s.cases}
                  </span>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 600,
                    color: s.trend.startsWith('+') ? 'var(--status-danger)' : 'var(--status-safe)',
                  }}>
                    {s.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Legend */}
          <div className="glass-card-static">
            <h4 style={{ fontSize: '0.85rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={14} /> Heatmap Intensity
            </h4>
            <div style={{
              height: 12, borderRadius: 'var(--radius-full)', marginBottom: 6,
              background: 'linear-gradient(90deg, #4a90d9, #26c6da, #ffc107, #ff9800, #ef5350)',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for leaflet tooltips */}
      <style>{`
        .custom-tooltip {
          background: var(--bg-secondary) !important;
          border: 1px solid var(--border-glass) !important;
          color: var(--text-primary) !important;
          border-radius: var(--radius-md) !important;
          box-shadow: var(--shadow-lg) !important;
          font-family: var(--font-primary) !important;
        }
        .custom-tooltip .leaflet-tooltip-tip {
          display: none;
        }
        .leaflet-control-zoom a {
          background: var(--bg-secondary) !important;
          color: var(--text-primary) !important;
          border-color: var(--border-subtle) !important;
        }
      `}</style>
    </div>
  );
}
