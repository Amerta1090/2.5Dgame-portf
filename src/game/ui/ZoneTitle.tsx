import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, GeometricDivider } from '@game/art/designSystem';
import type { ZoneId } from '@game/types';

const ZONE_LABELS: Record<ZoneId, string> = {
  zone1: 'SPAWN AREA',
  zone2: 'ACADEMY ROOM',
  zone3: 'WORKSHOP',
  zone4: 'PROJECT DISTRICT',
  zone5: 'CAREER CORRIDOR',
  zone6: 'FINAL ROOM',
};

const ZONE_NUMBERS: Record<ZoneId, string> = {
  zone1: 'ZONE 1',
  zone2: 'ZONE 2',
  zone3: 'ZONE 3',
  zone4: 'ZONE 4',
  zone5: 'ZONE 5',
  zone6: 'ZONE 6',
};

interface ZoneTitleProps {
  zone: ZoneId;
}

export function ZoneTitle({ zone }: ZoneTitleProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [zone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={zone}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 150,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              color: '#888',
              letterSpacing: '0.2em',
              marginBottom: 8,
            }}
          >
            {ZONE_NUMBERS[zone]}
          </motion.div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              fontFamily: "'Impact', sans-serif",
              fontSize: '3rem',
              color: COLORS.primary,
              letterSpacing: '0.05em',
              textShadow: `0 0 30px ${COLORS.primaryGlow}`,
            }}
          >
            {ZONE_LABELS[zone]}
          </motion.div>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            style={{ width: '40%', margin: '8px auto' }}
          >
            <GeometricDivider color={COLORS.primary} thickness={2} slant />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
