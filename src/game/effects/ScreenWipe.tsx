import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZoneId } from '@game/types';

const ZONE_LABELS: Record<ZoneId, string> = {
  zone1: 'ZONE 1 — SPAWN AREA',
  zone2: 'ZONE 2 — ACADEMY ROOM',
  zone3: 'ZONE 3 — WORKSHOP',
  zone4: 'ZONE 4 — PROJECT DISTRICT',
  zone5: 'ZONE 5 — CAREER CORRIDOR',
  zone6: 'ZONE 6 — FINAL ROOM',
};

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
      }, 1400);
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
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{
              fontSize: '3rem',
              color: '#F0E040',
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}
          >
            {ZONE_LABELS[zoneName]}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
