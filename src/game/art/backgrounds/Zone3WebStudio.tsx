export function Zone3WebStudio() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #1a0f08 0%, #22150a 50%, #2a1a0d 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 80,
          width: 160,
          height: 100,
          background: '#0a0a0a',
          border: '2px solid #3a2a1a',
          borderRadius: 4,
          transform: 'rotate(-3deg)',
        }}
      >
        <div
          style={{
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: 2,
                width: `${40 + Math.random() * 40}%`,
                background: i === 2 ? '#E07040' : '#E07040',
                opacity: 0.3 + i * 0.1,
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 280,
          top: 60,
          width: 200,
          height: 140,
          background: '#0a0a0a',
          border: '2px solid #3a2a1a',
          borderRadius: 4,
          transform: 'rotate(2deg)',
        }}
      >
        <div
          style={{
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {[0, 1, 2, 3, 5, 6, 7].map((i) => (
            <div
              key={i}
              style={{
                height: 2,
                width: `${50 + Math.random() * 30}%`,
                background: i === 3 ? '#E07040' : '#E07040',
                opacity: 0.2 + i * 0.08,
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 100,
          width: 140,
          height: 80,
          background: '#0a0a0a',
          border: '2px solid #3a2a1a',
          borderRadius: 4,
          transform: 'rotate(-1deg)',
        }}
      >
        <div
          style={{
            padding: '10px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: 2,
                width: `${30 + Math.random() * 50}%`,
                background: '#E07040',
                opacity: 0.2 + i * 0.1,
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #2a1a0d 0%, #1a0f08 100%)',
          borderTop: '1px solid rgba(224, 112, 64, 0.1)',
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
                rgba(224, 112, 64, 0.03) 60px,
                rgba(224, 112, 64, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
}
