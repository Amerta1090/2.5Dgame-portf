import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, DiagonalStripes, GeometricDivider, CornerBrackets, CornerBracketsBottomRight } from '@game/art/designSystem';

interface PauseMenuProps {
  visible: boolean;
  onResume: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSkipGame: () => void;
  onReset: () => void;
  commentaryUnlocked?: boolean;
  commentaryEnabled?: boolean;
  onToggleCommentary?: () => void;
}

function buildMenuItems(commentaryUnlocked: boolean, commentaryEnabled: boolean) {
  const items: { label: string; action: string }[] = [
    { label: '▶ RESUME', action: 'resume' },
    { label: '💾 SAVE', action: 'save' },
    { label: '📂 LOAD', action: 'load' },
    { label: '⏭ SKIP GAME', action: 'skip' },
    { label: '⟳ RESET', action: 'reset' },
  ];
  if (commentaryUnlocked) {
    items.splice(1, 0, {
      label: commentaryEnabled ? '💬 COMMENTARY ON' : '💬 COMMENTARY OFF',
      action: 'commentary',
    });
  }
  return items;
}

export function PauseMenu({
  visible,
  onResume,
  onSave,
  onLoad,
  onSkipGame,
  onReset,
  commentaryUnlocked = false,
  commentaryEnabled = false,
  onToggleCommentary,
}: PauseMenuProps) {
  const [index, setIndex] = useState(0);
  const menuItems = buildMenuItems(commentaryUnlocked, commentaryEnabled);

  const execute = useCallback(
    (i: number) => {
      const item = menuItems[i];
      switch (item.action) {
        case 'resume': onResume(); break;
        case 'save': onSave(); break;
        case 'load': onLoad(); break;
        case 'skip': onSkipGame(); break;
        case 'reset': onReset(); break;
        case 'commentary': onToggleCommentary?.(); break;
      }
    },
    [onResume, onSave, onLoad, onSkipGame, onReset, onToggleCommentary, menuItems],
  );

  useEffect(() => {
    if (!visible) return;
    setIndex(0);

    function onKeyDown(e: KeyboardEvent) {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          setIndex((i) => (i - 1 + menuItems.length) % menuItems.length);
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          setIndex((i) => (i + 1) % menuItems.length);
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
  }, [visible, index, execute, onResume, menuItems.length]);

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
            background: 'rgba(0,0,0,0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onResume();
          }}
        >
          {/* Background decorative elements */}
          <DiagonalStripes color={COLORS.primary} opacity={0.02} width={40} />
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03 }}
          >
            <rect x="20%" y="20%" width="60%" height="60%" fill="none" stroke={COLORS.primary} strokeWidth={1} />
            <line x1="0" y1="0" x2="100%" y2="100%" stroke={COLORS.primary} strokeWidth={0.5} />
          </svg>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            style={{
              background: 'rgba(10, 10, 10, 0.95)',
              border: `2px solid ${COLORS.primary}`,
              padding: '32px 48px',
              position: 'relative',
              boxShadow: `0 0 30px ${COLORS.primaryGlow}`,
              minWidth: 280,
            }}
          >
            <CornerBrackets size={16} color={COLORS.primary} />
            <CornerBracketsBottomRight size={16} color={COLORS.primary} />

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2
                style={{
                  color: COLORS.primary,
                  fontFamily: "'Impact', sans-serif",
                  fontSize: '1.8rem',
                  letterSpacing: '0.08em',
                  margin: 0,
                  textShadow: `0 0 20px ${COLORS.primaryGlow}`,
                }}
              >
                PAUSED
              </h2>
              <GeometricDivider width="60%" color={COLORS.primary} thickness={1} slant />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {menuItems.map((item, i) => {
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
                        ? `linear-gradient(135deg, ${COLORS.primary}22, transparent)`
                        : 'transparent',
                      border: selected ? `1px solid ${COLORS.primary}` : '1px solid #333',
                      color: selected ? COLORS.primary : '#666',
                      padding: '10px 40px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      fontFamily: "'Impact', sans-serif",
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                      outline: 'none',
                      minWidth: 200,
                      transform: selected ? 'skewX(-4deg)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ transform: selected ? 'skewX(4deg)' : 'none', display: 'inline-block' }}>
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
