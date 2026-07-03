export default function StatusBadge({ status }) {
  const config = {
    SCAM_DETECTED: { className: 'badge-danger', label: '🔴 SCAM DETECTED', dot: true },
    SUSPICIOUS: { className: 'badge-warning', label: '🟡 SUSPICIOUS', dot: true },
    LEGITIMATE: { className: 'badge-safe', label: '🟢 LEGITIMATE', dot: false },
    BLOCKED: { className: 'badge-danger', label: 'BLOCKED', dot: false },
    ACTIVE: { className: 'badge-danger', label: '● ACTIVE', dot: true },
    MONITORING: { className: 'badge-warning', label: 'MONITORING', dot: false },
    CLEARED: { className: 'badge-safe', label: 'CLEARED', dot: false },
    GENUINE: { className: 'badge-safe', label: '✅ GENUINE', dot: false },
    COUNTERFEIT: { className: 'badge-danger', label: '❌ COUNTERFEIT', dot: false },
    UNDER_INVESTIGATION: { className: 'badge-warning', label: 'INVESTIGATING', dot: false },
    PARTIALLY_DISRUPTED: { className: 'badge-info', label: 'DISRUPTED', dot: false },
  };

  const { className, label } = config[status] || { className: 'badge-neutral', label: status };

  return (
    <span className={`badge ${className}`}>
      {label}
    </span>
  );
}
