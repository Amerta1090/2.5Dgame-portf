export function Zone3AILab() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1530 50%, #101a3a 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 60,
          width: 180,
          height: 120,
          background: 'linear-gradient(180deg, #0d1530, #1a2a5a)',
          border: '1px solid rgba(64, 128, 224, 0.3)',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '8px 8px 30px 8px',
            background: '#050a15',
            borderRadius: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: 4,
              right: 4,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #4080E0, transparent)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <svg
        style={{ position: 'absolute', left: 350, top: 40, width: 300, height: 200 }}
        viewBox="0 0 300 200"
      >
        {[0, 1, 2].map((layer) =>
          [0, 1, 2, 3].map((node) => (
            <circle
              key={`n-${layer}-${node}`}
              cx={40 + layer * 100}
              cy={40 + node * 40}
              r={6}
              fill="none"
              stroke={`rgba(64, 128, 224, ${0.3 + layer * 0.15})`}
              strokeWidth={1.5}
            />
          )),
        )}
        {[0, 1, 2].map((layer) =>
          [0, 1, 2, 3].map((fromNode) =>
            [0, 1, 2, 3].map((toNode) => (
              <line
                key={`l-${layer}-${fromNode}-${toNode}`}
                x1={40 + layer * 100}
                y1={40 + fromNode * 40}
                x2={40 + (layer + 1) * 100}
                y2={40 + toNode * 40}
                stroke={`rgba(64, 128, 224, ${Math.random() * 0.1 + 0.05})`}
                strokeWidth={0.5}
              />
            )),
          ),
        )}
      </svg>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(180deg, #101a3a 0%, #0a0f1a 100%)',
          borderTop: '1px solid rgba(64, 128, 224, 0.1)',
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
                rgba(64, 128, 224, 0.03) 60px,
                rgba(64, 128, 224, 0.03) 61px
              )
            `,
          }}
        />
      </div>
    </div>
  );
}
