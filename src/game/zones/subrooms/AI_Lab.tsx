import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zone3AILab } from '@game/art/backgrounds/Zone3AILab';
import { getAllGameData } from '@game/data';
import { AIPipeline } from '@game/puzzles/AIPipeline';

interface AI_LabProps {
  onPuzzleComplete: (id: string) => void;
  puzzleCompleted: boolean;
}

export function AI_Lab({ onPuzzleComplete, puzzleCompleted }: AI_LabProps) {
  const skills = useMemo(
    () => getAllGameData().skills.find((c) => c.name === 'Machine Learning & AI'),
    [],
  );
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const handlePuzzleDone = useCallback(() => {
    onPuzzleComplete('ai-pipeline');
    setShowPuzzle(false);
  }, [onPuzzleComplete]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Zone3AILab />

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          color: '#4080E0',
          fontFamily: "'Impact', sans-serif",
          fontSize: 16,
          letterSpacing: '0.1em',
        }}
      >
        AI LABORATORY
      </div>

      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 260,
          zIndex: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          maxWidth: 500,
        }}
      >
        {skills?.skills.map((skill) => (
          <div
            key={skill.name}
            onClick={() => setShowDetail(showDetail === skill.name ? null : skill.name)}
            style={{
              width: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              padding: 8,
              borderRadius: 4,
              background: showDetail === skill.name ? 'rgba(64,128,224,0.1)' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid #4080E0',
                position: 'relative',
                overflow: 'hidden',
                background: '#0a0f1a',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${(skill.proficiency / 5) * 100}%`,
                  background: 'linear-gradient(0deg, #4080E0, rgba(64,128,224,0.3))',
                  borderRadius: '0 0 50% 50%',
                }}
              />
            </div>
            <span
              style={{
                color: '#aaa',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      {!puzzleCompleted && (
        <div
          onClick={() => setShowPuzzle(true)}
          style={{
            position: 'absolute',
            right: 80,
            top: 260,
            zIndex: 5,
            width: 140,
            height: 60,
            border: '2px solid #4080E0',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 4,
            cursor: 'pointer',
            background: 'rgba(64,128,224,0.05)',
            transition: 'background 0.2s',
          }}
        >
          <span style={{ color: '#4080E0', fontFamily: "'Impact', sans-serif", fontSize: 11 }}>
            AI PIPELINE
          </span>
          <span style={{ color: '#888', fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>
            Click to start
          </span>
        </div>
      )}

      {puzzleCompleted && (
        <div
          style={{
            position: 'absolute',
            right: 80,
            top: 260,
            zIndex: 5,
            width: 140,
            height: 60,
            border: '2px solid #40E060',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#40E060',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            background: 'rgba(64,224,96,0.05)',
          }}
        >
          ✓ Completed
        </div>
      )}

      <AnimatePresence>
        {showPuzzle && (
          <AIPipeline
            onComplete={handlePuzzleDone}
            onClose={() => setShowPuzzle(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              left: 60,
              top: 480,
              zIndex: 10,
              color: '#f5f5f5',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              background: 'rgba(0,0,0,0.9)',
              border: '1px solid #4080E0',
              borderRadius: 4,
              padding: '8px 12px',
              maxWidth: 300,
            }}
          >
            {skills?.skills.find((s) => s.name === showDetail)?.name}
            {' — '}
            Proficiency: {skills?.skills.find((s) => s.name === showDetail)?.proficiency}/5
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
