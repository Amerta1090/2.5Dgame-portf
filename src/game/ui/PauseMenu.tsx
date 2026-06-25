import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PauseMenuProps {
  visible: boolean;
  onResume: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSkipGame: () => void;
  onReset: () => void;
}

const MENU_ITEMS = [
  { label: '▶ RESUME', action: 'resume' as const },
  { label: '💾 SAVE', action: 'save' as const },
  { label: '📂 LOAD', action: 'load' as const },
  { label: '⏭ SKIP GAME', action: 'skip' as const },
  { label: '⟳ RESET', action: 'reset' as const },
];

export function PauseMenu({
  visible,
  onResume,
  onSave,
  onLoad,
  onSkipGame,
  onReset,
}: PauseMenuProps) {
  const [index, setIndex] = useState(0);

  const execute = useCallback(
    (i: number) => {
      const item = MENU_ITEMS[i];
      switch (item.action) {
        case 'resume':
          onResume();
          break;
        case 'save':
          onSave();
          break;
        case 'load':
          onLoad();
          break;
        case 'skip':
          onSkipGame();
          break;
        case 'reset':
          onReset();
          break;
      }
    },
    [onResume, onSave, onLoad, onSkipGame, onReset],
  );

  useEffect(() => {
    if (!visible) return;
    setIndex(0);

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
        case 'Escape':
          e.preventDefault();
          onResume();
          break;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, index, execute, onResume]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onResume();
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                color: '#F0E040',
                fontFamily: "'Impact', sans-serif",
                fontSize: '1.5rem',
                marginBottom: 16,
                letterSpacing: '0.05em',
              }}
            >
              PAUSED
            </h2>

            {MENU_ITEMS.map((item, i) => {
              const selected = i === index;
              return (
                <button
                  key={item.action}
                  onClick={() => {
                    setIndex(i);
                    execute(i);
                  }}
                  onMouseEnter={() => setIndex(i)}
                  style={{
                    background: 'transparent',
                    border: selected ? '2px solid #F0E040' : '2px solid #555',
                    color: selected ? '#F0E040' : '#888',
                    padding: '10px 40px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    fontFamily: "'Impact', sans-serif",
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    transition: 'border-color 0.2s, color 0.2s',
                    outline: 'none',
                    minWidth: 200,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
