import type { GameState, GameAction } from '@game/types';

export function progressReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'SET_ZONE':
      return { ...state, currentZone: action.zone, playerPosition: { x: 0, y: 0 } };

    case 'COMPLETE_ZONE':
      if (state.zonesCompleted.includes(action.zone)) return state;
      return {
        ...state,
        zonesCompleted: [...state.zonesCompleted, action.zone],
        zoneProgress: { ...state.zoneProgress, [action.zone]: 100 },
      };

    case 'MOVE_PLAYER': {
      const zoneWidth = { zone1: 2000, zone2: 3000, zone3: 5000, zone4: 8000, zone5: 4000, zone6: 1500 }[state.currentZone];
      return {
        ...state,
        playerPosition: {
          x: Math.max(0, Math.min(action.x, zoneWidth)),
          y: action.y,
        },
      };
    }

    case 'SET_PLAYER_FACING':
      return { ...state, playerFacing: action.facing };

    case 'TOGGLE_COMMENTARY':
      return { ...state, developerCommentary: !state.developerCommentary };

    case 'TICK_TIME':
      return { ...state, playTime: state.playTime + 1 };

    case 'LOAD_STATE':
      return { ...state, ...action.state, screen: 'game' };

    case 'RESET':
      return {
        ...state,
        screen: 'title',
        currentZone: 'zone1',
        zonesCompleted: [],
        zoneProgress: { zone1: 0, zone2: 0, zone3: 0, zone4: 0, zone5: 0, zone6: 0 },
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
        developerCommentary: false,
      };

    default:
      return state;
  }
}
