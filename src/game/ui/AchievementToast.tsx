import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementToastProps {
  queue: string[];
  onDismiss: (achievement: string) => void;
}

const ACHIEVEMENT_LABELS: Record<string, string> = {
  'first-contact': 'First Contact — First interaction',
  'dedicated-student': 'Dedicated Student — Collect 5 certifications',
  'polyglot': 'Polyglot — Collect 10 certifications',
  'certified': 'Certified — Collect all certifications',
  'ai-apprentice': 'AI Apprentice — Complete AI Lab puzzle',
  'web-weaver': 'Web Weaver — Complete Web Studio puzzle',
  'iot-tinkerer': 'IoT Tinkerer — Complete IoT Workshop puzzle',
  'project-hopper': 'Project Hopper — Visit 3 project rooms',
  'deep-dive': 'Deep Dive — Read full project description',
  'career-scout': 'Career Scout — Enter Career Corridor',
  'decision-maker': 'Decision Maker — Complete a branching choice',
  'inner-circle': 'Inner Circle — Reach Final Hidden Room',
  'lore-seeker': 'Lore Seeker — Find 1 hidden lore fragment',
  'lore-master': 'Lore Master — Find all hidden lore fragments',
  'speed-demon': 'Speed Demon — Complete game in under 15 min',
};

export function AchievementToast({ queue, onDismiss }: AchievementToastProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (queue.length > 0 && !active) {
      const next = queue[0];
      setActive(next);
      const timer = setTimeout(() => {
        setActive(null);
        onDismiss(next);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [queue, active, onDismiss]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 250,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {active && (
          <motion.div
            key={active}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              background: '#1a1a1a',
              border: '1px solid #F0E040',
              borderRadius: 4,
              padding: '12px 20px',
              minWidth: 240,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#F0E040',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                ★
              </div>
              <div>
                <div
                  style={{
                    color: '#F0E040',
                    fontFamily: "'Impact', sans-serif",
                    fontSize: 12,
                    letterSpacing: '0.05em',
                    marginBottom: 2,
                  }}
                >
                  Achievement Unlocked!
                </div>
                <div
                  style={{
                    color: '#f5f5f5',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                  }}
                >
                  {ACHIEVEMENT_LABELS[active] || active}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
