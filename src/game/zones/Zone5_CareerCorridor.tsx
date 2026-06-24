import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { useInteraction } from '@game/engine/useInteraction';
import { ZONE_WIDTHS } from '@game/constants';
import { Zone5Background } from '@game/art/backgrounds/Zone5Background';
import { StationKiosk } from '@game/art/props/StationKiosk';
import { Door, doorToInteractable } from '@game/entities/Door';
import { DecisionSim } from '@game/puzzles/DecisionSim';
import { getAllGameData } from '@game/data';
import type { ZoneId, Experience, Volunteering } from '@game/types';

interface Zone5CareerCorridorProps {
  onTransition: (zone: ZoneId) => void;
}

function formatPeriod(startDate: string, endDate: string | null): string {
  const fmt = (d: string) => {
    const [y, m] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  };
  return `${fmt(startDate)} — ${endDate ? fmt(endDate) : 'Present'}`;
}

const TYPE_COLORS: Record<string, string> = {
  'full-time contract': '#4080E0',
  'part-time': '#E07040',
  'contract': '#E0E040',
  'internship': '#40E060',
};

const STATION_POSITIONS = [
  { id: 'ferswit', x: 350 },
  { id: 'forum-asisten', x: 750 },
  { id: 'amikom-ai', x: 1150 },
  { id: 'aksoro', x: 1550 },
  { id: 'bangkit', x: 1950 },
  { id: 'samsung-innovation', x: 2350 },
  { id: 'idcamp', x: 2750 },
];

