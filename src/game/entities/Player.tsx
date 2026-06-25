import { memo } from 'react';
import { useGameState } from '@game/state/useGameState';
import { PlayerSprite } from '@game/art/PlayerSprite';

export const Player = memo(function Player({ walking }: { walking?: boolean }) {
  const { state } = useGameState();

  return (
    <div
      role="img"
      aria-label="Player character"
      style={{
        position: 'absolute',
        left: state.playerPosition.x,
        top: state.playerPosition.y,
        width: 40,
        height: 80,
        zIndex: 10,
        willChange: 'transform',
      }}
    >
      <PlayerSprite facing={state.playerFacing} walking={!!walking} />
    </div>
  );
});
