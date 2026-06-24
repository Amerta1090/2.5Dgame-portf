import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DecisionSimProps {
  onComplete: () => void;
  onClose: () => void;
}

type Phase = 'scenario' | 'outcome' | 'complete';

interface Choice {
  id: string;
  label: string;
  outcome: string;
}

const SCENARIO = {
  text: 'A tight deadline conflicts with code quality. Your team lead pushes for delivery, but you see critical issues in the codebase. How do you respond?',
  choices: [
    {
      id: 'ship',
      label: 'Ship on time, refactor later',
      outcome: '"Practical. Gets results. Sometimes perfect is the enemy of done — a lesson learned through real project experience."',
    },
    {
      id: 'delay',
      label: 'Delay for code quality',
      outcome: '"Principled. Quality matters. Shortcuts today become technical debt tomorrow — a belief earned through maintaining production systems."',
    },
    {
      id: 'negotiate',
      label: 'Negotiate scope reduction',
      outcome: '"Strategic. The mark of a leader. You find the third path — delivering value while protecting quality. This is how systems scale."',
    },
  ] satisfies Choice[],
};

export function DecisionSim({ onComplete, onClose }: DecisionSimProps) {
  const [phase, setPhase] = useState<Phase>('scenario');
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const handleChoice = useCallback(
    (choiceId: string) => {
      setSelected(choiceId);
      setPhase('outcome');
    },
    [],
  );

  const handleContinue = useCallback(() => {
    setPhase('complete');
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (phase === 'scenario' && !selected) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= SCENARIO.choices.length) {
          e.preventDefault();
          handleChoice(SCENARIO.choices[num - 1].id);
        }
      }
      if (phase === 'outcome' && (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleContinue();
      }
      if (phase === 'complete' && (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, selected, handleChoice, handleContinue, onClose]);

  useEffect(() => {
    if (attempts >= 2) {
      setShowSkip(true);
    }
  }, [attempts]);

  const selectedChoice = SCENARIO.choices.find((c) => c.id === selected);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          background: '#0A0A0A',
          border: '2px solid #F0E040',
          borderRadius: 4,
          padding: '32px 40px',
          maxWidth: 640,
          width: '90%',
        }}
      >
        {phase === 'scenario' && (
          <>
            <div
              style={{
                color: '#F0E040',
                fontFamily: "'Impact', sans-serif",
                fontSize: 14,
                letterSpacing: '0.1em',
                marginBottom: 20,
              }}
            >
              DECISION SIMULATION
            </div>

            <p
              style={{
                color: '#f5f5f5',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                lineHeight: 1.7,
                margin: '0 0 24px',
              }}
            >
              {SCENARIO.text}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SCENARIO.choices.map((choice, i) => (
                <button
                  key={choice.id}
                  onClick={() => {
                    handleChoice(choice.id);
                    setAttempts((a) => a + 1);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F0E040';
                    e.currentTarget.style.color = '#F0E040';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#555';
                    e.currentTarget.style.color = '#888';
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #555',
                    borderRadius: 4,
                    color: '#888',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    padding: '12px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                >
                  <span style={{ color: '#F0E040', marginRight: 12 }}>
                    [{i + 1}]
                  </span>
                  {choice.label}
                </button>
              ))}
            </div>

            {showSkip && (
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <button
                  onClick={() => {
                    onComplete();
                    onClose();
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #555',
                    borderRadius: 4,
                    color: '#888',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    padding: '6px 16px',
                    cursor: 'pointer',
                  }}
                >
                  Skip Puzzle →
                </button>
              </div>
            )}

            <p
              style={{
                margin: '16px 0 0',
                color: '#555',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                textAlign: 'right',
              }}
            >
              Press [1] [2] [3] to choose
            </p>
          </>
        )}

        {phase === 'outcome' && selectedChoice && (
          <>
            <div
              style={{
                color: '#40E060',
                fontFamily: "'Impact', sans-serif",
                fontSize: 14,
                letterSpacing: '0.1em',
                marginBottom: 20,
              }}
            >
              YOUR CHOICE
            </div>

            <div
              style={{
                color: '#F0E040',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                marginBottom: 16,
                padding: '8px 12px',
                border: '1px solid #F0E040',
                borderRadius: 4,
                background: 'rgba(240, 224, 64, 0.05)',
              }}
            >
              {selectedChoice.label}
            </div>

            <p
              style={{
                color: '#f5f5f5',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                lineHeight: 1.7,
                margin: '0 0 24px',
              }}
            >
              {selectedChoice.outcome}
            </p>

            <button
              onClick={handleContinue}
              style={{
                background: 'transparent',
                border: '1px solid #40E060',
                borderRadius: 4,
                color: '#40E060',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                padding: '10px 24px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Continue →
            </button>

            <p
              style={{
                margin: '12px 0 0',
                color: '#555',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                textAlign: 'right',
              }}
            >
              [Press E or Enter]
            </p>
          </>
        )}

        {phase === 'complete' && (
          <>
            <div
              style={{
                color: '#F0E040',
                fontFamily: "'Impact', sans-serif",
                fontSize: 14,
                letterSpacing: '0.1em',
                marginBottom: 20,
              }}
            >
              DECISION COMPLETE
            </div>

            <p
              style={{
                color: '#f5f5f5',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                lineHeight: 1.7,
                margin: '0 0 24px',
              }}
            >
              The path ahead is clear. Professional judgment is built through real decisions — and you've demonstrated the ability to balance delivery, quality, and strategy.
            </p>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid #F0E040',
                borderRadius: 4,
                color: '#F0E040',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                padding: '10px 24px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Close
            </button>

            <p
              style={{
                margin: '12px 0 0',
                color: '#555',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                textAlign: 'right',
              }}
            >
              [Press E or Enter]
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
