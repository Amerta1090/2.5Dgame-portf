import { useEffect, useRef, useState } from 'react';
import { GameProvider } from '@game/state/GameContext';
import { useGameState } from '@game/state/useGameState';
import { useSaveState, loadGame, fromSaveData } from '@game/state/useSaveState';
import { GameCanvas } from '@game/engine/GameCanvas';
import { TitleScreen } from '@game/screens/TitleScreen';
import { MainMenu } from '@game/screens/MainMenu';
import { AboutModal } from '@game/screens/AboutModal';
import { CreditsScreen } from '@game/screens/CreditsScreen';
import { StandardPortfolio } from '@game/screens/StandardPortfolio';
import { Scanlines } from '@game/effects/Scanlines';
import type { GameState } from '@game/types';

function ScreenRouter() {
  const { state, dispatch } = useGameState();
  const prevAchievementsRef = useRef<string[]>([]);
  const [toastQueue, setToastQueue] = useState<string[]>([]);

  useSaveState(state);

  useEffect(() => {
    if (state.achievements.length > prevAchievementsRef.current.length) {
      const newOnes = state.achievements.filter(
        (a) => !prevAchievementsRef.current.includes(a),
      );
      if (newOnes.length > 0) {
        setToastQueue((q) => [...q, ...newOnes]);
      }
    }
    prevAchievementsRef.current = state.achievements;
  }, [state.achievements]);

  const handleTitleStart = () => {
    dispatch({ type: 'SET_SCREEN', screen: 'menu' });
  };

  const handleMenuStart = () => {
    const saved = loadGame();
    if (saved) {
      dispatch({ type: 'LOAD_STATE', state: fromSaveData(saved) as GameState });
    } else {
      dispatch({ type: 'SET_SCREEN', screen: 'game' });
    }
  };

  const handleMenuAbout = () => {
    dispatch({ type: 'SET_SCREEN', screen: 'about' });
  };

  const handleMenuCredits = () => {
    dispatch({ type: 'SET_SCREEN', screen: 'credits' });
  };

  const handleBackToMenu = () => {
    dispatch({ type: 'SET_SCREEN', screen: 'menu' });
  };

  if (state.screen === 'title') {
    return <TitleScreen onStart={handleTitleStart} />;
  }

  if (state.screen === 'menu') {
    return (
      <>
        <MainMenu
          onStart={handleMenuStart}
          onAbout={handleMenuAbout}
          onCredits={handleMenuCredits}
        />
        <Scanlines />
      </>
    );
  }

  if (state.screen === 'about') {
    return <AboutModal onBack={handleBackToMenu} />;
  }

  if (state.screen === 'credits') {
    return <CreditsScreen onBack={handleBackToMenu} />;
  }

  if (state.screen === 'standard') {
    return <StandardPortfolio onBack={handleBackToMenu} />;
  }

  if (state.screen === 'game') {
    return <GameCanvas toastQueue={toastQueue} onToastDismiss={(id) => {
      setToastQueue((q) => q.filter((t) => t !== id));
    }} />;
  }

  return null;
}

export default function Game() {
  return (
    <div id="game-root">
      <GameProvider>
        <ScreenRouter />
      </GameProvider>
    </div>
  );
}
