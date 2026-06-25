import React from 'react';
import { COLORS, DiagonalStripes } from '../designSystem';

const CodeLines = React.memo(function CodeLines({ lines, color }: { lines: number; color: string }) {
  return (
    <div
      style={{
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          style={{
            height: 2,
            width: `${30 + Math.random() * 40}%`,
            background: color,
            opacity: 0.2 + i * 0.08,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
});

const Monitor = React.memo(function Monitor({
  x,
  y,
  width,
  height,
  rotate = 0,
  lineCount = 5,
  highlightLine = -1,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  lineCount?: number;
  highlightLine?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        background: '#0a0a0a',
        border: '2px solid #3a2a1a',
        borderRadius: 4,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <CodeLines lines={lineCount} color={COLORS.accentOrange} />
      {highlightLine >= 0 && (
        <div
          style={{
            position: 'absolute',
            left: 8,
            right: 8,
            top: 14 + highlightLine * 21,
            height: 2,
            background: COLORS.primary,
            opacity: 0.6,
            boxShadow: `0 0 6px ${COLORS.primaryGlow}`,
          }}
        />
      )}
    </div>
  );
});

export const Zone3WebStudio = React.memo(function Zone3WebStudio() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #1a0f08 0%, #22150a 50%, #2a1a0d 100%)',
        }}
      />

      {/* Persona-style bracket grid overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="webstudio-brackets" width={60} height={60} patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 0 0 L 10 0" fill="none" stroke={COLORS.accentOrange} strokeWidth={0.5} />
            <path d="M 60 50 L 60 60 L 50 60" fill="none" stroke={COLORS.accentOrange} strokeWidth={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#webstudio-brackets)" />
      </svg>

      {/* Code bracket decorative elements */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}
      >
        <text x={30} y={60} fill={COLORS.accentOrange} fontSize={40} fontFamily="monospace" fontWeight={700}>{'{'}</text>
        <text x={700} y={100} fill={COLORS.accentOrange} fontSize={40} fontFamily="monospace" fontWeight={700}>{'}'}</text>
        <text x={200} y={250} fill={COLORS.accentOrange} fontSize={20} fontFamily="monospace" fontWeight={700}>{'</>'}</text>
        <text x={550} y={280} fill={COLORS.accentOrange} fontSize={16} fontFamily="monospace" fontWeight={700}>{'() =>'}</text>
      </svg>

      <DiagonalStripes color={COLORS.accentOrange} opacity={0.025} width={30} />

      <Monitor x={60} y={80} width={160} height={100} rotate={-3} lineCount={5} />
      <Monitor x={280} y={60} width={200} height={140} rotate={2} lineCount={7} highlightLine={3} />
      <Monitor x={540} y={100} width={140} height={80} rotate={-1} lineCount={4} />

      {/* Geometric accent */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: '50%',
          width: 80,
          height: 2,
          background: COLORS.accentOrange,
          opacity: 0.06,
          transform: 'skewX(-20deg)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #2a1a0d 0%, #1a0f08 100%)',
          borderTop: '1px solid rgba(224, 112, 64, 0.1)',
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
                rgba(224, 112, 64, 0.03) 60px,
                rgba(224, 112, 64, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
});
