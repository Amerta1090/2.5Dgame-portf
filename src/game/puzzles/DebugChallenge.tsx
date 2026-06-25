import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const CODE_LINES = [
  { text: 'function calculateTotal(items) {', hasBug: false },
  { text: '  let sum = 0;', hasBug: false },
  { text: '  for (let i = 0; i < items.length; i++); {', hasBug: true },
  { text: '    sum += items[i].price', hasBug: true },
  { text: '  }', hasBug: false },
  { text: '  return sum', hasBug: false },
  { text: '}', hasBug: false },
  { text: '', hasBug: false },
  { text: 'const total = calculateTotal(data)', hasBug: true },
];

const BUG_LINES = [2, 3, 8];

interface DebugChallengeProps {
  onComplete: () => void;
  onClose: () => void;
}

export function DebugChallenge({ onComplete, onClose }: DebugChallengeProps) {
  const [foundBugs, setFoundBugs] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLineClick = useCallback(
    (lineIdx: number) => {
      if (foundBugs.includes(lineIdx)) return;

      if (BUG_LINES.includes(lineIdx)) {
        const newFound = [...foundBugs, lineIdx];
        setFoundBugs(newFound);

        if (newFound.length === BUG_LINES.length) {
          setTimeout(() => onComplete(), 800);
        }
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 2) {
          setTimeout(() => setShowHint(true), 1000);
        }
      }
    },
    [foundBugs, attempts, onComplete],
  );

  function handleSkip() {
    onComplete();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2
        style={{
          color: '#F0E040',
          fontFamily: "'Impact', sans-serif",
          fontSize: 24,
          marginBottom: 8,
        }}
      >
        Debug Challenge
      </h2>
      <p
        style={{
          color: '#888',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        Find all {BUG_LINES.length} bugs in the code (click on buggy lines)
      </p>
      <p
        style={{
          color: '#666',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          marginBottom: 24,
        }}
      >
        Found {foundBugs.length}/{BUG_LINES.length}
      </p>

      <motion.div
        animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.3 }}
        style={{
          background: '#0a0a12',
          border: '1px solid #2a2a3a',
          borderRadius: 4,
          padding: '16px 24px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          lineHeight: 1.8,
          marginBottom: 32,
          minWidth: 450,
        }}
      >
        <div style={{ color: '#666', marginBottom: 8, fontSize: 11 }}>
          buggy_code.js
        </div>
        {CODE_LINES.map((line, i) => {
          const isFound = foundBugs.includes(i);
          const isBug = BUG_LINES.includes(i);
          return (
            <div
              key={i}
              onClick={() => handleLineClick(i)}
              style={{
                cursor: 'pointer',
                color: isFound ? '#40E060' : isBug ? '#E04040' : '#00ff64',
                background: isFound
                  ? 'rgba(64, 224, 96, 0.08)'
                  : isBug && foundBugs.length < BUG_LINES.length
                    ? 'rgba(224, 64, 64, 0.05)'
                    : 'transparent',
                padding: '2px 4px',
                borderRadius: 2,
                transition: 'background 0.2s',
                whiteSpace: 'pre',
              }}
            >
              {String(i + 1).padStart(2, ' ')} {line.text}
              {isFound && '  // ← Bug found!'}
            </div>
          );
        })}
      </motion.div>

      {showHint && (
        <p
          style={{
            color: '#E0E040',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          Hint: Look for a semicolon after for(), missing semicolon, and unclosed parenthesis
        </p>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        {showHint && (
          <button
            onClick={handleSkip}
            style={{
              background: 'transparent',
              border: '1px solid #F0E040',
              color: '#F0E040',
              padding: '8px 24px',
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
            }}
          >
            Skip Puzzle
          </button>
        )}

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: '#888',
            padding: '8px 24px',
            borderRadius: 4,
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
