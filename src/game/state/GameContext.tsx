import { createContext, useReducer, type ReactNode } from 'react';
import type { GameState, GameAction } from '@game/types';
import { gameReducer } from './reducers';

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

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({ state: initialState, dispatch: () => {} });

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
