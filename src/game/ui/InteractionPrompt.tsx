import { motion, AnimatePresence } from 'framer-motion';

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
            color: '#F0E040',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            background: 'rgba(0,0,0,0.8)',
            padding: '8px 16px',
            borderRadius: 4,
            border: '1px solid #F0E040',
            animation: 'promptPulse 2s ease-in-out infinite',
          }}
        >
          Press <span style={{ fontWeight: 700 }}>E</span> to {label || 'interact'}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
