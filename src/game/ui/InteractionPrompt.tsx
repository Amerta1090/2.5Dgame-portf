import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@game/art/designSystem';

interface InteractionPromptProps {
  visible: boolean;
  label?: string;
}

export function InteractionPrompt({ visible, label }: InteractionPromptProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.85)',
              border: `1px solid ${COLORS.primary}`,
              padding: '8px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transform: 'skewX(-6deg)',
              boxShadow: `0 0 12px ${COLORS.primaryGlow}`,
              animation: 'promptPulse 2s ease-in-out infinite',
            } as React.CSSProperties}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: COLORS.primary,
                color: '#000',
                fontWeight: 700,
                fontSize: 11,
                transform: 'skewX(6deg)',
                fontFamily: "'Impact', sans-serif",
              }}
            >
              E
            </span>
            <span style={{ color: COLORS.primary, transform: 'skewX(6deg)', display: 'inline-block', fontWeight: 500 }}>
              {label || 'INTERACT'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
