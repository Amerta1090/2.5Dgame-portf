import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
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
          <div
            style={{
              fontFamily: "'Impact', sans-serif",
              fontSize: '0.9rem',
              color: '#888',
              letterSpacing: '0.15em',
              marginBottom: 8,
            }}
          >
            {ZONE_NUMBERS[zone]}
          </div>
          <div
            style={{
              fontFamily: "'Impact', sans-serif",
              fontSize: '3rem',
              color: '#F0E040',
              letterSpacing: '0.05em',
              textShadow: '0 0 20px rgba(240, 224, 64, 0.3)',
            }}
          >
            {ZONE_LABELS[zone]}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
