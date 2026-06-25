import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, DiagonalStripes, GeometricDivider } from '@game/art/designSystem';

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [phase, setPhase] = useState<'flicker' | 'glitch' | 'logo' | 'ready'>('flicker');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('glitch'), 200);
    const t2 = setTimeout(() => setPhase('logo'), 500);
    const t3 = setTimeout(() => setPhase('ready'), 1500);

    function handleKey(e: KeyboardEvent) {
      e.preventDefault();
      onStart();
    }
    function handleClick() {
      onStart();
    }

    window.addEventListener('keydown', handleKey);
    window.addEventListener('click', handleClick);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('click', handleClick);
    };
  }, [onStart]);

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
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Background effects */}
      <DiagonalStripes color={COLORS.primary} opacity={0.02} width={50} />

      {/* Geometric decorative elements */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03 }}
      >
        <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke={COLORS.primary} strokeWidth={1} />
        <rect x="12%" y="12%" width="76%" height="76%" fill="none" stroke={COLORS.primary} strokeWidth={0.5} opacity={0.5} />
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={COLORS.primary} strokeWidth={0.5} opacity={0.3} />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={COLORS.primary} strokeWidth={0.5} opacity={0.3} />
      </svg>

      {/* Scanline simulation during boot */}
      {phase === 'flicker' && (
        <motion.div
          key="flicker"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
          }}
        />
      )}

      {/* Glitch frame */}
      <AnimatePresence>
        {phase === 'glitch' && (
          <motion.div
            key="glitch"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0, 1], x: [-2, 3, -1, 2, -3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: '#0A0A0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                color: '#fff',
                fontSize: '3rem',
                fontWeight: 900,
                fontFamily: "'JetBrains Mono', monospace",
                opacity: 0.3,
              }}
            >
              BOOT_SEQUENCE_INIT...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: phase === 'logo' ? 0 : 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <motion.h1
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            color: COLORS.primary,
            fontFamily: "'Impact', sans-serif",
            letterSpacing: '0.05em',
            textAlign: 'center',
            margin: 0,
            textShadow: `0 0 60px ${COLORS.primaryGlow}, 0 0 120px rgba(240, 224, 64, 0.3)`,
          }}
          animate={phase === 'logo' ? undefined : undefined}
        >
          25DGAME
        </motion.h1>

        <div style={{ width: '40%', margin: '12px auto' }}>
          <GeometricDivider color={COLORS.primary} thickness={2} slant />
        </div>

        <motion.p
          style={{
            color: '#555',
            marginTop: 8,
            fontSize: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          Interactive Portfolio Experience
        </motion.p>
      </motion.div>

      {/* "Press any key" prompt */}
      <AnimatePresence>
        {phase === 'ready' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '15%',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: '#666',
                fontSize: '0.9rem',
                fontFamily: "'JetBrains Mono', monospace",
                animation: 'blink 1.2s step-end infinite',
                letterSpacing: '0.2em',
              }}
            >
              Press any key to start
            </p>
            <div
              style={{
                marginTop: 16,
                width: 2,
                height: 16,
                background: COLORS.primary,
                margin: '12px auto 0',
                animation: 'blink 1.2s step-end infinite',
                opacity: 0.5,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRT scanline overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          opacity: 0.3,
          zIndex: 9999,
        }}
      />
    </div>
  );
}
