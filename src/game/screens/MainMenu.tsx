import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { COLORS, DiagonalStripes, HalftonePattern, GeometricDivider } from '@game/art/designSystem';

const MENU_ITEMS = [
  { label: '▶ START GAME', action: 'start' as const },
  { label: '■ ABOUT THIS', action: 'about' as const },
  { label: '★ CREDITS', action: 'credits' as const },
];

interface MainMenuProps {
  onStart: () => void;
  onAbout: () => void;
  onCredits: () => void;
}

export function MainMenu({ onStart, onAbout, onCredits }: MainMenuProps) {
  const [index, setIndex] = useState(0);

  const execute = useCallback(
    (i: number) => {
      const item = MENU_ITEMS[i];
      if (item.action === 'start') onStart();
      else if (item.action === 'about') onAbout();
      else if (item.action === 'credits') onCredits();
    },
    [onStart, onAbout, onCredits],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          setIndex((i) => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          setIndex((i) => (i + 1) % MENU_ITEMS.length);
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          execute(index);
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, execute]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        overflow: 'hidden',
      }}
    >
      {/* Background geometric elements */}
      <DiagonalStripes color={COLORS.primary} opacity={0.03} width={40} />
      <HalftonePattern color={COLORS.primary} opacity={0.02} size={6} />

      {/* Decorative SVG geometric rings */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04 }}
      >
        <circle cx="30%" cy="50%" r={200} fill="none" stroke={COLORS.primary} strokeWidth={1} />
        <circle cx="30%" cy="50%" r={160} fill="none" stroke={COLORS.primary} strokeWidth={0.5} opacity={0.5} />
        <circle cx="70%" cy="50%" r={180} fill="none" stroke={COLORS.primary} strokeWidth={0.8} />
        <circle cx="70%" cy="50%" r={140} fill="none" stroke={COLORS.primary} strokeWidth={0.3} opacity={0.5} />
        {/* Diagonal accent lines */}
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={COLORS.primary} strokeWidth={0.5} opacity={0.2} />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={COLORS.primary} strokeWidth={0.5} opacity={0.2} />
      </svg>

      {/* Corner decorative brackets */}
      <svg
        width={60}
        height={60}
        style={{ position: 'absolute', top: 20, left: 20 }}
      >
        <path d="M 0 20 L 0 0 L 20 0" fill="none" stroke={COLORS.primary} strokeWidth={2} opacity={0.3} />
        <path d="M 0 40 L 0 60 L 20 60" fill="none" stroke={COLORS.primary} strokeWidth={1} opacity={0.15} />
      </svg>
      <svg
        width={60}
        height={60}
        style={{ position: 'absolute', bottom: 20, right: 20, transform: 'rotate(180deg)' }}
      >
        <path d="M 0 20 L 0 0 L 20 0" fill="none" stroke={COLORS.primary} strokeWidth={2} opacity={0.3} />
        <path d="M 0 40 L 0 60 L 20 60" fill="none" stroke={COLORS.primary} strokeWidth={1} opacity={0.15} />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 900,
              color: COLORS.primary,
              fontFamily: "'Impact', sans-serif",
              letterSpacing: '0.05em',
              textShadow: `0 0 40px ${COLORS.primaryGlow}`,
              margin: 0,
            }}
          >
            25DGAME
          </h2>
          <div style={{ width: '60%', margin: '8px auto' }}>
            <GeometricDivider color={COLORS.primary} thickness={2} slant />
          </div>
          <p
            style={{
              color: '#666',
              fontSize: '0.75rem',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.3em',
              margin: 0,
            }}
          >
            INTERFACE v2.5D
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          {MENU_ITEMS.map((item, i) => {
            const selected = i === index;
            return (
              <motion.button
                key={item.action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIndex(i);
                  execute(i);
                }}
                onMouseEnter={() => setIndex(i)}
                style={{
                  background: selected
                    ? `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.primary}11)`
                    : 'transparent',
                  border: selected
                    ? `2px solid ${COLORS.primary}`
                    : '2px solid #333',
                  color: selected ? COLORS.primary : '#666',
                  padding: '14px 56px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: "'Impact', sans-serif",
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  minWidth: 260,
                  position: 'relative',
                  transform: selected ? 'skewX(-4deg)' : 'skewX(-2deg)',
                  boxShadow: selected ? `0 0 20px ${COLORS.primaryGlow}` : 'none',
                }}
              >
                <span style={{ display: 'inline-block', transform: selected ? 'skewX(4deg)' : 'skewX(2deg)' }}>
                  {item.label}
                </span>
                {selected && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%) skewX(4deg)',
                      color: COLORS.primary,
                      fontSize: 10,
                      animation: 'pulse 1s ease-in-out infinite',
                    } as React.CSSProperties}
                  >
                    ▶
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
