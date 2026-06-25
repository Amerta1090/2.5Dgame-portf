import React, { useMemo } from 'react';
import { COLORS, DiagonalStripes, GeometricDivider } from '../designSystem';

const BLINK = {
  animation: 'pulse 1.5s ease-in-out infinite',
};

function ServerRackFar({ index }: { index: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 200 + index * 350,
        bottom: 80,
        width: 80,
        height: 350,
        background: 'linear-gradient(180deg, #0d0d1a 0%, #111128 100%)',
        border: '1px solid rgba(0, 255, 255, 0.08)',
        borderRadius: 2,
        opacity: 0.6,
      }}
    >
      {[0, 1, 2, 3, 4].map((s) => (
        <div
          key={`shelf-far-${s}`}
          style={{
            position: 'absolute',
            top: 30 + s * 65,
            left: 4, right: 4,
            height: 1,
            background: 'rgba(0, 255, 255, 0.05)',
          }}
        />
      ))}
    </div>
  );
}

function ServerRackMid({ index }: { index: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 100 + index * 400,
        bottom: 80,
        width: 100,
        height: 420,
        background: 'linear-gradient(180deg, #111128 0%, #151530 100%)',
        border: '1px solid rgba(0, 255, 255, 0.15)',
        borderRadius: 2,
        zIndex: 1,
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <div
          key={`shelf-${s}`}
          style={{
            position: 'absolute',
            top: 25 + s * 65,
            left: 4, right: 4,
            height: 1,
            background: 'rgba(0, 255, 255, 0.1)',
          }}
        />
      ))}
      {[0, 1, 2].map((l) => (
        <div
          key={`led-${l}`}
          style={{
            position: 'absolute',
            top: 10 + l * 30,
            right: 8,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 4px #00ff88',
            ...BLINK,
            animationDelay: `${l * 0.5}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export const Zone1Background = React.memo(function Zone1Background() {
  const farRacks = useMemo(() =>
    [0, 1, 2, 3, 4].map((i) => <ServerRackFar key={`rack-far-${i}`} index={i} />),
  []);

  const midRacks = useMemo(() =>
    [0, 1, 2, 3].map((i) => <ServerRackMid key={`rack-mid-${i}`} index={i} />),
  []);

  const conduits = useMemo(() =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <div
        key={`conduit-${i}`}
        style={{
          position: 'absolute',
          top: 30,
          left: 100 + i * 250,
          width: 2,
          height: 20,
          background: '#2a2a4a',
        }}
      />
    )),
  []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Far layer - atmospheric gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #0a0a12 0%, #0d0d1a 30%, #0f0f22 60%, #111128 100%)',
        }}
      />

      {/* Persona-style geometric grid overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="zone1-grid" width={60} height={60} patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={COLORS.primary} strokeWidth={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zone1-grid)" />
      </svg>

      {/* Diagonal stripe overlay */}
      <DiagonalStripes color={COLORS.primary} opacity={0.03} width={30} />

      {farRacks}
      {midRacks}

      {/* Cable conduits on ceiling */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          height: 3,
          background: '#1a1a3a',
        }}
      />
      {conduits}

      {/* Persona-style geometric accent bar */}
      <GeometricDivider color={COLORS.primary} thickness={1} slant />
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: '10%',
          width: 120,
          height: 3,
          background: COLORS.primary,
          opacity: 0.08,
          transform: 'skewX(-20deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: '5%',
          width: 80,
          height: 2,
          background: COLORS.accentCyan,
          opacity: 0.06,
          transform: 'skewX(15deg)',
        }}
      />

      {/* Floor */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #151528 0%, #0d0d1a 100%)',
          borderTop: '1px solid rgba(0, 255, 255, 0.2)',
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
                rgba(0, 255, 255, 0.03) 60px,
                rgba(0, 255, 255, 0.03) 61px
              )
            `,
          }}
        />
        {/* Floor accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.15), transparent)',
          }}
        />
      </div>
    </div>
  );
});
