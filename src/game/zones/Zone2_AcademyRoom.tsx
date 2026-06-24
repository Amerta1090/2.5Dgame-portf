import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { useInteraction } from '@game/engine/useInteraction';
import { ZONE_WIDTHS } from '@game/constants';
import { Zone2Background } from '@game/art/backgrounds/Zone2Background';
import { CertificateFrame } from '@game/art/props/CertificateFrame';
import { HonorsPedestal } from '@game/art/props/HonorsPedestal';
import { Door, doorToInteractable } from '@game/entities/Door';
import { getAllGameData } from '@game/data';
import { TimelineSort } from '@game/puzzles/TimelineSort';
import type { ZoneId, Certification, Honor } from '@game/types';

interface Zone2AcademyRoomProps {
  onTransition: (zone: ZoneId) => void;
}

const DISPLAY_CERT_COUNT = 6;

const ZONE2_CERTS = [
  { id: 'cert-0', x: 200, y: 300 },
  { id: 'cert-1', x: 400, y: 280 },
  { id: 'cert-2', x: 600, y: 310 },
  { id: 'cert-3', x: 800, y: 290 },
  { id: 'cert-4', x: 1000, y: 300 },
  { id: 'cert-5', x: 1200, y: 280 },
];

const ZONE2_HONORS = [
  { id: 'honor-0', x: 1400, y: 340 },
  { id: 'honor-1', x: 1600, y: 340 },
  { id: 'honor-2', x: 1800, y: 340 },
];

const TIMELINE_CARDS = [
  { id: 'iot-fundamentals', label: 'IoT Fundamentals' },
  { id: 'iot-software', label: 'IoT Software & Platforms' },
  { id: 'iot-hardware', label: 'IoT Hardware' },
  { id: 'iot-esp32', label: 'ESP32 Programming' },
];

const TIMELINE_CORRECT_ORDER = ['iot-fundamentals', 'iot-software', 'iot-hardware', 'iot-esp32'];

