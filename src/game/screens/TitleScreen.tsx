import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [phase, setPhase] = useState<'flicker' | 'logo' | 'ready'>('flicker');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'), 300);
    const t2 = setTimeout(() => setPhase('ready'), 1100);

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
      <AnimatePresence>
        {phase === 'flicker' && (
          <motion.div
            key="flicker"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: '#fff',
            }}
          />
        )}
      </AnimatePresence>

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          fontSize: '4rem',
          fontWeight: 900,
          color: '#F0E040',
          fontFamily: "'Impact', sans-serif",
          letterSpacing: '0.05em',
          textAlign: 'center',
          margin: 0,
        }}
      >
        25DGAME
      </motion.h1>

      <AnimatePresence>
        {phase === 'ready' && (
          <motion.p
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              color: '#888',
              marginTop: '2rem',
              fontSize: '1rem',
              fontFamily: "'JetBrains Mono', monospace",
              animation: 'blink 1s step-end infinite',
            }}
          >
            Press any key to start
          </motion.p>
        )}
      </AnimatePresence>

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
