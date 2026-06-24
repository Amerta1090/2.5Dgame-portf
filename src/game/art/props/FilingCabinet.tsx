interface FilingCabinetProps {
  x: number;
  y: number;
  scale?: number;
  drawers?: number;
}

export function FilingCabinet({ x, y, scale = 1, drawers = 4 }: FilingCabinetProps) {
  const w = 60 * scale;
  const h = 100 * scale;
  const drawerH = (h * 0.8) / drawers;

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
      {/* Cabinet body */}
      <div
        style={{
          width: w,
          height: h * 0.9,
          background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%)',
          borderRadius: 2,
          border: '1px solid #3a3a4a',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: drawers }).map((_, i) => (
          <div
            key={`drawer-${i}`}
            style={{
              height: drawerH,
              borderBottom: i < drawers - 1 ? '1px solid #3a3a4a' : undefined,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Drawer handle */}
            <div
              style={{
                width: w * 0.3,
                height: 4,
                background: '#4a4a5a',
                borderRadius: 2,
              }}
            />
            {/* Subtle cyan glow on hover */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transition: 'background 0.3s',
              }}
            />
          </div>
        ))}
      </div>
      {/* Legs */}
      <div style={{ position: 'absolute', bottom: -6, left: 4, width: 6, height: 6, background: '#1a1a2a', borderRadius: '0 0 1px 1px' }} />
      <div style={{ position: 'absolute', bottom: -6, right: 4, width: 6, height: 6, background: '#1a1a2a', borderRadius: '0 0 1px 1px' }} />
    </div>
  );
}
