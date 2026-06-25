import React, { useMemo } from 'react';
import { COLORS, DiagonalStripes } from '../designSystem';

const TimelineDot = React.memo(function TimelineDot({ x, index }: { x: number; index: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 6,
        top: 340,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: COLORS.primary,
        boxShadow: `0 0 8px ${COLORS.primaryGlow}`,
        zIndex: 2,
        animation: `pulse ${2 + index * 0.3}s ease-in-out infinite`,
        animationDelay: `${index * 0.5}s`,
      } as React.CSSProperties}
    />
  );
});

export const Zone5Background = React.memo(function Zone5Background() {
  const windows = useMemo(() => {
    const elements: React.ReactNode[] = [];
    for (let x = 50; x < 4000; x += 300) {
      elements.push(
        <div
          key={`win-${x}`}
          style={{
            position: 'absolute',
            left: x,
            top: 40,
            width: 120,
            height: 160,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(255,255,255,0.03)',
              transform: 'translateX(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: 1,
              background: 'rgba(255,255,255,0.03)',
            }}
          />
        </div>,
      );
    }
    return elements;
  }, []);

  const wallPanels = useMemo(() => {
    const elements: React.ReactNode[] = [];
    for (let x = 0; x < 4000; x += 200) {
      elements.push(
        <div
          key={`panel-${x}`}
          style={{
            position: 'absolute',
            left: x,
            top: 0,
            width: 1,
            height: 260,
            background: 'rgba(255,255,255,0.02)',
          }}
        />,
      );
    }
    return elements;
  }, []);

  const timelineDots = useMemo(() => {
    const positions = [350, 750, 1150, 1550, 1950, 2350, 2750, 3150];
    return positions.map((x, i) => <TimelineDot key={`dot-${i}`} x={x} index={i} />);
  }, []);

  const yearLabels = useMemo(() =>
    [2023, 2024, 2025, 2026].map((year, i) => (
      <div
        key={year}
        style={{
          position: 'absolute',
          left: 400 + i * 800,
          top: 16,
          color: '#888',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          transform: 'translateX(-50%)',
        }}
      >
        {year}
      </div>
    )),
  []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #0f0f0f 0%, #151515 50%, #1a1a1a 100%)',
      }}
    >
      {/* Persona-style corridor grid overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="zone5-grid" width={100} height={100} patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 100 0 M 0 0 L 0 100" fill="none" stroke={COLORS.primary} strokeWidth={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zone5-grid)" />
      </svg>

      {/* Perspective lines */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
      >
        {[0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000].map((x) => (
          <line
            key={x}
            x1={x}
            y1={260}
            x2={x + 400}
            y2={500}
            stroke={COLORS.primary}
            strokeWidth={0.3}
            opacity={0.3}
          />
        ))}
      </svg>

      <DiagonalStripes color={COLORS.primary} opacity={0.02} width={40} />
      {wallPanels}
      {windows}

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 200,
          width: '100%',
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(240, 224, 64, 0.15) 20%, rgba(240, 224, 64, 0.15) 80%, transparent 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #151515 100%)',
          borderTop: '1px solid rgba(240, 224, 64, 0.15)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 30,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #F0E040 5%, #F0E040 95%, transparent 100%)',
            opacity: 0.6,
          }}
        >
          {timelineDots}
        </div>
        {yearLabels}
      </div>
    </div>
  );
});
