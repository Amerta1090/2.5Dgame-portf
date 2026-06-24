export function Zone3HubBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #0f1115 0%, #151820 50%, #1a1e2a 100%)',
        }}
      />

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={`panel-${i}`}
          style={{
            position: 'absolute',
            left: 80 + i * 600,
            top: 40,
            width: 300,
            height: 500,
            border: '1px solid rgba(255,255,255,0.03)',
            borderRadius: 4,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 180,
          width: 120,
          height: 200,
          border: '2px solid #4080E0',
          borderRadius: '60px 60px 0 0',
          opacity: 0.8,
        }}
      >
        <span
          style={{
            position: 'absolute',
            bottom: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#4080E0',
            fontFamily: "'Impact', sans-serif",
            fontSize: 11,
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}
        >
          AI LAB
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 180,
          width: 120,
          height: 200,
          border: '2px solid #E07040',
          borderRadius: '60px 60px 0 0',
          opacity: 0.8,
        }}
      >
        <span
          style={{
            position: 'absolute',
            bottom: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#E07040',
            fontFamily: "'Impact', sans-serif",
            fontSize: 11,
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}
        >
          WEB STUDIO
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 180,
          width: 120,
          height: 200,
          border: '2px solid #40E060',
          borderRadius: '60px 60px 0 0',
          opacity: 0.8,
        }}
      >
        <span
          style={{
            position: 'absolute',
            bottom: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#40E060',
            fontFamily: "'Impact', sans-serif",
            fontSize: 11,
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}
        >
          IOT WORKSHOP
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #1a1e2a 0%, #0f1115 100%)',
          borderTop: '1px solid rgba(100, 200, 255, 0.05)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 60px,
                rgba(100, 200, 255, 0.04) 60px,
                rgba(100, 200, 255, 0.04) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
}
