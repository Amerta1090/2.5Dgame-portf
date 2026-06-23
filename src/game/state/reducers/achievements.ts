import type { GameState, GameAction } from '@game/types';

export function achievementsReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.includes(action.id)) return state;
      return {
        ...state,
        achievements: [...state.achievements, action.id],
      };

    default:
      return state;
  }
}
