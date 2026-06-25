import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zone3IoTWorkshop } from '@game/art/backgrounds/Zone3IoTWorkshop';
import { getAllGameData } from '@game/data';
import { LabWorkbench } from '@game/art/props/LabWorkbench';
import { ComponentConnect } from '@game/puzzles/ComponentConnect';

interface IoT_WorkshopProps {
  onPuzzleComplete: (id: string) => void;
  puzzleCompleted: boolean;
  onLoreCollect?: (id: string) => void;
}

export function IoT_Workshop({ onPuzzleComplete, puzzleCompleted, onLoreCollect }: IoT_WorkshopProps) {
  const skills = useMemo(
    () => getAllGameData().skills.find((c) => c.name === 'IoT & Embedded Systems'),
    [],
  );
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [loreText, setLoreText] = useState<string | null>(null);

  const handlePuzzleDone = useCallback(() => {
    onPuzzleComplete('component-connect');
    setShowPuzzle(false);
  }, [onPuzzleComplete]);

  const handleLoreClick = useCallback(() => {
    if (!onLoreCollect || loreText) return;
    onLoreCollect('lf-6');
    setLoreText('Inside a component drawer: a note reads "Check the parts bin — every component has a story." — LF-6');
    setTimeout(() => setLoreText(null), 4000);
  }, [onLoreCollect, loreText]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Zone3IoTWorkshop />

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          color: '#40E060',
          fontFamily: "'Impact', sans-serif",
          fontSize: 16,
          letterSpacing: '0.1em',
        }}
      >
        IOT WORKSHOP
      </div>

      <LabWorkbench x={100} y={220} accent="#40E060" />

      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 300,
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
              background: showDetail === skill.name ? 'rgba(64,224,96,0.1)' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid #40E060',
                position: 'relative',
                overflow: 'hidden',
                background: '#081a12',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${(skill.proficiency / 5) * 100}%`,
                  background: 'linear-gradient(0deg, #40E060, rgba(64,224,96,0.3))',
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
            border: '2px solid #40E060',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 4,
            cursor: 'pointer',
            background: 'rgba(64,224,96,0.05)',
            transition: 'background 0.2s',
          }}
        >
          <span style={{ color: '#40E060', fontFamily: "'Impact', sans-serif", fontSize: 11 }}>
            COMPONENT CONNECT
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
        onClick={handleLoreClick}
        style={{
          position: 'absolute',
          left: 140,
          top: 230,
          width: 44,
          height: 28,
          zIndex: 5,
          border: loreText ? '1px solid rgba(64,224,96,0.6)' : '1px solid rgba(64,224,96,0.2)',
          borderRadius: 2,
          background: 'rgba(64,224,96,0.06)',
          cursor: onLoreCollect && !loreText ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Check the components drawer"
      >
        <span style={{ color: 'rgba(64,224,96,0.4)', fontSize: 11 }}>
          {loreText ? '✓' : '⚙'}
        </span>
      </div>

      <AnimatePresence>
        {showPuzzle && (
          <ComponentConnect
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
              top: 520,
              zIndex: 10,
              color: '#f5f5f5',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              background: 'rgba(0,0,0,0.9)',
              border: '1px solid #40E060',
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
      </AnimatePresence>
    </div>
  );
}
