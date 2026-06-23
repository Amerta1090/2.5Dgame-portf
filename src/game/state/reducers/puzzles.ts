import type { GameState, GameAction } from '@game/types';

export function puzzlesReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'COMPLETE_PUZZLE':
      if (state.puzzlesCompleted.includes(action.id)) return state;
      return {
        ...state,
        puzzlesCompleted: [...state.puzzlesCompleted, action.id],
        totalInteractions: state.totalInteractions + 1,
      };

    case 'INCREMENT_ATTEMPT': {
      const current = state.puzzleAttempts[action.puzzleId] ?? 0;
      return {
        ...state,
        puzzleAttempts: { ...state.puzzleAttempts, [action.puzzleId]: current + 1 },
      };
    }

    default:
      return state;
  }
}
