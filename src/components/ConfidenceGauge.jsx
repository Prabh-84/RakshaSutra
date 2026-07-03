import { useEffect, useState } from 'react';

export default function ConfidenceGauge({ value, size = 120, label, colorOverride }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = () => {
    if (colorOverride) return colorOverride;
    if (animatedValue >= 80) return 'var(--status-danger)';
    if (animatedValue >= 50) return 'var(--status-warning)';
    return 'var(--status-safe)';
  };

  const getGlow = () => {
    if (animatedValue >= 80) return 'var(--status-danger-glow)';
    if (animatedValue >= 50) return 'var(--status-warning-glow)';
    return 'var(--status-safe-glow)';
  };

  return (
    <div className="gauge-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${getGlow()})`,
          }}
        />
        {/* Value text */}
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--text-primary)"
          fontSize={size * 0.22}
          fontWeight="800"
          fontFamily="var(--font-mono)"
        >
          {Math.round(animatedValue)}%
        </text>
        {label && (
          <text
            x={size / 2}
            y={size / 2 + size * 0.16}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-secondary)"
            fontSize={size * 0.09}
            fontWeight="500"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}
