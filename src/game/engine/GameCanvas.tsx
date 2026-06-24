import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { ZONE_WIDTHS, PLAYER_SPEED, PLAYER_SPEED_SPRINT } from '@game/constants';
import type { ZoneId } from '@game/types';
import { useGameLoop } from './useGameLoop';
import { useCamera } from './useCamera';
import { usePlayerMovement } from './usePlayerMovement';
import { clampToWorldBounds } from './useCollision';
import { Player } from '@game/entities/Player';
import { HUD } from '@game/ui/HUD';
import { ScreenWipe } from '@game/effects/ScreenWipe';
import { Zone1SpawnArea } from '@game/zones/Zone1_SpawnArea';
import { Zone2AcademyRoom } from '@game/zones/Zone2_AcademyRoom';

export function GameCanvas() {
  const { state, dispatch } = useGameState();
  const [showWipe, setShowWipe] = useState(false);
  const [wipeZone, setWipeZone] = useState<ZoneId>('zone2');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { moveX, isSprinting } = usePlayerMovement(!isTransitioning);

  useGameLoop(
    useCallback(
      (delta) => {
        if (isTransitioning) return;
        const speed = isSprinting ? PLAYER_SPEED_SPRINT : PLAYER_SPEED;
        const newX = state.playerPosition.x + moveX * speed * delta;

        const clamped = clampToWorldBounds(newX, state.currentZone);
        if (clamped !== state.playerPosition.x) {
          dispatch({ type: 'MOVE_PLAYER', x: clamped, y: state.playerPosition.y });
        }

        if (moveX !== 0) {
          dispatch({ type: 'SET_PLAYER_FACING', facing: moveX < 0 ? 'left' : 'right' });
        }

        if (state.screen === 'game') {
          dispatch({ type: 'TICK_TIME' });
        }
      },
      [moveX, isSprinting, state.playerPosition.x, state.playerPosition.y, state.currentZone, state.screen, dispatch, isTransitioning],
    ),
    state.screen === 'game',
  );

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
        style={{
          width: currentZoneWidth,
          height: '100vh',
          position: 'relative',
          x: cameraSpring,
        }}
      >
        {state.currentZone === 'zone1' && (
          <Zone1SpawnArea onTransition={handleTransition} />
        )}
        {state.currentZone === 'zone2' && (
          <Zone2AcademyRoom onTransition={handleTransition} />
        )}

        <Player walking={moveX !== 0} />
      </motion.div>

      <HUD />

      <ScreenWipe visible={showWipe} zoneName={wipeZone} onComplete={onWipeComplete} />
    </div>
  );
}