export function Zone5CareerCorridor({ onTransition }: Zone5CareerCorridorProps) {
  const { state, dispatch } = useGameState();
  const [dialogue, setDialogue] = useState<null | 'station' | 'volunteering' | 'lore'>(null);
  const [dialogueLines, setDialogueLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [activeStation, setActiveStation] = useState<Experience | null>(null);
  const [showDecision, setShowDecision] = useState(false);

  const gameData = useMemo(() => getAllGameData(), []);
  const experiences = useMemo(() => gameData.experiences, [gameData]);
  const volunteering = useMemo(() => gameData.volunteering[0], [gameData]);

  const zoneWidth = ZONE_WIDTHS.zone5;
  const targetZone: ZoneId = 'zone6';
  const decisionCompleted = state.puzzlesCompleted.includes('decision-sim');
  const decisionX = 3200;
  const doorX = zoneWidth - 120;
  const loreX = 3550;
  const volX = 2950;

  const stationInteractables = useMemo(
    () => STATION_POSITIONS.map((sp) => ({
      id: `station-${sp.id}`,
      x: sp.x - 40,
      y: 250,
      width: 80,
      height: 120,
    })),
    [],
  );

  const zoneInteractables = useMemo(
    () => [
      ...stationInteractables,
      { id: 'volunteering', x: volX, y: 300, width: 100, height: 80 },
      { id: 'decision-trigger', x: decisionX, y: 280, width: 100, height: 80 },
      { id: 'lore-8', x: loreX, y: 340, width: 40, height: 50 },
      doorToInteractable('door-5', doorX, 280),
    ],
    [stationInteractables, volX, decisionX, loreX, doorX],
  );

  const nearby = useInteraction(
    state.playerPosition.x,
    state.playerPosition.y,
    zoneInteractables,
    !dialogue && !showDecision,
  );

  function getStationDialogueLines(exp: Experience): string[] {
    const lines: string[] = [];
    lines.push(`> ${exp.role}`);
    lines.push(`> ${exp.company}`);
    lines.push(`> ${formatPeriod(exp.startDate, exp.endDate)}`);
    lines.push(`> Type: ${exp.type}`);
    if (exp.location) lines.push(`> ${exp.location}`);
    lines.push('');
    exp.highlights.forEach((h) => lines.push(`  • ${h}`));
    if (exp.technologies.length > 0) {
      lines.push('');
      lines.push(`> Tech: ${exp.technologies.join(', ')}`);
    }
    return lines;
  }

  function getVolunteeringDialogueLines(v: Volunteering): string[] {
    return [
      `> ${v.role}`,
      `> ${v.organization}`,
      `> Cause: ${v.cause}`,
      `> ${formatPeriod(v.startDate, v.endDate)}`,
      '',
      ...v.highlights.map((h) => `  • ${h}`),
    ];
  }

  const handleInteract = useCallback(
    (id: string) => {
      if (id.startsWith('station-')) {
        const expId = id.replace('station-', '');
        const exp = experiences.find((e) => e.id === expId);
        if (!exp) return;
        setActiveStation(exp);
        setDialogueLines(getStationDialogueLines(exp));
        setCurrentLine(0);
        setDialogue('station');
        dispatch({ type: 'INCREMENT_ATTEMPT', puzzleId: 'visit-station' });
      } else if (id === 'volunteering') {
        if (!volunteering) return;
        setDialogueLines(getVolunteeringDialogueLines(volunteering));
        setCurrentLine(0);
        setDialogue('volunteering');
        void 0; // track volunteering read
      } else if (id === 'decision-trigger') {
        setShowDecision(true);
      } else if (id === 'lore-8') {
        setDialogueLines([
          'You water the plant and find a note tucked under the pot:',
          '"Every workplace taught me something about people, systems, and purpose."',
          '— Lore Fragment 8/9 collected',
        ]);
        setCurrentLine(0);
        setDialogue('lore');
        dispatch({ type: 'COLLECT_LORE', id: 'lf-8' });
      } else if (id === 'door-5') {
        if (decisionCompleted) {
          onTransition(targetZone);
        }
      }
    },
    [experiences, volunteering, dispatch, onTransition, targetZone, decisionCompleted],
  );

  const closeDialogue = useCallback(() => {
    setDialogue(null);
    setCurrentLine(0);
    setActiveStation(null);
  }, []);

  const advanceDialogue = useCallback(() => {
    if (currentLine < dialogueLines.length - 1) {
      setCurrentLine((c) => c + 1);
    } else {
      closeDialogue();
    }
  }, [currentLine, dialogueLines.length, closeDialogue]);

  function handleDecisionComplete() {
    dispatch({ type: 'COMPLETE_PUZZLE', id: 'decision-sim' });
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'decision-maker' });
    dispatch({ type: 'COMPLETE_ZONE', zone: 'zone5' });
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (showDecision) return;
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
  }, [dialogue, nearby, handleInteract, advanceDialogue, showDecision]);

  const isNearbyStation = nearby?.id?.startsWith('station-');
  const isNearbyVol = nearby?.id === 'volunteering';
  const isNearbyDecision = nearby?.id === 'decision-trigger';
  const isNearbyLore = nearby?.id === 'lore-8';
  const isNearbyDoor = nearby?.id === 'door-5';
  const showPrompt = !dialogue && (isNearbyStation || isNearbyVol || isNearbyDecision || isNearbyLore);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Zone5Background />

      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          color: '#F0E040',
          fontFamily: "'Impact', sans-serif",
          fontSize: 14,
          letterSpacing: '0.1em',
        }}
      >
        CAREER CORRIDOR
      </div>

      <div
        style={{
          position: 'absolute',
          top: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          color: '#888',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
        }}
      >
        {decisionCompleted ? '✓ Career explored' : 'Explore all stations → make your decision'}
      </div>

      {experiences.map((exp) => {
        const pos = STATION_POSITIONS.find((sp) => sp.id === exp.id);
        if (!pos) return null;
        return (
          <div key={exp.id}>
            <StationKiosk
              x={pos.x}
              y={240}
              company={exp.company}
              isNearby={nearby?.id === `station-${exp.id}`}
            />
            <div
              style={{
                position: 'absolute',
                left: pos.x - 40,
                top: 370,
                width: 80,
                textAlign: 'center',
                zIndex: 3,
              }}
            >
              <span
                style={{
                  color: '#555',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 7,
                  display: 'block',
                }}
              >
                {exp.role.length > 30 ? exp.role.slice(0, 28) + '...' : exp.role}
              </span>
              <span
                style={{
                  color: TYPE_COLORS[exp.type] ?? '#888',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 6,
                  display: 'block',
                  marginTop: 2,
                }}
              >
                {exp.type}
              </span>
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: volX,
          top: 300,
          width: 100,
          height: 80,
          zIndex: 5,
          border: isNearbyVol ? '2px solid #40E060' : '2px solid #555',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
          background: isNearbyVol ? 'rgba(64, 224, 96, 0.05)' : 'rgba(0,0,0,0.3)',
          transition: 'border-color 0.3s, background 0.3s',
          boxShadow: isNearbyVol ? '0 0 12px rgba(64, 224, 96, 0.2)' : 'none',
        }}
      >
        <span style={{ color: '#40E060', fontSize: 16 }}>🤝</span>
        <span style={{ color: '#888', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
          Volunteering
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: decisionX,
          top: 280,
          width: 100,
          height: 80,
          zIndex: 5,
          border: isNearbyDecision ? '2px solid #F0E040' : '2px solid #555',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
          background: isNearbyDecision ? 'rgba(240, 224, 64, 0.05)' : 'rgba(0,0,0,0.3)',
          transition: 'border-color 0.3s, background 0.3s',
          boxShadow: isNearbyDecision ? '0 0 12px rgba(240, 224, 64, 0.2)' : 'none',
        }}
      >
        <span style={{ color: '#F0E040', fontSize: 18 }}>⚖</span>
        <span style={{ color: '#888', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
          {decisionCompleted ? '✓ Decision Made' : 'Make Decision'}
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: loreX,
          top: 340,
          width: 40,
          height: 50,
          zIndex: 3,
          background: isNearbyLore ? 'rgba(64, 224, 96, 0.08)' : 'rgba(64, 224, 96, 0.02)',
          borderRadius: '50% 50% 0 0',
          border: isNearbyLore ? '1px solid rgba(64, 224, 96, 0.3)' : '1px solid transparent',
          transition: 'border-color 0.3s, background 0.3s',
        }}
      />

      <Door
        x={doorX}
        y={280}
        targetZone={targetZone}
        isNearby={isNearbyDoor}
        onTransition={decisionCompleted ? onTransition : undefined}
      />

      {!decisionCompleted && (
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
          🔒 Complete the simulation
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
                fontSize: 14,
                lineHeight: 1.6,
                maxHeight: '70vh',
                overflowY: 'auto',
              }}
            >
              {activeStation && (
                <div
                  style={{
                    color: TYPE_COLORS[activeStation.type] ?? '#F0E040',
                    fontFamily: "'Impact', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    marginBottom: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  {activeStation.type} — {activeStation.company}
                </div>
              )}
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
        {showDecision && (
          <DecisionSim
            onComplete={handleDecisionComplete}
            onClose={() => setShowDecision(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
