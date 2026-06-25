import { useState, useEffect, useCallback } from 'react';

const MENU_ITEMS = [
  { label: '▶ START GAME', action: 'start' as const },
  { label: '■ ABOUT THIS', action: 'about' as const },
  { label: '★ CREDITS', action: 'credits' as const },
];

interface MainMenuProps {
  onStart: () => void;
  onAbout: () => void;
  onCredits: () => void;
}

export function MainMenu({ onStart, onAbout, onCredits }: MainMenuProps) {
  const [index, setIndex] = useState(0);

  const execute = useCallback(
    (i: number) => {
      const item = MENU_ITEMS[i];
      if (item.action === 'start') onStart();
      else if (item.action === 'about') onAbout();
      else if (item.action === 'credits') onCredits();
    },
    [onStart, onAbout, onCredits],
  );

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
        position: 'fixed',
        inset: 0,
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
            onClick={() => {
              setIndex(i);
              execute(i);
            }}
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
              minWidth: 240,
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
