import React, { useMemo } from 'react';
import { COLORS, DiagonalStripes, HalftonePattern } from '../designSystem';

interface BuildingDim {
  x: number;
  w: number;
  h: number;
}

const FAR_BUILDINGS: BuildingDim[] = [
  { x: 0, w: 140, h: 280 }, { x: 200, w: 100, h: 350 },
  { x: 400, w: 160, h: 250 }, { x: 650, w: 110, h: 380 },
  { x: 850, w: 130, h: 300 }, { x: 1050, w: 150, h: 260 },
  { x: 1300, w: 120, h: 340 }, { x: 1500, w: 140, h: 290 },
  { x: 1700, w: 100, h: 370 }, { x: 1900, w: 160, h: 270 },
  { x: 2100, w: 130, h: 320 }, { x: 2300, w: 110, h: 360 },
  { x: 2500, w: 150, h: 280 }, { x: 2750, w: 120, h: 330 },
  { x: 2950, w: 140, h: 300 }, { x: 3150, w: 100, h: 360 },
  { x: 3350, w: 160, h: 270 }, { x: 3600, w: 130, h: 310 },
  { x: 3800, w: 110, h: 350 }, { x: 4000, w: 150, h: 290 },
  { x: 4200, w: 120, h: 340 }, { x: 4400, w: 140, h: 280 },
  { x: 4650, w: 100, h: 370 }, { x: 4850, w: 160, h: 260 },
  { x: 5100, w: 130, h: 320 }, { x: 5300, w: 110, h: 350 },
  { x: 5500, w: 150, h: 280 }, { x: 5750, w: 120, h: 330 },
  { x: 5950, w: 140, h: 300 }, { x: 6200, w: 100, h: 360 },
  { x: 6400, w: 160, h: 270 }, { x: 6650, w: 130, h: 310 },
  { x: 6850, w: 110, h: 350 }, { x: 7050, w: 150, h: 290 },
  { x: 7300, w: 120, h: 340 }, { x: 7500, w: 140, h: 280 },
  { x: 7700, w: 100, h: 370 },
];

const MID_BUILDINGS: BuildingDim[] = [
  { x: 100, w: 180, h: 380 }, { x: 500, w: 140, h: 440 },
  { x: 900, w: 200, h: 360 }, { x: 1400, w: 160, h: 420 },
  { x: 1800, w: 180, h: 390 }, { x: 2200, w: 140, h: 450 },
  { x: 2600, w: 200, h: 370 }, { x: 3100, w: 160, h: 410 },
  { x: 3500, w: 180, h: 380 }, { x: 3900, w: 140, h: 440 },
  { x: 4300, w: 200, h: 360 }, { x: 4800, w: 160, h: 420 },
  { x: 5200, w: 180, h: 390 }, { x: 5600, w: 140, h: 450 },
  { x: 6000, w: 200, h: 370 }, { x: 6500, w: 160, h: 410 },
  { x: 6900, w: 180, h: 380 }, { x: 7300, w: 140, h: 440 },
  { x: 7700, w: 160, h: 400 },
];

const WindowGrid = React.memo(function WindowGrid({ height }: { height: number }) {
  const dots = useMemo(() => {
    const rows = Math.floor(height / 40);
    const cols = 3;
    const items: { r: number; c: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.3) items.push({ r, c });
      }
    }
    return items;
  }, [height]);

  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 12 + d.c * 22,
            top: 12 + d.r * 38,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: `rgba(240, 224, 64, ${0.1 + Math.random() * 0.2})`,
            boxShadow: `0 0 4px rgba(240, 224, 64, ${0.05 + Math.random() * 0.1})`,
          }}
        />
      ))}
    </>
  );
});

const FarBuilding = React.memo(function FarBuilding({ b }: { b: BuildingDim }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: b.x,
        bottom: 80,
        width: b.w,
        height: b.h,
        background: '#151008',
        opacity: 0.5,
        border: '1px solid rgba(240, 224, 64, 0.04)',
      }}
    />
  );
});

const MidBuilding = React.memo(function MidBuilding({ b }: { b: BuildingDim }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: b.x,
        bottom: 80,
        width: b.w,
        height: b.h,
        background: '#1a1410',
        border: '1px solid rgba(240, 224, 64, 0.06)',
      }}
    >
      <WindowGrid height={b.h} />
    </div>
  );
});

export const Zone4Background = React.memo(function Zone4Background() {
  const farElements = useMemo(() =>
    FAR_BUILDINGS.map((b, i) => <FarBuilding key={`far-${i}`} b={b} />),
  []);

  const midElements = useMemo(() =>
    MID_BUILDINGS.map((b, i) => <MidBuilding key={`mid-${i}`} b={b} />),
  []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #1a1410 0%, #221a14 30%, #2a1f18 60%, #1a1410 100%)',
        }}
      />

      {/* Persona-style geometric skyline overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="zone4-grid" width={120} height={120} patternUnits="userSpaceOnUse">
            <rect x={0} y={0} width={120} height={120} fill="none" stroke={COLORS.primary} strokeWidth={0.3} />
            <circle cx={60} cy={60} r={20} fill="none" stroke={COLORS.primary} strokeWidth={0.3} opacity={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zone4-grid)" />
      </svg>

      <div
        style={{
          position: 'absolute',
          top: 40,
          right: '30%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: COLORS.primary,
          opacity: 0.12,
          boxShadow: `0 0 120px ${COLORS.primaryGlow}, 0 0 240px rgba(240, 224, 64, 0.15)`,
        }}
      />

      {/* Geometric decorative elements */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <rect
            key={i}
            x={400 + i * 700}
            y={60}
            width={40}
            height={40}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth={1}
            transform={`rotate(${i * 15}, ${400 + i * 700 + 20}, ${80})`}
            opacity={0.5}
          />
        ))}
      </svg>

      <HalftonePattern color={COLORS.primary} opacity={0.02} size={5} />
      <DiagonalStripes color={COLORS.primary} opacity={0.025} width={30} />

      <div style={{ position: 'absolute', inset: 0 }}>{farElements}</div>
      <div style={{ position: 'absolute', inset: 0 }}>{midElements}</div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #1a1410 0%, #0f0a08 100%)',
          borderTop: '1px solid rgba(240, 224, 64, 0.2)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(90deg, transparent 59px, rgba(240, 224, 64, 0.04) 60px)',
            backgroundSize: '60px 100%',
          }}
        />
      </div>
    </div>
  );
});
