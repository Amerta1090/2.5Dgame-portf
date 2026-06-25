import React, { useMemo } from 'react';
import { COLORS, DiagonalStripes } from '../designSystem';

const ComponentBreadboard = React.memo(function ComponentBreadboard() {
  const components = useMemo(() =>
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div
        key={`component-${i}`}
        style={{
          position: 'absolute',
          left: 180 + i * 26,
          top: 170,
          width: 16,
          height: 12,
          background: [
            '#4040E0', '#E04040', '#40E060', '#E0E040',
            '#E040E0', '#40E0E0', '#E08040', '#80E040', '#4080E0',
          ][i],
          borderRadius: 2,
          opacity: 0.7,
          animation: `pulse ${1.5 + i * 0.3}s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
        } as React.CSSProperties}
      />
    )),
  []);

  return <>{components}</>;
});

export const Zone3IoTWorkshop = React.memo(function Zone3IoTWorkshop() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #081a12 0%, #0a2218 50%, #0d2a1f 100%)',
        }}
      />

      {/* Persona-style circuit grid overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="iot-grid" width={50} height={50} patternUnits="userSpaceOnUse">
            <rect x={0} y={0} width={50} height={50} fill="none" stroke={COLORS.accentGreen} strokeWidth={0.3} />
            <circle cx={25} cy={25} r={3} fill="none" stroke={COLORS.accentGreen} strokeWidth={0.3} opacity={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#iot-grid)" />
      </svg>

      {/* Node connection lines */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <circle
            key={i}
            cx={188 + i * 26}
            cy={176}
            r={10}
            fill="none"
            stroke={COLORS.accentGreen}
            strokeWidth={0.3}
            opacity={0.3}
          />
        ))}
        {/* Connection from breadboard to oscilloscope */}
        <path d="M 450 176 H 500 V 160" fill="none" stroke={COLORS.accentGreen} strokeWidth={0.5} opacity={0.3} />
      </svg>

      <DiagonalStripes color={COLORS.accentGreen} opacity={0.03} width={20} />

      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 200,
          width: 300,
          height: 20,
          background: '#1a1a2a',
          borderTop: '4px solid #2a3a2a',
          borderRadius: '2px 2px 0 0',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 165,
          width: 40,
          height: 30,
          background: '#0a0a12',
          border: '1px solid #2a4a2a',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            right: 4,
            height: 10,
            background: '#00ff88',
            opacity: 0.6,
            borderRadius: 1,
            animation: 'pulse 1.5s ease-in-out infinite',
          } as React.CSSProperties}
        />
      </div>

      <ComponentBreadboard />

      <div
        style={{
          position: 'absolute',
          left: 480,
          top: 120,
          width: 80,
          height: 80,
          border: '2px solid #1a3a2a',
          borderRadius: '50%',
          background: '#050a08',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 4,
            right: 4,
            height: 2,
            background: '#00ff88',
            opacity: 0.5,
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: 4,
            right: 4,
            height: 2,
            background: '#00ff88',
            opacity: 0.3,
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '70%',
            left: 4,
            right: 4,
            height: 2,
            background: '#00ff88',
            opacity: 0.2,
            transform: 'translateY(-50%)',
          }}
        />
      </div>

      {/* Geometric accent */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: '10%',
          width: 40,
          height: 40,
          border: `1px solid ${COLORS.accentGreen}`,
          opacity: 0.06,
          transform: 'rotate(45deg)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #0d2a1f 0%, #081a12 100%)',
          borderTop: '1px solid rgba(0, 255, 136, 0.1)',
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
                rgba(0, 255, 136, 0.03) 60px,
                rgba(0, 255, 136, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
});
