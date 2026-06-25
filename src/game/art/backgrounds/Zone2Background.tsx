import React, { useMemo } from 'react';
import { COLORS, DiagonalStripes, HalftonePattern } from '../designSystem';

const BOOK_COLORS = ['#8B4513', '#556B2F', '#8B0000', '#191970', '#4A0000', '#2F4F4F', '#800020', '#3CB371', '#B8860B', '#483D8B'];

function BookshelfRow({ y }: { y: number }) {
  const books = useMemo(() => {
    const items: React.ReactNode[] = [];
    for (let i = 0; i < 8; i++) {
      const color = BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
      items.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 6 + i * 14,
            top: -4,
            width: 10,
            height: 30 + Math.floor(Math.random() * 20),
            background: color,
            borderRadius: '1px 2px 0 0',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
          }}
        />
      );
    }
    const glowIdx = Math.floor(Math.random() * 7);
    items.push(
      <div
        key="glow"
        style={{
          position: 'absolute',
          left: 6 + glowIdx * 14,
          top: -4,
          width: 10,
          height: 40,
          background: '#d4a017',
          borderRadius: '1px 2px 0 0',
          boxShadow: '0 0 6px rgba(212, 160, 23, 0.4)',
          borderBottom: '1px solid rgba(0,0,0,0.3)',
        }}
      />
    );
    return items;
  }, []);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0, right: 0, top: y,
          height: 2,
          background: 'rgba(212, 160, 23, 0.15)',
        }}
      />
      {books}
    </>
  );
}

const ShelfColumn = React.memo(function ShelfColumn({ index, isMid = false }: { index: number; isMid?: boolean }) {
  const x = isMid ? 50 + index * 300 : 100 + index * 250;
  const w = isMid ? 140 : 120;
  const h = isMid ? 520 : 500;
  const bg = isMid ? '#151008' : '#1a1410';
  const borderColor = isMid ? 'rgba(212, 160, 23, 0.1)' : 'rgba(212, 160, 23, 0.05)';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        bottom: 80,
        width: w,
        height: h,
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        zIndex: isMid ? 1 : 0,
        opacity: isMid ? 1 : 0.6,
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6].map((s) => (
        <BookshelfRow key={s} y={isMid ? 25 + s * 68 : 30 + s * 65} />
      ))}
    </div>
  );
});

export const Zone2Background = React.memo(function Zone2Background() {
  const farShelves = useMemo(() =>
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
      <ShelfColumn key={`far-${i}`} index={i} />
    )),
  []);

  const midShelves = useMemo(() =>
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
      <ShelfColumn key={`mid-${i}`} index={i} isMid />
    )),
  []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #1a1208 0%, #221a0d 50%, #2a1f0a 100%)',
        }}
      />

      {/* Persona-style geometric arch overlay */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="zone2-arch" width={200} height={200} patternUnits="userSpaceOnUse">
            <path d="M 0 100 Q 100 0 200 100" fill="none" stroke={COLORS.primary} strokeWidth={0.5} />
            <path d="M 0 200 Q 100 100 200 200" fill="none" stroke={COLORS.primary} strokeWidth={0.3} opacity={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zone2-arch)" />
      </svg>

      {/* Decorative geometric panels */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: '5%',
          width: 80,
          height: 80,
          border: `1px solid ${COLORS.primary}`,
          opacity: 0.06,
          transform: 'rotate(45deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: '8%',
          width: 60,
          height: 60,
          border: `1px solid ${COLORS.primary}`,
          opacity: 0.05,
          transform: 'rotate(15deg)',
        }}
      />

      <HalftonePattern color={COLORS.primary} opacity={0.03} size={6} />
      <DiagonalStripes color={COLORS.primary} opacity={0.02} width={40} />

      {farShelves}
      {midShelves}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #2a1f0a 0%, #1a1208 100%)',
          borderTop: '1px solid rgba(212, 160, 23, 0.2)',
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
                rgba(212, 160, 23, 0.03) 60px,
                rgba(212, 160, 23, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
});
