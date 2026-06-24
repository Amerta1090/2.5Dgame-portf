interface CertificateFrameProps {
  x: number;
  y: number;
  scale?: number;
  isNearby?: boolean;
}

export function CertificateFrame({ x, y, scale = 1, isNearby }: CertificateFrameProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 80 * scale,
        height: 100 * scale,
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `${2 * scale}px solid #d4a017`,
          borderRadius: 2,
          background: '#f5f5f5',
          boxShadow: isNearby
            ? '0 0 12px rgba(212, 160, 23, 0.5)'
            : '0 0 8px rgba(212, 160, 23, 0.3)',
          transition: 'box-shadow 0.3s',
        }}
      >
        <div
          style={{
            margin: `${8 * scale}px`,
            padding: `${4 * scale}px`,
            border: `${1 * scale}px solid #ddd`,
            height: `calc(100% - ${24 * scale}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: `${20 * scale}px`,
              height: `${20 * scale}px`,
              borderRadius: '50%',
              border: `${2 * scale}px solid #d4a017`,
              marginBottom: `${4 * scale}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: `${8 * scale}px`,
                height: `${8 * scale}px`,
                borderRadius: '50%',
                background: '#d4a017',
              }}
            />
          </div>
          <div
            style={{
              width: '70%',
              height: `${2 * scale}px`,
              background: '#d4a017',
              margin: `${2 * scale}px 0`,
            }}
          />
          <div
            style={{
              width: '50%',
              height: `${2 * scale}px`,
              background: '#ccc',
              margin: `${2 * scale}px 0`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
