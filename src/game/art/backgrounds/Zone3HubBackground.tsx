import React, { useMemo } from 'react';
import { COLORS, DiagonalStripes } from '../designSystem';

const SubroomDoor = React.memo(function SubroomDoor({
  x,
  label,
  color,
}: {
  x: number;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 180,
        width: 120,
        height: 200,
        border: `2px solid ${color}`,
        borderRadius: '60px 60px 0 0',
        opacity: 0.8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 20,
      }}
    >
      {/* Geometric inner shape */}
      <div
        style={{
          width: 40,
          height: 60,
          border: `1px solid ${color}`,
          opacity: 0.3,
          borderRadius: '20px 20px 0 0',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: -24,
          left: '50%',
          transform: 'translateX(-50%)',
          color,
          fontFamily: "'Impact', sans-serif",
          fontSize: 11,
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
});

export const Zone3HubBackground = React.memo(function Zone3HubBackground() {
  const panels = useMemo(() =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <div
        key={`panel-${i}`}
        style={{
          position: 'absolute',
          left: 80 + i * 600,
          top: 40,
          width: 300,
          height: 500,
          border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: 4,
        }}
      />
    )),
  []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #0f1115 0%, #151820 50%, #1a1e2a 100%)',
        }}
      />

      {/* Persona-style circuit/hex pattern overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="zone3-hex" width={80} height={138.56} patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 80 23.09 L 80 69.28 L 40 92.37 L 0 69.28 L 0 23.09 Z" fill="none" stroke={COLORS.info} strokeWidth={0.5} />
            <path d="M 40 138.56 L 80 115.47 L 80 69.28" fill="none" stroke={COLORS.info} strokeWidth={0.3} opacity={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zone3-hex)" />
      </svg>

      {/* Circuit-like decorative lines */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}
      >
        <line x1="0" y1="120" x2="100%" y2="120" stroke={COLORS.accentCyan} strokeWidth={0.5} />
        <line x1="0" y1="140" x2="100%" y2="140" stroke={COLORS.info} strokeWidth={0.3} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx={200 + i * 600} cy={130} r={3} fill={COLORS.primary} opacity={0.3} />
        ))}
      </svg>

      <DiagonalStripes color={COLORS.accentCyan} opacity={0.02} width={35} />
      {panels}

      <SubroomDoor x={200} label="AI LAB" color={COLORS.info} />
      <SubroomDoor x={600} label="WEB STUDIO" color={COLORS.accentOrange} />
      <SubroomDoor x={1000} label="IOT WORKSHOP" color={COLORS.accentGreen} />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #1a1e2a 0%, #0f1115 100%)',
          borderTop: '1px solid rgba(100, 200, 255, 0.05)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 60px,
                rgba(100, 200, 255, 0.04) 60px,
                rgba(100, 200, 255, 0.04) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
});