export function Zone2AcademyRoom({ onTransition }: Zone2AcademyRoomProps) {
  const { state, dispatch } = useGameState();
  const [dialogue, setDialogue] = useState<null | 'cert' | 'honor' | 'lore'>(null);
  const [dialogueLines, setDialogueLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);

  const gameData = useMemo(() => getAllGameData(), []);
  const certs = useMemo(() => gameData.certifications.slice(0, DISPLAY_CERT_COUNT), [gameData]);
  const honors = useMemo(() => gameData.honors, [gameData]);
  const zoneWidth = ZONE_WIDTHS.zone2;
  const targetZone: ZoneId = 'zone3';
  const puzzleCompleted = state.puzzlesCompleted.includes('timeline-sort');

  const loreX = 1850;
  const puzzleX = 2150;
  const doorX = zoneWidth - 120;

  const certInteractables = useMemo(
    () => ZONE2_CERTS.map((c) => ({ id: c.id, x: c.x, y: c.y + 50, width: 80, height: 50 })),
    [],
  );

  const honorInteractables = useMemo(
    () => ZONE2_HONORS.map((h) => ({ id: h.id, x: h.x + 10, y: h.y + 50, width: 40, height: 40 })),
    [],
  );

  const zoneInteractables = useMemo(() => [
    ...certInteractables,
    ...honorInteractables,
    { id: 'lore-2', x: loreX, y: 350, width: 40, height: 60 },
    { id: 'puzzle-trigger', x: puzzleX, y: 300, width: 120, height: 80 },
    doorToInteractable('door-2', doorX, 280),
  ], [certInteractables, honorInteractables, loreX, puzzleX, doorX]);

  const nearby = useInteraction(
    state.playerPosition.x,
    state.playerPosition.y,
    zoneInteractables,
    !dialogue && !showPuzzle,
  );

  function getCertDialogueLines(cert: Certification): string[] {
    const lines = [`> ${cert.title}`];
    if (cert.issuer) lines.push(`> Issuer: ${cert.issuer}`);
    if (cert.issueDate) lines.push(`> Date: ${cert.issueDate}`);
    if (cert.credentialId) lines.push(`> ID: ${cert.credentialId}`);
    if (cert.skills.length > 0) lines.push(`> Skills: ${cert.skills.join(', ')}`);
    if (cert.url) lines.push(`> Verify: ${cert.url}`);
    lines.push('> [Collected]');
    return lines;
  }

  function getHonorDialogueLines(honor: Honor): string[] {
    const lines = [`> ${honor.title}`];
    lines.push(`> Event: ${honor.event}`);
    lines.push(`> Date: ${honor.date}`);
    if (honor.description) lines.push(`> ${honor.description}`);
    return lines;
  }

  const handleInteract = useCallback((id: string) => {
    if (id.startsWith('cert-')) {
      const idx = parseInt(id.replace('cert-', ''), 10);
      const cert = certs[idx];
      if (!cert) return;
      setDialogueLines(getCertDialogueLines(cert));
      setCurrentLine(0);
      setDialogue('cert');
      dispatch({ type: 'COLLECT_CERT', id: cert.id });
      dispatch({ type: 'INCREMENT_ATTEMPT', puzzleId: 'collect-cert' });
    } else if (id.startsWith('honor-')) {
      const idx = parseInt(id.replace('honor-', ''), 10);
      const honor = honors[idx];
      if (!honor) return;
      setDialogueLines(getHonorDialogueLines(honor));
      setCurrentLine(0);
      setDialogue('honor');
    } else if (id === 'lore-2') {
      setDialogueLines([
        'You find a hidden note behind the bookshelf:',
        '"Despite 54 certifications, he values depth over breadth."',
        '— Lore Fragment 2/9 collected',
      ]);
      setCurrentLine(0);
      setDialogue('lore');
      dispatch({ type: 'COLLECT_LORE', id: 'lf-2' });
    } else if (id === 'puzzle-trigger') {
      setShowPuzzle(true);
    } else if (id === 'door-2') {
      if (puzzleCompleted) {
        onTransition(targetZone);
      }
    }
  }, [certs, honors, dispatch, onTransition, targetZone, puzzleCompleted]);

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

  function handlePuzzleComplete() {
    dispatch({ type: 'COMPLETE_PUZZLE', id: 'timeline-sort' });
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'iot-tinkerer' });
    setShowPuzzle(false);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (showPuzzle) return;
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
  }, [dialogue, nearby, handleInteract, advanceDialogue, showPuzzle]);

  const isNearbyCert = nearby?.id?.startsWith('cert-');
  const isNearbyHonor = nearby?.id?.startsWith('honor-');
  const isNearbyLore = nearby?.id === 'lore-2';
  const isNearbyPuzzle = nearby?.id === 'puzzle-trigger';
  const isNearbyDoor = nearby?.id === 'door-2';
  const showPrompt = !dialogue && (isNearbyCert || isNearbyHonor || isNearbyLore || isNearbyPuzzle);

  return (
    <>
      <Zone2Background />

      {certs.map((cert, i) => (
        <div key={cert.id} style={{ position: 'absolute', left: ZONE2_CERTS[i].x, top: ZONE2_CERTS[i].y, zIndex: 3 }}>
          <CertificateFrame
            x={0}
            y={0}
            isNearby={nearby?.id === `cert-${i}`}
          />
        </div>
      ))}

      {honors.map((honor, i) => (
        <div key={honor.id} style={{ position: 'absolute', left: ZONE2_HONORS[i].x, top: ZONE2_HONORS[i].y, zIndex: 3 }}>
          <HonorsPedestal
            x={0}
            y={0}
            isNearby={nearby?.id === `honor-${i}`}
          />
        </div>
      ))}

      <div
        style={{
          position: 'absolute',
          left: loreX,
          top: 350,
          width: 40,
          height: 60,
          zIndex: 3,
          background: 'rgba(212, 160, 23, 0.04)',
          borderRadius: 2,
          border: nearby?.id === 'lore-2' ? '1px solid rgba(212, 160, 23, 0.3)' : '1px solid transparent',
          transition: 'border-color 0.3s',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: puzzleX,
          top: 300,
          width: 120,
          height: 80,
          zIndex: 3,
          border: isNearbyPuzzle ? '2px solid #F0E040' : '2px solid #555',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
          background: isNearbyPuzzle ? 'rgba(240, 224, 64, 0.05)' : 'rgba(0,0,0,0.3)',
          transition: 'border-color 0.3s, background 0.3s',
          boxShadow: isNearbyPuzzle ? '0 0 12px rgba(240, 224, 64, 0.2)' : 'none',
        }}
      >
        <span style={{ color: '#F0E040', fontSize: 20 }}>⏱</span>
        <span style={{ color: '#888', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
          Timeline Puzzle
        </span>
      </div>

      <Door
        x={doorX}
        y={280}
        targetZone={targetZone}
        isNearby={isNearbyDoor}
        onTransition={puzzleCompleted ? onTransition : undefined}
      />

      {!puzzleCompleted && (
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
          🔒 Solve puzzle first
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

      <AnimatePresence>
        {showPuzzle && (
          <TimelineSort
            cards={TIMELINE_CARDS}
            correctOrder={TIMELINE_CORRECT_ORDER}
            onComplete={handlePuzzleComplete}
            onClose={() => setShowPuzzle(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
