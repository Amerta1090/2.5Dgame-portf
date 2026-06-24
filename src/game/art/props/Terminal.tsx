interface TerminalProps {
  x: number;
  y: number;
  scale?: number;
}

export function Terminal({ x, y, scale = 1 }: TerminalProps) {
  const w = 80 * scale;
  const h = 60 * scale;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: 3,
      }}
    >
      {/* Monitor frame */}
      <div
        style={{
          width: w,
          height: h * 0.75,
          background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%)',
          borderRadius: 3,
          border: '2px solid #3a3a4a',
          position: 'relative',
          padding: 4,
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#0a0a12',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Scan lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 100, 0.03) 1px, rgba(0, 255, 100, 0.03) 2px)',
            }}
          />
          {/* Text line */}
          <div style={{ position: 'absolute', top: '50%', left: 8, right: 8, height: 1, background: 'rgba(0, 255, 100, 0.3)' }} />
          {/* Blinking cursor */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 20,
              width: 6,
              height: 1,
              background: '#00ff64',
              animation: 'pulse 1s step-end infinite',
            }}
          />
        </div>
      </div>
      {/* Base */}
      <div
        style={{
          width: w * 0.4,
          height: h * 0.15,
          background: '#2a2a3a',
          margin: '0 auto',
          borderRadius: '0 0 2px 2px',
        }}
      />
      {/* Keyboard */}
      <div
        style={{
          width: w * 1.1,
          height: h * 0.1,
          background: '#1a1a2a',
          margin: '2px auto 0',
          borderRadius: 1,
          border: '1px solid #2a2a3a',
        }}
      />
    </div>
  );
}
