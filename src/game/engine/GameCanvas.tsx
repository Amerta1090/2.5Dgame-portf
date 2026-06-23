import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { ZONE_WIDTHS, PLAYER_SPEED, PLAYER_SPEED_SPRINT } from '@game/constants';
import { useGameLoop } from './useGameLoop';
import { useCamera } from './useCamera';
import { usePlayerMovement } from './usePlayerMovement';
import { clampToWorldBounds } from './useCollision';
import { useInteraction } from './useInteraction';
import { Player } from '@game/entities/Player';
import { Door, doorToInteractable } from '@game/entities/Door';
import { HUD } from '@game/ui/HUD';
import { ScreenWipe } from '@game/effects/ScreenWipe';

export function GameCanvas() {
  const { state, dispatch } = useGameState();
  const [showWipe, setShowWipe] = useState(false);
  const [wipeZone, setWipeZone] = useState('');
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

  const doors = state.currentZone === 'zone1' ? [{ x: currentZoneWidth - 120, y: 300 }] : [];
  const targetZone = 'zone2';

  const doorInteractables = doors.map((d) => doorToInteractable('door-1', d.x, d.y));
  const nearby = useInteraction(state.playerPosition.x, state.playerPosition.y, doorInteractables, !isTransitioning);

  function handleUse() {
    if (nearby && !isTransitioning) {
      setIsTransitioning(true);
      setWipeZone(targetZone);
      setShowWipe(true);
    }
  }

  function onWipeComplete() {
    dispatch({ type: 'SET_ZONE', zone: targetZone as typeof state.currentZone });
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
      onKeyDown={(e) => {
        if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearby) {
          handleUse();
        }
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
        {/* Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, #0A0A0A 0%, #1a1a2e 50%, #0A0A0A 100%)',
          }}
        >
          {/* Grid floor */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 40px,
                  rgba(240, 224, 64, 0.03) 40px,
                  rgba(240, 224, 64, 0.03) 41px
                )
              `,
            }}
          />
        </div>

        {/* Ground plane */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: '#1A1A1A',
            borderTop: '1px solid #2A2A2A',
          }}
        />

        <Player />

        {doors.map((d) => (
          <Door
            key={`door-${d.x}`}
            x={d.x}
            y={d.y}
            targetZone={targetZone as typeof state.currentZone}
            isNearby={nearby?.id === 'door-1'}
          />
        ))}
      </motion.div>

      <HUD />

      {nearby && !isTransitioning && (
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

      <ScreenWipe visible={showWipe} zoneName={wipeZone} onComplete={onWipeComplete} />
    </div>
  );
}
