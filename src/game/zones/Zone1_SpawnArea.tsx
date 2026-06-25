import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { useInteraction } from '@game/engine/useInteraction';
import { ZONE_WIDTHS } from '@game/constants';
import { Zone1Background } from '@game/art/backgrounds/Zone1Background';
import { Terminal } from '@game/art/props/Terminal';
import { FilingCabinet } from '@game/art/props/FilingCabinet';
import { Door } from '@game/entities/Door';
import { DialogueBox } from '@game/ui/DialogueBox';
import { getAllGameData } from '@game/data';
import type { ZoneId } from '@game/types';

interface Zone1SpawnAreaProps {
  onTransition: (zone: ZoneId) => void;
}

export function Zone1SpawnArea({ onTransition }: Zone1SpawnAreaProps) {
  const { state, dispatch } = useGameState();
  const [dialogue, setDialogue] = useState<null | 'terminal' | 'lore'>(null);
  const [dialogueLines, setDialogueLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [easterEgg, setEasterEgg] = useState<string | null>(null);

  const profileData = useMemo(() => getAllGameData().profile, []);
  const zoneWidth = ZONE_WIDTHS.zone1;
  const targetZone: ZoneId = 'zone2';

  const zoneInteractables = useMemo(() => [
    { id: 'terminal', x: 100, y: 380, width: 80, height: 60 },
    { id: 'filing-cabinet', x: 800, y: 360, width: 60, height: 100 },
    { id: 'door-1', x: zoneWidth - 120, y: 300, width: 80, height: 120 },
  ], [zoneWidth]);

  const nearby = useInteraction(
    state.playerPosition.x,
    state.playerPosition.y,
    zoneInteractables,
    !dialogue,
  );

  const handleInteract = useCallback((id: string) => {
    if (id === 'terminal') {
      const lines = [
        `> ${profileData.name}`,
        `> ${profileData.headline}`,
        `> "${profileData.tagline}"`,
        `> ${profileData.location}`,
        `> ${profileData.metrics.yearsExperience} years experience`,
        `> ${profileData.metrics.projectsShipped} projects shipped`,
        `> ${profileData.metrics.certifications} certifications`,
      ];
      setDialogueLines(lines);
      setCurrentLine(0);
      setDialogue('terminal');
      dispatch({ type: 'COLLECT_CERT', id: 'terminal-profile' });
    } else if (id === 'filing-cabinet') {
      setDialogueLines([
        'You find a hidden note:',
        '"The subject began their journey in a small town..."',
        '— Lore Fragment 1/9 collected',
      ]);
      setCurrentLine(0);
      setDialogue('lore');
      dispatch({ type: 'COLLECT_LORE', id: 'lf-1' });
    } else if (id === 'door-1') {
      onTransition(targetZone);
    }
  }, [dispatch, onTransition, profileData, targetZone]);

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
  }, [dialogue, nearby, handleInteract, advanceDialogue]);

  const isNearbyTerminal = nearby?.id === 'terminal';
  const isNearbyCabinet = nearby?.id === 'filing-cabinet';
  const showPrompt = !dialogue && (isNearbyTerminal || isNearbyCabinet);

  return (
    <>
      <Zone1Background />

      <div style={{ position: 'absolute', left: 100, top: 380, zIndex: 3 }}>
        <Terminal x={0} y={0} />
      </div>

      <div style={{ position: 'absolute', left: 800, top: 360, zIndex: 3 }}>
        <FilingCabinet x={0} y={0} />
      </div>

      <div style={{ position: 'absolute', left: 870, top: 360, zIndex: 3 }}>
        <FilingCabinet x={0} y={0} drawers={3} />
      </div>

      <div
        onClick={() => setEasterEgg(
          easterEgg
            ? null
            : `25DGAME v${import.meta.env?.PACKAGE_VERSION || '1.0'} — Built with Astro + React + TypeScript + Framer Motion. ${state.playTime > 0 ? `Session time: ${Math.floor(state.playTime / 60)}m` : 'You just started!'}`
        )}
        style={{
          position: 'absolute',
          left: 1600,
          top: 340,
          width: 40,
          height: 60,
          zIndex: 4,
          border: '1px solid rgba(0, 255, 100, 0.12)',
          borderRadius: 2,
          background: 'rgba(0, 255, 100, 0.03)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="A hidden dev terminal..."
      >
        <span style={{ color: 'rgba(0, 255, 100, 0.3)', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
          &lt;/&gt;
        </span>
      </div>

      <Door
        x={zoneWidth - 120}
        y={300}
        targetZone={targetZone}
        isNearby={nearby?.id === 'door-1'}
        onTransition={onTransition}
      />

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

      <DialogueBox
        visible={dialogue !== null}
        lines={dialogueLines}
        currentLine={currentLine}
        speaker={dialogue === 'terminal' ? 'SYSTEM TERMINAL' : 'INVESTIGATION LOG'}
        onAdvance={advanceDialogue}
        onClose={closeDialogue}
      />

      {easterEgg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEasterEgg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            cursor: 'pointer',
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              background: '#0A0A0A',
              border: '1px solid rgba(0, 255, 100, 0.3)',
              borderRadius: 4,
              padding: '24px 32px',
              maxWidth: 500,
              color: '#00ff64',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            {easterEgg}
            <div style={{ marginTop: 16, color: '#555', fontSize: 11 }}>
              [click to dismiss]
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
