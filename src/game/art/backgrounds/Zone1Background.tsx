const BLINK = {
  animation: 'pulse 1.5s ease-in-out infinite',
};

export function Zone1Background() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Far layer - atmospheric gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #0a0a12 0%, #0d0d1a 30%, #0f0f22 60%, #111128 100%)',
        }}
      />

      {/* Server racks - far layer */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={`rack-far-${i}`}
          style={{
            position: 'absolute',
            left: 200 + i * 350,
            bottom: 80,
            width: 80,
            height: 350,
            background: 'linear-gradient(180deg, #0d0d1a 0%, #111128 100%)',
            border: '1px solid rgba(0, 255, 255, 0.08)',
            borderRadius: 2,
            opacity: 0.6,
          }}
        >
          {/* Shelf lines */}
          {[0, 1, 2, 3, 4].map((s) => (
            <div
              key={`shelf-far-${s}`}
              style={{
                position: 'absolute',
                top: 30 + s * 65,
                left: 4, right: 4,
                height: 1,
                background: 'rgba(0, 255, 255, 0.05)',
              }}
            />
          ))}
        </div>
      ))}

      {/* Mid layer - closer server racks */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`rack-mid-${i}`}
          style={{
            position: 'absolute',
            left: 100 + i * 400,
            bottom: 80,
            width: 100,
            height: 420,
            background: 'linear-gradient(180deg, #111128 0%, #151530 100%)',
            border: '1px solid rgba(0, 255, 255, 0.15)',
            borderRadius: 2,
            zIndex: 1,
          }}
        >
          {/* Shelf lines */}
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <div
              key={`shelf-${s}`}
              style={{
                position: 'absolute',
                top: 25 + s * 65,
                left: 4, right: 4,
                height: 1,
                background: 'rgba(0, 255, 255, 0.1)',
              }}
            />
          ))}
          {/* Blinking LEDs */}
          {[0, 1, 2].map((l) => (
            <div
              key={`led-${l}`}
              style={{
                position: 'absolute',
                top: 10 + l * 30,
                right: 8,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#00ff88',
                boxShadow: '0 0 4px #00ff88',
                ...BLINK,
                animationDelay: `${l * 0.5}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}

      {/* Cable conduits on ceiling */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          height: 3,
          background: '#1a1a3a',
        }}
      />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={`conduit-${i}`}
          style={{
            position: 'absolute',
            top: 30,
            left: 100 + i * 250,
            width: 2,
            height: 20,
            background: '#2a2a4a',
          }}
        />
      ))}

      {/* Floor */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #151528 0%, #0d0d1a 100%)',
          borderTop: '1px solid rgba(0, 255, 255, 0.2)',
          zIndex: 2,
        }}
      >
        {/* Floor grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 60px,
                rgba(0, 255, 255, 0.03) 60px,
                rgba(0, 255, 255, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
}
