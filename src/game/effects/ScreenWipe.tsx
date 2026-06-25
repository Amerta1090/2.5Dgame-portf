import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, formatZoneName, GeometricDivider } from '@game/art/designSystem';
import type { ZoneId } from '@game/types';

interface ScreenWipeProps {
  visible: boolean;
  zoneName: ZoneId;
  onComplete?: () => void;
}

export function ScreenWipe({ visible, zoneName, onComplete }: ScreenWipeProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => {
        onComplete?.();
      }, 1600);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="wipe"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#0A0A0A',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: 'center',
            fontFamily: "'Impact', sans-serif",
            overflow: 'hidden',
          }}
        >
          {/* Geometric background pattern */}
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
          >
            <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke={COLORS.primary} strokeWidth={1} />
            <line x1="0" y1="0" x2="100%" y2="100%" stroke={COLORS.primary} strokeWidth={0.5} />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke={COLORS.primary} strokeWidth={0.5} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <circle
                key={i}
                cx={12.5 + i * 12.5 + '%'}
                cy="50%"
                r={4}
                fill="none"
                stroke={COLORS.primary}
                strokeWidth={0.3}
                opacity={0.3}
              />
            ))}
          </svg>

          {/* Diagonal accent bars */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-10%',
              width: '120%',
              height: 3,
              background: COLORS.primary,
              opacity: 0.08,
              transform: 'skewX(-20deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '-10%',
              width: '120%',
              height: 3,
              background: COLORS.primary,
              opacity: 0.08,
              transform: 'skewX(20deg)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ textAlign: 'center', zIndex: 1 }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                color: COLORS.primary,
                letterSpacing: '0.05em',
                textShadow: `0 0 40px ${COLORS.primaryGlow}`,
                marginBottom: 16,
              }}
            >
              {formatZoneName(zoneName)}
            </div>
            <div style={{ width: '60%', margin: '0 auto' }}>
              <GeometricDivider color={COLORS.primary} thickness={2} slant />
            </div>
            <div
              style={{
                marginTop: 12,
                color: '#555',
                fontSize: '0.7rem',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.3em',
              }}
            >
              LOADING...
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
