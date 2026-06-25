import React, { useMemo } from 'react';
import { COLORS, HalftonePattern } from '../designSystem';

const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 60,
  size: 1 + Math.random() * 2,
  delay: Math.random() * 3,
  opacity: 0.3 + Math.random() * 0.7,
}));

const ZONE_ICONS = [
  { label: 'Spawn', angle: 0 },
  { label: 'Academy', angle: 60 },
  { label: 'Workshop', angle: 120 },
  { label: 'Projects', angle: 180 },
  { label: 'Career', angle: 240 },
  { label: 'Final', angle: 300 },
];

const Star = React.memo(function Star({ star }: { star: typeof STARS[0] }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${star.left}%`,
        top: `${star.top}%`,
        width: star.size,
        height: star.size,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity * 0.5})`,
        opacity: star.opacity,
        animation: `pulse ${2 + star.delay}s ease-in-out infinite`,
        animationDelay: `${star.delay}s`,
      } as React.CSSProperties}
    />
  );
});

const ZoneIcon = React.memo(function ZoneIcon({ zone }: { zone: typeof ZONE_ICONS[0] }) {
  const rad = (zone.angle * Math.PI) / 180;
  const cx = 50 + 32 * Math.cos(rad);
  const cy = 50 + 32 * Math.sin(rad);
  return (
    <div
      style={{
        position: 'absolute',
        left: `${cx}%`,
        top: `${cy}%`,
        transform: 'translate(-50%, -50%)',
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'rgba(240, 224, 64, 0.12)',
        border: `1px solid ${COLORS.primary}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 6,
        color: 'rgba(240, 224, 64, 0.6)',
        animation: 'pulse 3s ease-in-out infinite',
        animationDelay: `${zone.angle * 0.05}s`,
      } as React.CSSProperties}
    >
      {zone.label[0]}
    </div>
  );
});

export const Zone6Background = React.memo(function Zone6Background() {
  const starElements = useMemo(() =>
    STARS.map((star) => <Star key={star.id} star={star} />),
  []);

  const iconElements = useMemo(() =>
    ZONE_ICONS.map((zone) => <ZoneIcon key={zone.label} zone={zone} />),
  []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, #1a1510 0%, #0f0a08 100%)',
        }}
      />

      {/* Constellation lines */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none' }}
      >
        {ZONE_ICONS.map((zone) => {
          const rad = (zone.angle * Math.PI) / 180;
          const cx = (50 + 32 * Math.cos(rad)) + '%';
          const cy = (50 + 32 * Math.sin(rad)) + '%';
          const nextRad = ((zone.angle + 60) * Math.PI) / 180;
          const nx = (50 + 32 * Math.cos(nextRad)) + '%';
          const ny = (50 + 32 * Math.sin(nextRad)) + '%';
          return (
            <line
              key={zone.label}
              x1={cx}
              y1={cy}
              x2={nx}
              y2={ny}
              stroke={COLORS.primary}
              strokeWidth={0.5}
              opacity={0.3}
            />
          );
        })}
        {/* Center to each icon */}
        {ZONE_ICONS.map((zone) => {
          const rad = (zone.angle * Math.PI) / 180;
          const cx = (50 + 32 * Math.cos(rad)) + '%';
          const cy = (50 + 32 * Math.sin(rad)) + '%';
          return (
            <line
              key={`center-${zone.label}`}
              x1="50%"
              y1="50%"
              x2={cx}
              y2={cy}
              stroke={COLORS.primary}
              strokeWidth={0.3}
              opacity={0.15}
            />
          );
        })}
        {/* Outer ring */}
        <circle cx="50%" cy="50%" r="32%" fill="none" stroke={COLORS.primary} strokeWidth={0.3} opacity={0.08} />
      </svg>

      <HalftonePattern color={COLORS.primary} opacity={0.02} size={8} />

      {starElements}

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          borderRadius: '50%',
          border: '1px solid rgba(240, 224, 64, 0.05)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          border: '1px solid rgba(240, 224, 64, 0.04)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          border: '1px solid rgba(240, 224, 64, 0.03)',
        }}
      />

      {iconElements}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'radial-gradient(ellipse at center, #1a1510 0%, #0f0a08 100%)',
          borderTop: '1px solid rgba(240, 224, 64, 0.08)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(240, 224, 64, 0.15), transparent)',
          }}
        />
      </div>
    </div>
  );
});
