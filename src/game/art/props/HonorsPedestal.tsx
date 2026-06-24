interface HonorsPedestalProps {
  x: number;
  y: number;
  scale?: number;
  isNearby?: boolean;
}

export function HonorsPedestal({ x, y, scale = 1, isNearby }: HonorsPedestalProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 60 * scale,
        height: 90 * scale,
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
          clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
          background: '#1a1a1a',
          border: '1px solid #333',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 36 * scale,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 50 * scale,
          height: 4 * scale,
          background: '#d4a017',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 30 * scale,
          height: 40 * scale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'filter 0.3s',
          filter: isNearby ? 'brightness(1.3)' : 'none',
        }}
      >
        <svg width={24 * scale} height={30 * scale} viewBox="0 0 24 30">
          <path
            d="M12 2 L14 10 L22 10 L16 15 L18 23 L12 18 L6 23 L8 15 L2 10 L10 10 Z"
            fill="#d4a017"
            stroke="#b8860b"
            strokeWidth={1}
          />
          <rect x={8} y={24} width={8} height={3} rx={1} fill="#b8860b" />
        </svg>
      </div>
    </div>
  );
}
