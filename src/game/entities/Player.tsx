import { motion } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';

export function Player() {
  const { state } = useGameState();

  return (
    <motion.div
      role="img"
      aria-label="Player character"
      style={{
        position: 'absolute',
        left: state.playerPosition.x,
        top: state.playerPosition.y,
        width: 30,
        height: 60,
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F0E040',
          borderRadius: 4,
          transform: state.playerFacing === 'left' ? 'scaleX(-1)' : undefined,
          boxShadow: '0 0 8px rgba(240, 224, 64, 0.6)',
        }}
      />
    </motion.div>
  );
}
