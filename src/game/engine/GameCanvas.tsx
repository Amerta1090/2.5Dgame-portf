import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { saveGame, loadGame, clearSave, fromSaveData } from '@game/state/useSaveState';
import { ZONE_WIDTHS, PLAYER_SPEED, PLAYER_SPEED_SPRINT } from '@game/constants';
import type { ZoneId, GameState } from '@game/types';
import { useGameLoop } from './useGameLoop';
import { useCamera } from './useCamera';
import { usePlayerMovement } from './usePlayerMovement';
import { clampToWorldBounds } from './useCollision';
import { Player } from '@game/entities/Player';
import { HUD } from '@game/ui/HUD';
import { PauseMenu } from '@game/ui/PauseMenu';
import { AchievementToast } from '@game/ui/AchievementToast';
import { ZoneTitle } from '@game/ui/ZoneTitle';
import { ScreenWipe } from '@game/effects/ScreenWipe';
import { Scanlines } from '@game/effects/Scanlines';
import { Zone1SpawnArea } from '@game/zones/Zone1_SpawnArea';
import { Zone2AcademyRoom } from '@game/zones/Zone2_AcademyRoom';
import { Zone3Workshop } from '@game/zones/Zone3_Workshop';
import { Zone4ProjectDistrict } from '@game/zones/Zone4_ProjectDistrict';
import { Zone5CareerCorridor } from '@game/zones/Zone5_CareerCorridor';
import { Zone6FinalRoom } from '@game/zones/Zone6_FinalRoom';

interface GameCanvasProps {
  toastQueue: string[];
  onToastDismiss: (id: string) => void;
}

export function GameCanvas({ toastQueue, onToastDismiss }: GameCanvasProps) {
  const { state, dispatch } = useGameState();
  const [showWipe, setShowWipe] = useState(false);
  const [wipeZone, setWipeZone] = useState<ZoneId>('zone2');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [prevZone, setPrevZone] = useState<ZoneId>(state.currentZone);

  const { moveX, isSprinting } = usePlayerMovement(!isTransitioning && !showPause);

  useGameLoop(
    useCallback(
      (delta) => {
        if (isTransitioning || showPause) return;
        const speed = isSprinting ? PLAYER_SPEED_SPRINT : PLAYER_SPEED;
        const newX = state.playerPosition.x + moveX * speed * delta;

        const clamped = clampToWorldBounds(newX, state.currentZone);
        if (clamped !== state.playerPosition.x) {
          dispatch({ type: 'MOVE_PLAYER', x: clamped, y: state.playerPosition.y });
        }

        if (moveX !== 0) {
          dispatch({ type: 'SET_PLAYER_FACING', facing: moveX < 0 ? 'left' : 'right' });
        }

        dispatch({ type: 'TICK_TIME' });
      },
      [moveX, isSprinting, state.playerPosition.x, state.playerPosition.y, state.currentZone, dispatch, isTransitioning, showPause],
    ),
    state.screen === 'game',
  );

  useEffect(() => {
    if (state.currentZone !== prevZone) {
      setPrevZone(state.currentZone);
    }
  }, [state.currentZone, prevZone]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowPause((p) => !p);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const cameraSpring = useCamera(state.playerPosition.x, state.currentZone);
  const currentZoneWidth = ZONE_WIDTHS[state.currentZone];

  function handleTransition(targetZone: ZoneId) {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setWipeZone(targetZone);
    setShowWipe(true);
  }

  function onWipeComplete() {
    dispatch({ type: 'SET_ZONE', zone: wipeZone });
    setShowWipe(false);
    setIsTransitioning(false);
  }

  function handlePauseResume() {
    setShowPause(false);
  }

  function handlePauseSave() {
    saveGame(state);
  }

  function handlePauseLoad() {
    const saved = loadGame();
    if (saved) {
      dispatch({ type: 'LOAD_STATE', state: fromSaveData(saved) as GameState });
    }
  }

  function handlePauseSkip() {
    dispatch({ type: 'SET_SCREEN', screen: 'standard' });
  }

  function handlePauseReset() {
    clearSave();
    dispatch({ type: 'RESET' });
    setShowPause(false);
  }

  function handleToggleCommentary() {
    dispatch({ type: 'TOGGLE_COMMENTARY' });
  }

  const commentaryUnlocked = state.loreFragments.length >= 9;

  const commentaryTexts: Record<string, string> = useMemo(() => ({
    zone1: 'DEV COMMENT: The Spawn Area establishes the anonymous investigator premise. The terminal is the first interaction — it sets expectations for the entire game.',
    zone2: 'DEV COMMENT: The Academy Room represents formal education. Certificates are presented as collectibles to gamify the credential display.',
    zone3: 'DEV COMMENT: The Workshop is the mechanical heart of the game. Each subroom maps to a skill category and contains a puzzle that tests that domain knowledge.',
    zone4: 'DEV COMMENT: Project District is the largest zone. Featured projects get bigger buildings — a visual hierarchy that mirrors portfolio prioritization.',
    zone5: 'DEV COMMENT: The Career Corridor combines timeline visualization with a branching decision sim. The volunteering segment adds a human element.',
    zone6: 'DEV COMMENT: The Final Room is pure narrative payoff. No puzzles, no mechanics — just reflection. The typewriter effect slows the player down for emotional impact.',
  }), []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#0A0A0A',
      }}
    >
      <motion.div
        role="region"
        aria-label={`Zone: ${state.currentZone}`}
        style={{
          width: currentZoneWidth,
          height: '100vh',
          position: 'relative',
          x: cameraSpring,
          contain: 'layout style paint',
        }}
      >
        {state.currentZone === 'zone1' && (
          <Zone1SpawnArea onTransition={handleTransition} />
        )}
        {state.currentZone === 'zone2' && (
          <Zone2AcademyRoom onTransition={handleTransition} />
        )}
        {state.currentZone === 'zone3' && (
          <Zone3Workshop onTransition={handleTransition} />
        )}
        {state.currentZone === 'zone4' && (
          <Zone4ProjectDistrict onTransition={handleTransition} />
        )}
        {state.currentZone === 'zone5' && (
          <Zone5CareerCorridor onTransition={handleTransition} />
        )}
        {state.currentZone === 'zone6' && <Zone6FinalRoom />}

        <Player walking={moveX !== 0} />
      </motion.div>

      <HUD onMenuClick={() => setShowPause(true)} />

      <ZoneTitle zone={state.currentZone} />

      <AchievementToast queue={toastQueue} onDismiss={onToastDismiss} />

      <PauseMenu
        visible={showPause}
        onResume={handlePauseResume}
        onSave={handlePauseSave}
        onLoad={handlePauseLoad}
        onSkipGame={handlePauseSkip}
        onReset={handlePauseReset}
        commentaryUnlocked={commentaryUnlocked}
        commentaryEnabled={state.developerCommentary}
        onToggleCommentary={handleToggleCommentary}
      />

      {state.developerCommentary && (
        <div
          style={{
            position: 'fixed',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 500,
            color: '#888',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4,
            padding: '6px 14px',
            maxWidth: '70%',
            textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {commentaryTexts[state.currentZone]}
        </div>
      )}

      <ScreenWipe visible={showWipe} zoneName={wipeZone} onComplete={onWipeComplete} />

      <Scanlines />

      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {state.currentZone} — {state.loreFragments.length} of 9 lore fragments collected — {state.achievements.length} achievements unlocked
      </div>
    </div>
  );
}
