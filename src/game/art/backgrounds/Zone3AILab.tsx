import React, { useMemo } from 'react';
import { COLORS, DiagonalStripes } from '../designSystem';

const NeuralNetwork = React.memo(function NeuralNetwork() {
  const connections = useMemo(() => {
    const lines: React.ReactNode[] = [];
    for (let layer = 0; layer < 3; layer++) {
      for (let fromNode = 0; fromNode < 4; fromNode++) {
        for (let toNode = 0; toNode < 4; toNode++) {
          lines.push(
            <line
              key={`l-${layer}-${fromNode}-${toNode}`}
              x1={40 + layer * 100}
              y1={40 + fromNode * 40}
              x2={40 + (layer + 1) * 100}
              y2={40 + toNode * 40}
              stroke={`rgba(64, 128, 224, ${Math.random() * 0.1 + 0.05})`}
              strokeWidth={0.5}
            />
          );
        }
      }
    }
    return lines;
  }, []);

  const nodes = useMemo(() => {
    const items: React.ReactNode[] = [];
    for (let layer = 0; layer < 3; layer++) {
      for (let node = 0; node < 4; node++) {
        items.push(
          <circle
            key={`n-${layer}-${node}`}
            cx={40 + layer * 100}
            cy={40 + node * 40}
            r={6}
            fill="none"
            stroke={`rgba(64, 128, 224, ${0.3 + layer * 0.15})`}
            strokeWidth={1.5}
          />
        );
      }
    }
    return items;
  }, []);

  return (
    <svg style={{ position: 'absolute', left: 350, top: 40, width: 300, height: 200 }} viewBox="0 0 300 200">
      {connections}
      {nodes}
    </svg>
  );
});

export const Zone3AILab = React.memo(function Zone3AILab() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1530 50%, #101a3a 100%)',
        }}
      />

      {/* Persona-style tech grid overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="ailab-grid" width={40} height={40} patternUnits="userSpaceOnUse">
            <circle cx={20} cy={20} r={2} fill={COLORS.info} opacity={0.3} />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={COLORS.info} strokeWidth={0.3} opacity={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ailab-grid)" />
      </svg>

      {/* Circuit-like decorative path */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}
      >
        <path d="M 0 160 H 200 V 100 H 400 V 50 H 600" fill="none" stroke={COLORS.accentCyan} strokeWidth={1} />
        <path d="M 0 180 H 150 V 120 H 350 V 70 H 600" fill="none" stroke={COLORS.info} strokeWidth={0.5} opacity={0.5} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={100 + i * 100} cy={160} r={2} fill={COLORS.accentCyan} opacity={0.4} />
        ))}
      </svg>

      <DiagonalStripes color={COLORS.info} opacity={0.03} width={25} />

      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 60,
          width: 180,
          height: 120,
          background: 'linear-gradient(180deg, #0d1530, #1a2a5a)',
          border: '1px solid rgba(64, 128, 224, 0.3)',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '8px 8px 30px 8px',
            background: '#050a15',
            borderRadius: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: 4,
              right: 4,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #4080E0, transparent)',
              animation: 'pulse 2s ease-in-out infinite',
            } as React.CSSProperties}
          />
        </div>
      </div>

      <NeuralNetwork />

      {/* Geometric accent */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          right: '5%',
          width: 60,
          height: 60,
          border: `1px solid ${COLORS.accentCyan}`,
          opacity: 0.08,
          transform: 'rotate(30deg)',
          borderRadius: 4,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #101a3a 0%, #0a0f1a 100%)',
          borderTop: '1px solid rgba(64, 128, 224, 0.1)',
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
                rgba(64, 128, 224, 0.03) 60px,
                rgba(64, 128, 224, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
});
