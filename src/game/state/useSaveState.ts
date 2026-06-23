import { useEffect, useRef } from 'react';
import type { GameState, SaveData } from '@game/types';
import { SAVE_KEY, SAVE_VERSION, AUTO_SAVE_INTERVAL } from '@game/constants';

function toSaveData(state: GameState): SaveData {
  return {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    zonesCompleted: state.zonesCompleted,
    loreFragments: state.loreFragments,
    collectedCertIds: state.collectedCertIds,
    badges: state.badges,
    puzzlesCompleted: state.puzzlesCompleted,
    achievements: state.achievements,
    playTime: state.playTime,
    totalInteractions: state.totalInteractions,
  };
}

function fromSaveData(saved: SaveData): Partial<GameState> {
  return {
    zonesCompleted: saved.zonesCompleted,
    loreFragments: saved.loreFragments,
    collectedCertIds: saved.collectedCertIds,
    badges: saved.badges,
    puzzlesCompleted: saved.puzzlesCompleted,
    achievements: saved.achievements,
    playTime: saved.playTime,
    totalInteractions: saved.totalInteractions,
  };
}

export function saveGame(state: GameState): void {
  try {
    const data = toSaveData(state);
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== SAVE_VERSION) {
      localStorage.removeItem(SAVE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

interface ChangeTrack {
  zonesCompleted: string;
  loreFragments: number;
  puzzlesCompleted: number;
  achievements: number;
}

function snapshot(state: GameState): ChangeTrack {
  return {
    zonesCompleted: state.zonesCompleted.join(','),
    loreFragments: state.loreFragments.length,
    puzzlesCompleted: state.puzzlesCompleted.length,
    achievements: state.achievements.length,
  };
}

export function useSaveState(state: GameState): void {
  const prevRef = useRef<ChangeTrack>(snapshot(state));

  useEffect(() => {
    if (state.screen !== 'game') return;
    const curr = snapshot(state);
    const p = prevRef.current;
    if (
      p.zonesCompleted !== curr.zonesCompleted ||
      p.loreFragments !== curr.loreFragments ||
      p.puzzlesCompleted !== curr.puzzlesCompleted ||
      p.achievements !== curr.achievements
    ) {
      saveGame(state);
      prevRef.current = curr;
    }
  }, [state]);

  useEffect(() => {
    if (state.screen !== 'game') return;
    const interval = setInterval(() => saveGame(state), AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [state]);
}

export { fromSaveData };
