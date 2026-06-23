import { useEffect, useState, useCallback } from 'react';
import { GameProvider } from '@game/state/GameContext';
import { useGameState } from '@game/state/useGameState';
import { useSaveState, loadGame, fromSaveData } from '@game/state/useSaveState';
import { GameCanvas } from '@game/engine/GameCanvas';
import type { GameAction, GameState } from '@game/types';

const MENU_ITEMS = [
  { label: '▶ START GAME', action: 'start' as const },
  { label: '■ ABOUT THIS', action: 'about' as const },
  { label: '★ CREDITS', action: 'credits' as const },
];

function MenuScreen({ dispatch }: { dispatch: React.Dispatch<GameAction> }) {
  const [index, setIndex] = useState(0);

  const execute = useCallback((i: number) => {
    const item = MENU_ITEMS[i];
    if (item.action === 'start') {
      const saved = loadGame();
      if (saved) {
        dispatch({ type: 'LOAD_STATE', state: fromSaveData(saved) as GameState });
      } else {
        dispatch({ type: 'SET_SCREEN', screen: 'game' });
      }
    } else {
      dispatch({ type: 'SET_SCREEN', screen: item.action });
    }
  }, [dispatch]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          setIndex((i) => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          setIndex((i) => (i + 1) % MENU_ITEMS.length);
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          execute(index);
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, execute]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          fontWeight: 900,
          color: '#F0E040',
          fontFamily: "'Impact', sans-serif",
          marginBottom: 32,
          letterSpacing: '0.05em',
        }}
      >
        25DGAME
      </h2>

      {MENU_ITEMS.map((item, i) => {
        const selected = i === index;
        return (
          <button
            key={item.action}
            onClick={() => { setIndex(i); execute(i); }}
            onMouseEnter={() => setIndex(i)}
            style={{
              background: 'transparent',
              border: selected ? '2px solid #F0E040' : '2px solid #555',
              color: selected ? '#F0E040' : '#888',
              padding: '12px 48px',
              fontSize: '1.2rem',
              fontWeight: 700,
              fontFamily: "'Impact', sans-serif",
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'border-color 0.2s, color 0.2s',
              outline: 'none',
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function ScreenRouter() {
  const { state, dispatch } = useGameState();

  useSaveState(state);

  useEffect(() => {
    function onKeyDown() {
      if (state.screen === 'title') {
        dispatch({ type: 'SET_SCREEN', screen: 'menu' });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.screen, dispatch]);

  if (state.screen === 'title') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'menu' })}
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
    );
  }

  if (state.screen === 'menu') {
    return <MenuScreen dispatch={dispatch} />;
  }

  if (state.screen === 'game') {
    return <GameCanvas />;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 32,
      }}
    >
      <div
        style={{
          maxWidth: 600,
          textAlign: 'center',
          color: '#888',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h2 style={{ color: '#F0E040', fontFamily: "'Impact', sans-serif", fontSize: '2rem' }}>
          {state.screen === 'about' ? 'What is This?' : 'Credits'}
        </h2>
        <p style={{ marginTop: 16, lineHeight: 1.6 }}>
          {state.screen === 'about'
            ? '25DGAME is an interactive portfolio experience. Explore the mind, work, and identity of Abdul Majid Ridwan through a 2.5D side-scrolling game.'
            : 'Built with Astro, React, TypeScript, Tailwind CSS, and Framer Motion. All portfolio data is sourced from local JSON files.'}
        </p>
        <button
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'menu' })}
          style={{
            marginTop: 32,
            background: 'transparent',
            border: '1px solid #555',
            color: '#888',
            padding: '8px 24px',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
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
