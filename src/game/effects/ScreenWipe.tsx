import { motion, AnimatePresence } from 'framer-motion';

interface ScreenWipeProps {
  visible: boolean;
  zoneName?: string;
  onComplete?: () => void;
}

export function ScreenWipe({ visible, zoneName, onComplete }: ScreenWipeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="wipe"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={onComplete}
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
          }}
        >
          {zoneName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{
                fontSize: '3rem',
                color: '#F0E040',
                letterSpacing: '0.05em',
                textAlign: 'center',
              }}
            >
              {zoneName}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
