import { motion, AnimatePresence } from 'framer-motion';

interface LetterboxProps {
  visible: boolean;
  height?: number;
}

export function Letterbox({ visible, height = 60 }: LetterboxProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="letterbox-top"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height,
              background: '#0A0A0A',
              zIndex: 500,
            }}
          />
          <motion.div
            key="letterbox-bottom"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100vw',
              height,
              background: '#0A0A0A',
              zIndex: 500,
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
