import React, { useCallback, useEffect, useMemo, useState, lazy, Suspense } from 'react';
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
import { Vignette } from '@game/art/designSystem';

const Zone1SpawnArea = lazy(() => import('@game/zones/Zone1_SpawnArea').then(m => ({ default: m.Zone1SpawnArea })));
const Zone2AcademyRoom = lazy(() => import('@game/zones/Zone2_AcademyRoom').then(m => ({ default: m.Zone2AcademyRoom })));
const Zone3Workshop = lazy(() => import('@game/zones/Zone3_Workshop').then(m => ({ default: m.Zone3Workshop })));
const Zone4ProjectDistrict = lazy(() => import('@game/zones/Zone4_ProjectDistrict').then(m => ({ default: m.Zone4ProjectDistrict })));
const Zone5CareerCorridor = lazy(() => import('@game/zones/Zone5_CareerCorridor').then(m => ({ default: m.Zone5CareerCorridor })));
const Zone6FinalRoom = lazy(() => import('@game/zones/Zone6_FinalRoom').then(m => ({ default: m.Zone6FinalRoom })));

function LoadingZone() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0A',
        color: '#333',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
      }}
    >
      <span style={{ animation: 'pulse 1s ease-in-out infinite' } as React.CSSProperties}>LOADING...</span>
    </div>
  );
}

interface GameCanvasProps {
  toastQueue: string[];
  onToastDismiss: (id: string) => void;
}

const ZoneRenderer = React.memo(function ZoneRenderer({ currentZone, onTransition }: { currentZone: ZoneId; onTransition: (zone: ZoneId) => void }) {
  switch (currentZone) {
    case 'zone1': return <Zone1SpawnArea onTransition={onTransition} />;
    case 'zone2': return <Zone2AcademyRoom onTransition={onTransition} />;
    case 'zone3': return <Zone3Workshop onTransition={onTransition} />;
    case 'zone4': return <Zone4ProjectDistrict onTransition={onTransition} />;
    case 'zone5': return <Zone5CareerCorridor onTransition={onTransition} />;
    case 'zone6': return <Zone6FinalRoom />;
  }
});

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

  const handleTransition = useCallback((targetZone: ZoneId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setWipeZone(targetZone);
    setShowWipe(true);
  }, [isTransitioning]);

  const onWipeComplete = useCallback(() => {
    dispatch({ type: 'SET_ZONE', zone: wipeZone });
    setShowWipe(false);
    setIsTransitioning(false);
  }, [dispatch, wipeZone]);

  const handlePauseResume = useCallback(() => setShowPause(false), []);
  const handlePauseSave = useCallback(() => saveGame(state), [state]);
  const handlePauseLoad = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      dispatch({ type: 'LOAD_STATE', state: fromSaveData(saved) as GameState });
    }
  }, [dispatch]);
  const handlePauseSkip = useCallback(() => dispatch({ type: 'SET_SCREEN', screen: 'standard' }), [dispatch]);
  const handlePauseReset = useCallback(() => {
    clearSave();
    dispatch({ type: 'RESET' });
    setShowPause(false);
  }, [dispatch]);
  const handleToggleCommentary = useCallback(() => dispatch({ type: 'TOGGLE_COMMENTARY' }), [dispatch]);

  const commentaryUnlocked = state.loreFragments.length >= 9;

  const commentaryTexts: Record<string, string> = useMemo(() => ({
    zone1: 'DEV COMMENT: The Spawn Area establishes the anonymous investigator premise. The terminal is the first interaction.',
    zone2: 'DEV COMMENT: The Academy Room represents formal education. Certificates are presented as collectibles.',
    zone3: 'DEV COMMENT: The Workshop is the mechanical heart of the game. Each subroom maps to a skill category.',
    zone4: 'DEV COMMENT: Project District is the largest zone. Featured projects get bigger buildings.',
    zone5: 'DEV COMMENT: The Career Corridor combines timeline visualization with a branching decision sim.',
    zone6: 'DEV COMMENT: The Final Room is pure narrative payoff. No puzzles, no mechanics — just reflection.',
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
          willChange: 'transform',
        }}
      >
        <Suspense fallback={<LoadingZone />}>
          <ZoneRenderer currentZone={state.currentZone} onTransition={handleTransition} />
        </Suspense>

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
      <Vignette opacity={0.4} />

      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {state.currentZone} — {state.loreFragments.length} of 9 lore fragments collected — {state.achievements.length} achievements unlocked
      </div>
    </div>
  );
}
