export function Zone3IoTWorkshop() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #081a12 0%, #0a2218 50%, #0d2a1f 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 200,
          width: 300,
          height: 20,
          background: '#1a1a2a',
          borderTop: '4px solid #2a3a2a',
          borderRadius: '2px 2px 0 0',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 165,
          width: 40,
          height: 30,
          background: '#0a0a12',
          border: '1px solid #2a4a2a',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            right: 4,
            height: 10,
            background: '#00ff88',
            opacity: 0.6,
            borderRadius: 1,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>

      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={`component-${i}`}
          style={{
            position: 'absolute',
            left: 180 + i * 26,
            top: 170,
            width: 16,
            height: 12,
            background: ['#4040E0', '#E04040', '#40E060', '#E0E040', '#E040E0', '#40E0E0', '#E08040', '#80E040', '#4080E0'][i],
            borderRadius: 2,
            opacity: 0.7,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 480,
          top: 120,
          width: 80,
          height: 80,
          border: '2px solid #1a3a2a',
          borderRadius: '50%',
          background: '#050a08',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 4,
            right: 4,
            height: 2,
            background: '#00ff88',
            opacity: 0.5,
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: 4,
            right: 4,
            height: 2,
            background: '#00ff88',
            opacity: 0.3,
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '70%',
            left: 4,
            right: 4,
            height: 2,
            background: '#00ff88',
            opacity: 0.2,
            transform: 'translateY(-50%)',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #0d2a1f 0%, #081a12 100%)',
          borderTop: '1px solid rgba(0, 255, 136, 0.1)',
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
                rgba(0, 255, 136, 0.03) 60px,
                rgba(0, 255, 136, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
}
