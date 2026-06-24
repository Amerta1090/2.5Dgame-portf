import { useMemo } from 'react';

export function Zone5Background() {
  const windows = useMemo(() => {
    const elements: React.ReactNode[] = [];
    for (let x = 50; x < 4000; x += 300) {
      elements.push(
        <div
          key={`win-${x}`}
          style={{
            position: 'absolute',
            left: x,
            top: 40,
            width: 120,
            height: 160,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(255,255,255,0.03)',
              transform: 'translateX(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: 1,
              background: 'rgba(255,255,255,0.03)',
            }}
          />
        </div>,
      );
    }
    return elements;
  }, []);

  const wallPanels = useMemo(() => {
    const elements: React.ReactNode[] = [];
    for (let x = 0; x < 4000; x += 200) {
      elements.push(
        <div
          key={`panel-${x}`}
          style={{
            position: 'absolute',
            left: x,
            top: 0,
            width: 1,
            height: 260,
            background: 'rgba(255,255,255,0.02)',
          }}
        />,
      );
    }
    return elements;
  }, []);

  const timelineDots = useMemo(() => {
    const elements: React.ReactNode[] = [];
    const positions = [350, 750, 1150, 1550, 1950, 2350, 2750, 3150];
    positions.forEach((x, i) => {
      elements.push(
        <div
          key={`dot-${i}`}
          style={{
            position: 'absolute',
            left: x - 6,
            top: 340,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#F0E040',
            boxShadow: '0 0 8px rgba(240, 224, 64, 0.4)',
            zIndex: 2,
          }}
        />,
      );
    });
    return elements;
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #0f0f0f 0%, #151515 50%, #1a1a1a 100%)',
      }}
    >
      {wallPanels}
      {windows}

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 200,
          width: '100%',
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(240, 224, 64, 0.15) 20%, rgba(240, 224, 64, 0.15) 80%, transparent 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #151515 100%)',
          borderTop: '1px solid rgba(240, 224, 64, 0.15)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 30,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #F0E040 5%, #F0E040 95%, transparent 100%)',
            opacity: 0.6,
          }}
        >
          {timelineDots}
        </div>

        {[2023, 2024, 2025, 2026].map((year, i) => (
          <div
            key={year}
            style={{
              position: 'absolute',
              left: 400 + i * 800,
              top: 16,
              color: '#888',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              transform: 'translateX(-50%)',
            }}
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
}
