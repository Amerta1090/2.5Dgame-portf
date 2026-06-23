import type { GameState, GameAction } from '@game/types';
import { progressReducer } from './progress';
import { inventoryReducer } from './inventory';
import { achievementsReducer } from './achievements';
import { puzzlesReducer } from './puzzles';

export function gameReducer(state: GameState, action: GameAction): GameState {
  let next = progressReducer(state, action);
  next = inventoryReducer(next, action);
  next = achievementsReducer(next, action);
  next = puzzlesReducer(next, action);
  return next;
}

export { progressReducer } from './progress';
export { inventoryReducer } from './inventory';
export { achievementsReducer } from './achievements';
export { puzzlesReducer } from './puzzles';
