import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { Zone6Background } from '@game/art/backgrounds/Zone6Background';
import { Pedestal } from '@game/art/props/Pedestal';
import { getAllGameData } from '@game/data';

const MONOLOGUE_LINES = [
  "You've explored the data, the projects, the work.",
  'Now you want to know: why?',
  'To build systems that matter.',
  'To bridge the gap between intelligence and action.',
  'To prove that a kid from Tulungagung can shape the future of AI.',
  'This is not the end. This is where I begin.',
];

const MONOLOGUE_TYPING_SPEED = 50;

function TypewriterText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const completedRef = useRef(false);

  useEffect(() => {
    let i = 0;
    completedRef.current = false;
    setDisplayed('');

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      }
    }, MONOLOGUE_TYPING_SPEED);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <>{displayed}</>;
}

export function Zone6FinalRoom() {
  const { state, dispatch } = useGameState();
  const [phase, setPhase] = useState<'monologue' | 'stats' | 'credits'>('monologue');
  const [currentLine, setCurrentLine] = useState(0);
  const [lineTyped, setLineTyped] = useState(false);
  const [showPedestal, setShowPedestal] = useState(false);

  const gameData = useMemo(() => getAllGameData(), []);

  const journeyStats = useMemo(
    () => [
      { label: 'Certifications collected', value: state.collectedCertIds.length || gameData.certifications.length.toString() },
      { label: 'Projects built', value: gameData.projects.length.toString() },
      { label: 'Skills mastered', value: gameData.skills.reduce((sum, cat) => sum + cat.skills.length, 0).toString() },
      { label: 'Years grinding', value: gameData.profile.metrics.yearsExperience.toString() + '+' },
    ],
    [state.collectedCertIds.length, gameData],
  );

  useEffect(() => {
    dispatch({ type: 'COLLECT_LORE', id: 'lf-9' });
    dispatch({ type: 'COMPLETE_ZONE', zone: 'zone6' });
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'inner-circle' });
  }, [dispatch]);

  const handleLineTyped = useCallback(() => {
    setLineTyped(true);
  }, []);

  const advanceLine = useCallback(() => {
    if (phase === 'credits') return;

    if (phase === 'monologue') {
      if (!lineTyped) {
        setLineTyped(true);
        return;
      }
      if (currentLine < MONOLOGUE_LINES.length - 1) {
        setCurrentLine((c) => c + 1);
        setLineTyped(false);
      } else {
        setPhase('stats');
        setLineTyped(false);
      }
    } else if (phase === 'stats') {
      setPhase('credits');
    }
  }, [phase, currentLine, lineTyped]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advanceLine();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advanceLine]);

  useEffect(() => {
    if (phase === 'stats') {
      setShowPedestal(true);
    }
  }, [phase]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Zone6Background />

      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <Pedestal
          x={-40}
          y={0}
          scale={1.5}
          isNearby={showPedestal}
        />
      </div>

      <AnimatePresence>
         {(phase === 'monologue' || phase === 'stats') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(3px)',
              paddingBottom: '4vh',
            }}
            onClick={advanceLine}
          >
            <motion.div
              initial={{ y: 80, rotate: -1.5, opacity: 0 }}
              animate={{ y: 0, rotate: -1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              style={{
                background: '#0E0E0E',
                border: '3px solid #FFE600',
                boxShadow: '10px 10px 0px #E03030',
                padding: '32px 40px',
                maxWidth: 700,
                width: '80%',
                color: '#f5f5f5',
                position: 'relative',
                transform: 'skewX(-4deg)',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              {/* Speaker Label */}
              <div
                style={{
                  position: 'absolute',
                  top: -24,
                  left: 20,
                  background: '#FFE600',
                  color: '#0E0E0E',
                  padding: '4px 16px',
                  fontWeight: 900,
                  fontFamily: "'Impact', sans-serif",
                  fontSize: 14,
                  letterSpacing: '0.05em',
                  boxShadow: '4px 4px 0px #E03030',
                  transform: 'skewX(-6deg) rotate(-1.5deg)',
                }}
              >
                {phase === 'monologue' ? 'THE COGNITIVE CORE' : 'JOURNEY SUMMARY'}
              </div>

              {/* Unskewed Content Wrapper */}
              <div style={{ transform: 'skewX(4deg)', fontFamily: "'JetBrains Mono', monospace" }}>
                {phase === 'monologue' && (
                <>
                  <div
                    style={{
                      color: '#F0E040',
                      fontFamily: "'Impact', sans-serif",
                      fontSize: 13,
                      letterSpacing: '0.1em',
                      marginBottom: 20,
                    }}
                  >
                    FINAL ROOM
                  </div>

                  <p style={{ margin: 0, minHeight: '1.6em', whiteSpace: 'pre-wrap' }}>
                    {lineTyped ? (
                      MONOLOGUE_LINES[currentLine]
                    ) : (
                      <TypewriterText
                        text={MONOLOGUE_LINES[currentLine]}
                        onComplete={handleLineTyped}
                      />
                    )}
                    {!lineTyped && (
                      <span
                        style={{
                          animation: 'pulse 0.6s step-end infinite',
                          color: '#F0E040',
                        }}
                      >
                        ▌
                      </span>
                    )}
                  </p>

                  <p
                    style={{
                      margin: '20px 0 0',
                      color: '#888',
                      fontSize: 12,
                      textAlign: 'right',
                    }}
                  >
                    {lineTyped
                      ? currentLine < MONOLOGUE_LINES.length - 1
                        ? '[Press E for next]'
                        : '[Press E to continue]'
                      : '[Typing...]'}
                  </p>
                </>
              )}

              {phase === 'stats' && (
                <>
                  <div
                    style={{
                      color: '#F0E040',
                      fontFamily: "'Impact', sans-serif",
                      fontSize: 13,
                      letterSpacing: '0.1em',
                      marginBottom: 24,
                    }}
                  >
                    JOURNEY SUMMARY
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 20,
                      marginBottom: 24,
                    }}
                  >
                    {journeyStats.map((stat) => (
                      <div
                        key={stat.label}
                        style={{
                          textAlign: 'center',
                          padding: '16px 12px',
                          border: '1px solid rgba(240, 224, 64, 0.15)',
                          borderRadius: 4,
                          background: 'rgba(240, 224, 64, 0.03)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 32,
                            fontWeight: 900,
                            color: '#F0E040',
                            fontFamily: "'Impact', sans-serif",
                            lineHeight: 1,
                            marginBottom: 6,
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            color: '#888',
                            fontSize: 11,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      margin: '0 0 20px',
                      color: '#888',
                      fontSize: 12,
                      textAlign: 'center',
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    Thank you for exploring the mind, work, and identity of Abdul Majid Ridwan.
                  </p>

                  <p
                    style={{
                      margin: '0 0 20px',
                      color: '#f5f5f5',
                      fontSize: 12,
                      textAlign: 'center',
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}
                  >
                    "For the next explorer who finds this room — keep building, keep wondering, keep pushing the boundary of what's possible."
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: '#888',
                      fontSize: 12,
                      textAlign: 'right',
                    }}
                  >
                    [Press E to finish]
                  </p>
                </>
              )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'credits' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0A0A0A',
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                textAlign: 'center',
                maxWidth: 500,
              }}
            >
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: '#F0E040',
                  fontFamily: "'Impact', sans-serif",
                  letterSpacing: '0.05em',
                  marginBottom: 16,
                }}
              >
                25DGAME
              </div>

              <div
                style={{
                  color: '#888',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.8,
                  marginBottom: 32,
                }}
              >
                Built with Astro, React, TypeScript, Tailwind CSS, and Framer Motion.
                <br />
                All portfolio data sourced from local JSON files.
                <br />
                <br />
                Designed and developed as an interactive portfolio experience.
                <br />
                <br />
                <span style={{ color: '#F0E040' }}>
                  "This is unlike any portfolio I've ever seen."
                </span>
              </div>

              <button
                onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'title' })}
                style={{
                  background: 'transparent',
                  border: '2px solid #F0E040',
                  borderRadius: 4,
                  color: '#F0E040',
                  fontFamily: "'Impact', sans-serif",
                  fontSize: 16,
                  padding: '12px 40px',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                }}
              >
                ★ CREDITS
              </button>

              <div
                style={{
                  marginTop: 32,
                  color: '#555',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                }}
              >
                [Press E or click to return to title]
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'credits' && <CreditsKeyHandler dispatch={dispatch} />}
    </div>
  );
}

function CreditsKeyHandler({ dispatch }: { dispatch: ReturnType<typeof useGameState>['dispatch'] }) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dispatch({ type: 'SET_SCREEN', screen: 'title' });
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);
  return null;
}
