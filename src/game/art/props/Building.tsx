import { useMemo } from 'react';

export type BuildingStyle = 'glass' | 'brick' | 'industrial' | 'concrete' | 'server';

interface BuildingProps {
  x: number;
  y: number;
  style: BuildingStyle;
  width: number;
  height: number;
  featured?: boolean;
  label: string;
  isNearby?: boolean;
  onClick?: () => void;
}

const STYLE_CONFIG: Record<BuildingStyle, { body: string; window: string; roof: string }> = {
  glass: { body: '#2a3a5a', window: '#00ffff', roof: '#1a2a4a' },
  brick: { body: '#5a3a2a', window: '#ff8844', roof: '#4a2a1a' },
  industrial: { body: '#4a4a4a', window: '#00ff88', roof: '#3a3a3a' },
  concrete: { body: '#3a3a3a', window: '#888888', roof: '#2a2a2a' },
  server: { body: '#2a2a3a', window: '#0000ff', roof: '#1a1a2a' },
};

const ROOF_TYPES: Record<BuildingStyle, React.CSSProperties> = {
  glass: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
  brick: {
    clipPath: 'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
  },
  industrial: {
    clipPath: 'polygon(0% 20%, 25% 0%, 50% 20%, 75% 0%, 100% 20%, 100% 100%, 0% 100%)',
  },
  concrete: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
  server: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
};

function WindowDots({ top, height, config }: { top: number; height: number; config: typeof STYLE_CONFIG.glass }) {
  const rows = Math.floor((height - 20) / 30);
  const cols = Math.floor((width - 16) / 22);
  const dots: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ r, c });
    }
  }
  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 8 + d.c * 22,
            top: top + 12 + d.r * 30,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: config.window,
            opacity: 0.3 + Math.random() * 0.4,
            boxShadow: `0 0 6px ${config.window}40`,
          }}
        />
      ))}
    </>
  );
}

const width = 140;

export function Building({ x, y, style, width: w, height: h, featured, label, isNearby, onClick }: BuildingProps) {
  const config = STYLE_CONFIG[style];
  const roofStyle = ROOF_TYPES[style];

  const buildingContent = useMemo(() => {
    const baseHeight = featured ? h * 1.2 : h;
    const baseWidth = featured ? w * 1.2 : w;

    return (
      <div
        onClick={onClick}
        style={{
          position: 'absolute',
          left: x - baseWidth / 2,
          bottom: 0,
          width: baseWidth,
          height: baseHeight,
          cursor: 'pointer',
          zIndex: featured ? 6 : 4,
          filter: featured ? 'drop-shadow(0 0 8px #F0E040)' : 'none',
          transition: 'filter 0.3s, transform 0.3s',
          transform: isNearby ? 'translateY(-4px)' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: config.body,
            border: `1px solid ${isNearby ? '#F0E040' : 'rgba(255,255,255,0.08)'}`,
            borderBottom: 'none',
            transition: 'border-color 0.3s',
          }}
        >
          <WindowDots top={0} height={baseHeight} config={config} />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 24,
            background: config.roof,
            ...roofStyle,
          }}
        />

        {featured && (
          <div
            style={{
              position: 'absolute',
              top: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#F0E040',
              fontSize: 16,
              fontFamily: "'Impact', sans-serif",
              textShadow: '0 0 8px rgba(240, 224, 64, 0.6)',
            }}
          >
            ★
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: isNearby ? '#F0E040' : '#888',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            maxWidth: 140,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'color 0.3s',
          }}
        >
          {label}
        </div>

        {isNearby && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#F0E040',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid #F0E040',
              borderRadius: 4,
              padding: '4px 10px',
              pointerEvents: 'none',
            }}
          >
            Press E
          </div>
        )}
      </div>
    );
  }, [x, y, w, h, style, featured, label, isNearby, onClick, config, roofStyle]);

  return <>{buildingContent}</>;
}
