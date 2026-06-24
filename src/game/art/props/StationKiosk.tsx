interface StationKioskProps {
  x: number;
  y: number;
  company: string;
  isNearby?: boolean;
}

export function StationKiosk({ x, y, company, isNearby }: StationKioskProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 40,
        top: y,
        width: 80,
        height: 120,
        zIndex: 4,
        transition: 'filter 0.3s, border-color 0.3s',
        filter: isNearby ? 'brightness(1.1)' : 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: 60,
          background: isNearby ? '#0a0a1a' : '#0a0a12',
          border: isNearby ? '2px solid #4080E0' : '2px solid #333',
          borderRadius: '2px 2px 0 0',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          boxShadow: isNearby ? '0 0 16px rgba(64, 128, 224, 0.3)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 40,
            height: 30,
            background: 'linear-gradient(180deg, rgba(64, 128, 224, 0.15), rgba(64, 128, 224, 0.05))',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#4080E0', fontSize: 8, fontFamily: "'JetBrains Mono', monospace", opacity: 0.7 }}>
            {isNearby ? '▶' : '■'}
          </span>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: 60,
          background: '#1a1a1a',
          border: '1px solid #333',
          borderTop: 'none',
          borderRadius: '0 0 2px 2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
        }}
      >
        <span
          style={{
            color: isNearby ? '#F0E040' : '#888',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 8,
            textAlign: 'center',
            lineHeight: 1.3,
            transition: 'color 0.3s',
            wordBreak: 'break-word',
            maxWidth: '100%',
          }}
        >
          {company}
        </span>
      </div>
    </div>
  );
}
