interface PedestalProps {
  x: number;
  y: number;
  scale?: number;
  isNearby?: boolean;
}

export function Pedestal({ x, y, scale = 1, isNearby }: PedestalProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 80 * scale,
        height: 120 * scale,
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: 40 * scale,
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
          background: '#2a2a2a',
          border: '1px solid #444',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 36 * scale,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60 * scale,
          height: 6 * scale,
          background: '#1a1a1a',
          border: '1px solid #d4a017',
          borderRadius: 2,
          boxShadow: isNearby
            ? '0 0 16px rgba(212, 160, 23, 0.5)'
            : '0 0 8px rgba(212, 160, 23, 0.2)',
          transition: 'box-shadow 0.3s',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 44 * scale,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40 * scale,
          height: 50 * scale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2 * scale,
        }}
      >
        <div
          style={{
            width: 16 * scale,
            height: 40 * scale,
            background: '#d4a017',
            borderRadius: '2px 0 0 2px',
            transform: 'skewY(-5deg)',
            transformOrigin: 'bottom right',
            boxShadow: isNearby
              ? '0 0 12px rgba(212, 160, 23, 0.4)'
              : 'none',
            transition: 'box-shadow 0.3s',
          }}
        />
        <div
          style={{
            width: 16 * scale,
            height: 40 * scale,
            background: '#d4a017',
            borderRadius: '0 2px 2px 0',
            transform: 'skewY(5deg)',
            transformOrigin: 'bottom left',
            boxShadow: isNearby
              ? '0 0 12px rgba(212, 160, 23, 0.4)'
              : 'none',
            transition: 'box-shadow 0.3s',
          }}
        />
      </div>
    </div>
  );
}
