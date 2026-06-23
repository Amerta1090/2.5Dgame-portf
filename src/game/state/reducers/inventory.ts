import type { GameState, GameAction } from '@game/types';

export function inventoryReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'COLLECT_LORE':
      if (state.loreFragments.includes(action.id)) return state;
      return {
        ...state,
        loreFragments: [...state.loreFragments, action.id],
        totalInteractions: state.totalInteractions + 1,
      };

    case 'COLLECT_CERT':
      if (state.collectedCertIds.includes(action.id)) return state;
      return {
        ...state,
        collectedCertIds: [...state.collectedCertIds, action.id],
        totalInteractions: state.totalInteractions + 1,
      };

    default:
      return state;
  }
}
