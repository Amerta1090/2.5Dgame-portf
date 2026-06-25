import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zone3WebStudio } from '@game/art/backgrounds/Zone3WebStudio';
import { getAllGameData } from '@game/data';
import { DebugChallenge } from '@game/puzzles/DebugChallenge';

interface Web_StudioProps {
  onPuzzleComplete: (id: string) => void;
  puzzleCompleted: boolean;
  onLoreCollect?: (id: string) => void;
}

export function Web_Studio({ onPuzzleComplete, puzzleCompleted, onLoreCollect }: Web_StudioProps) {
  const skills = useMemo(
    () => getAllGameData().skills.find((c) => c.name === 'Web Development'),
    [],
  );
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [loreText, setLoreText] = useState<string | null>(null);
  const [easterEgg, setEasterEgg] = useState<string | null>(null);

  const handlePuzzleDone = useCallback(() => {
    onPuzzleComplete('debug-challenge');
    setShowPuzzle(false);
  }, [onPuzzleComplete]);

  const handleLoreClick = useCallback(() => {
    if (!onLoreCollect || loreText) return;
    onLoreCollect('lf-5');
    setLoreText('In the trash bin: a crumpled note reads "Not all treasure is gold — some are lessons." — LF-5');
    setTimeout(() => setLoreText(null), 4000);
  }, [onLoreCollect, loreText]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Zone3WebStudio />

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          color: '#E07040',
          fontFamily: "'Impact', sans-serif",
          fontSize: 16,
          letterSpacing: '0.1em',
        }}
      >
        WEB STUDIO
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
              background: showDetail === skill.name ? 'rgba(224,112,64,0.1)' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid #E07040',
                position: 'relative',
                overflow: 'hidden',
                background: '#1a0f08',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${(skill.proficiency / 5) * 100}%`,
                  background: 'linear-gradient(0deg, #E07040, rgba(224,112,64,0.3))',
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
            border: '2px solid #E07040',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 4,
            cursor: 'pointer',
            background: 'rgba(224,112,64,0.05)',
            transition: 'background 0.2s',
          }}
        >
          <span style={{ color: '#E07040', fontFamily: "'Impact', sans-serif", fontSize: 11 }}>
            DEBUG CHALLENGE
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

      <div
        onClick={() => setEasterEgg(easterEgg ? null : '"The truth is out there."')}
        style={{
          position: 'absolute',
          left: 480,
          top: 200,
          width: 50,
          height: 35,
          zIndex: 5,
          border: '1px solid rgba(224,112,64,0.15)',
          borderRadius: 2,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(224,112,64,0.04) 2px, rgba(224,112,64,0.04) 4px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="A familiar-looking monitor..."
      >
        <span style={{ color: 'rgba(224,112,64,0.25)', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
          TV
        </span>
      </div>

      <div
        onClick={handleLoreClick}
        style={{
          position: 'absolute',
          right: 40,
          bottom: 60,
          width: 36,
          height: 30,
          zIndex: 5,
          border: loreText ? '1px solid rgba(224,112,64,0.6)' : '1px solid rgba(224,112,64,0.2)',
          borderRadius: '0 0 4px 4px',
          background: 'rgba(224,112,64,0.06)',
          cursor: onLoreCollect && !loreText ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Check the trash bin"
      >
        <span style={{ color: 'rgba(224,112,64,0.4)', fontSize: 12, lineHeight: 1 }}>
          {loreText ? '✓' : '🗑'}
        </span>
      </div>

      <AnimatePresence>
        {showPuzzle && (
          <DebugChallenge
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
              border: '1px solid #E07040',
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

        {loreText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              left: 60,
              bottom: 40,
              zIndex: 10,
              color: '#E0E040',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              background: 'rgba(0,0,0,0.9)',
              border: '1px solid rgba(240,224,64,0.3)',
              borderRadius: 4,
              padding: '8px 12px',
              maxWidth: 400,
            }}
          >
            {loreText}
          </motion.div>
        )}

        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              color: '#f5f5f5',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18,
              background: 'rgba(0,0,0,0.95)',
              border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: 4,
              padding: '24px 40px',
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          >
            {easterEgg}
            <div style={{ marginTop: 16, fontSize: 11, color: '#666' }}>
              [click to dismiss]
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
