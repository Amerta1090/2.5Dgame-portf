import { useState } from 'react';
import type { GameScreen, GameState, ZoneId } from '@game/types';

const initialState: GameState = {
  screen: 'title',
  currentZone: 'zone1',
  zonesCompleted: [],
  zoneProgress: {
    zone1: 0,
    zone2: 0,
    zone3: 0,
    zone4: 0,
    zone5: 0,
    zone6: 0,
  },
  playerPosition: { x: 0, y: 0 },
  playerFacing: 'right',
  loreFragments: [],
  collectedCertIds: [],
  badges: [],
  puzzlesCompleted: [],
  puzzleAttempts: {},
  achievements: [],
  playTime: 0,
  totalInteractions: 0,
};

export default function Game() {
  const [state, setState] = useState<GameState>(initialState);

  return (
    <div
      id="game-root"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0A0A0A',
        color: '#F5F5F5',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {state.screen === 'title' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <h1
            style={{
              fontSize: '4rem',
              fontWeight: 900,
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              letterSpacing: '0.05em',
            }}
          >
            25DGAME
          </h1>
          <p style={{ color: '#888', marginTop: '1rem', fontSize: '1rem' }}>
            Press any key to start
          </p>
        </div>
      )}
    </div>
  );
}
