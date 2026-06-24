import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { useInteraction } from '@game/engine/useInteraction';
import { ZONE_WIDTHS } from '@game/constants';
import { Zone3HubBackground } from '@game/art/backgrounds/Zone3HubBackground';
import { Door, doorToInteractable } from '@game/entities/Door';
import { AI_Lab } from './subrooms/AI_Lab';
import { Web_Studio } from './subrooms/Web_Studio';
import { IoT_Workshop } from './subrooms/IoT_Workshop';
import type { ZoneId } from '@game/types';

interface Zone3WorkshopProps {
  onTransition: (zone: ZoneId) => void;
}

type Subroom = 'hub' | 'ai-lab' | 'web-studio' | 'iot-workshop';

export function Zone3Workshop({ onTransition }: Zone3WorkshopProps) {
  const { state, dispatch } = useGameState();
  const [subroom, setSubroom] = useState<Subroom>('hub');
  const [dialogue, setDialogue] = useState<null | 'lore'>(null);
  const [dialogueLines, setDialogueLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  const zoneWidth = ZONE_WIDTHS.zone3;
  const targetZone: ZoneId = 'zone4';
  const puzzlesCompleted = state.puzzlesCompleted;
  const completedCount = ['ai-pipeline', 'debug-challenge', 'component-connect'].filter(
    (id) => puzzlesCompleted.includes(id),
  ).length;
  const puzzlesMet = completedCount >= 2;
  const doorX = zoneWidth - 120;
  const loreX = 1400;

  const hubInteractables = useMemo(
    () => [
      { id: 'door-ai', x: 200, y: 300, width: 120, height: 80 },
      { id: 'door-web', x: 600, y: 300, width: 120, height: 80 },
      { id: 'door-iot', x: 1000, y: 300, width: 120, height: 80 },
      { id: 'lore-3', x: loreX, y: 350, width: 60, height: 40 },
      doorToInteractable('door-3', doorX, 280),
    ],
    [doorX, loreX],
  );

  const nearby = useInteraction(
    state.playerPosition.x,
    state.playerPosition.y,
    subroom === 'hub' ? hubInteractables : [],
    subroom === 'hub' && !dialogue,
  );

  const handleInteract = useCallback(
    (id: string) => {
      if (id === 'door-ai') {
        setSubroom('ai-lab');
      } else if (id === 'door-web') {
        setSubroom('web-studio');
      } else if (id === 'door-iot') {
        setSubroom('iot-workshop');
      } else if (id === 'lore-3') {
        setDialogueLines([
          'You find a note under the rug:',
          '"The floor seems uneven..."',
          '— Lore Fragment 3/9 collected',
        ]);
        setCurrentLine(0);
        setDialogue('lore');
        dispatch({ type: 'COLLECT_LORE', id: 'lf-3' });
      } else if (id === 'door-3') {
        if (puzzlesMet) {
          onTransition(targetZone);
        }
      }
    },
    [dispatch, onTransition, targetZone, puzzlesMet],
  );

  const handleSubroomPuzzleComplete = useCallback(
    (puzzleId: string) => {
      dispatch({ type: 'COMPLETE_PUZZLE', id: puzzleId });
      if (puzzleId === 'ai-pipeline') {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'ai-apprentice' });
      } else if (puzzleId === 'debug-challenge') {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'web-weaver' });
      } else if (puzzleId === 'component-connect') {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'iot-tinkerer' });
      }
    },
    [dispatch],
  );

  const closeDialogue = useCallback(() => {
    setDialogue(null);
    setCurrentLine(0);
  }, []);

  const advanceDialogue = useCallback(() => {
    if (currentLine < dialogueLines.length - 1) {
      setCurrentLine((c) => c + 1);
    } else {
      closeDialogue();
    }
  }, [currentLine, dialogueLines.length, closeDialogue]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (subroom !== 'hub') return;
      if (dialogue) {
        if (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceDialogue();
        }
        return;
      }

      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearby) {
        e.preventDefault();
        handleInteract(nearby.id);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [subroom, dialogue, nearby, handleInteract, advanceDialogue]);

  const isNearbyDoorExit = nearby?.id === 'door-3';
  const showPrompt =
    subroom === 'hub' && !dialogue && nearby && nearby.id !== 'door-3';

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {subroom === 'hub' && (
        <>
          <Zone3HubBackground />

          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 5,
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: 14,
              letterSpacing: '0.1em',
            }}
          >
            WORKSHOP
          </div>

          <div
            style={{
              position: 'absolute',
              top: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 5,
              color: '#888',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
            }}
          >
            Puzzles completed: {completedCount}/3 (need 2)
          </div>

          {[
            { id: 'door-ai', x: 200, label: 'AI Lab', color: '#4080E0' },
            { id: 'door-web', x: 600, label: 'Web Studio', color: '#E07040' },
            { id: 'door-iot', x: 1000, label: 'IoT Workshop', color: '#40E060' },
          ].map((door) => (
            <div
              key={door.id}
              style={{
                position: 'absolute',
                left: door.x,
                top: 260,
                width: 120,
                height: 120,
                zIndex: 4,
                cursor: 'pointer',
                border: nearby?.id === door.id ? `2px solid ${door.color}` : '2px solid transparent',
                borderRadius: 4,
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxShadow: nearby?.id === door.id ? `0 0 16px ${door.color}40` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  color: nearby?.id === door.id ? door.color : '#555',
                  fontFamily: "'Impact', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.05em',
                  transition: 'color 0.3s',
                }}
              >
                {nearby?.id === door.id ? `▶ ${door.label}` : door.label}
              </span>
            </div>
          ))}

          <div
            style={{
              position: 'absolute',
              left: loreX,
              top: 350,
              width: 60,
              height: 40,
              zIndex: 3,
              background: 'rgba(240, 224, 64, 0.04)',
              borderRadius: 2,
              border:
                nearby?.id === 'lore-3'
                  ? '1px solid rgba(240, 224, 64, 0.3)'
                  : '1px solid transparent',
              transition: 'border-color 0.3s',
            }}
          />

          <Door
            x={doorX}
            y={280}
            targetZone={targetZone}
            isNearby={isNearbyDoorExit}
            onTransition={puzzlesMet ? onTransition : undefined}
          />

          {!puzzlesMet && (
            <div
              style={{
                position: 'absolute',
                left: doorX,
                top: 260,
                width: 80,
                textAlign: 'center',
                color: '#E04040',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                zIndex: 6,
              }}
            >
              🔒 Complete 2 puzzles
            </div>
          )}

          {showPrompt && (
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                color: '#F0E040',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                background: 'rgba(0,0,0,0.8)',
                padding: '8px 16px',
                borderRadius: 4,
                border: '1px solid #F0E040',
              }}
            >
              Press <span style={{ fontWeight: 700 }}>E</span> to interact
            </div>
          )}

          <AnimatePresence>
            {dialogue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.85)',
                }}
                onClick={advanceDialogue}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  style={{
                    background: '#0A0A0A',
                    border: '2px solid #F0E040',
                    borderRadius: 4,
                    padding: '24px 32px',
                    maxWidth: 600,
                    width: '80%',
                    color: '#f5f5f5',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 16,
                    lineHeight: 1.6,
                  }}
                >
                  <p style={{ margin: 0, minHeight: '1.6em', whiteSpace: 'pre-wrap' }}>
                    {dialogueLines[currentLine]}
                  </p>
                  <p
                    style={{
                      margin: '16px 0 0',
                      color: '#888',
                      fontSize: 12,
                      textAlign: 'right',
                    }}
                  >
                    {currentLine < dialogueLines.length - 1
                      ? '[Press E to continue]'
                      : '[Press E to close]'}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {subroom === 'ai-lab' && (
        <AI_Lab
          onPuzzleComplete={handleSubroomPuzzleComplete}
          puzzleCompleted={puzzlesCompleted.includes('ai-pipeline')}
        />
      )}

      {subroom === 'web-studio' && (
        <Web_Studio
          onPuzzleComplete={handleSubroomPuzzleComplete}
          puzzleCompleted={puzzlesCompleted.includes('debug-challenge')}
        />
      )}

      {subroom === 'iot-workshop' && (
        <IoT_Workshop
          onPuzzleComplete={handleSubroomPuzzleComplete}
          puzzleCompleted={puzzlesCompleted.includes('component-connect')}
        />
      )}

      {subroom !== 'hub' && (
        <div
          onClick={() => setSubroom('hub')}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 20,
            color: '#888',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            cursor: 'pointer',
            padding: '6px 12px',
            border: '1px solid #555',
            borderRadius: 4,
            background: 'rgba(0,0,0,0.7)',
          }}
        >
          ← Back to Hub
        </div>
      )}
    </div>
  );
}
