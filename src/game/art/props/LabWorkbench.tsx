interface LabWorkbenchProps {
  x: number;
  y: number;
  scale?: number;
  accent?: string;
}

const COMPONENTS = [
  { color: '#4040E0', label: 'MCU' },
  { color: '#40E060', label: 'SEN' },
  { color: '#E0E040', label: 'PWR' },
  { color: '#E04040', label: 'LED' },
];

export function LabWorkbench({ x, y, scale = 1, accent = '#40E060' }: LabWorkbenchProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 200 * scale,
        height: 40 * scale,
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 20 * scale,
          background: '#2a3a2a',
          borderTop: `2px solid ${accent}`,
          borderRadius: '2px 2px 0 0',
        }}
      />

      {COMPONENTS.map((comp, i) => (
        <div
          key={comp.label}
          style={{
            position: 'absolute',
            top: 2 * scale,
            left: (10 + i * 45) * scale,
            width: 30 * scale,
            height: 14 * scale,
            background: comp.color,
            borderRadius: 2 * scale,
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 5 * scale,
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
            }}
          >
            {comp.label}
          </span>
        </div>
      ))}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 18 * scale,
          background: '#1a1a2a',
          borderRadius: '0 0 2px 2px',
        }}
      />
    </div>
  );
}
