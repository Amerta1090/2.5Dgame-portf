import { useMemo } from 'react';

interface CertificateFrameProps {
  x: number;
  y: number;
  scale?: number;
  isNearby?: boolean;
}

const PALETTE: Record<string, string> = {
  '.': 'transparent',
  'k': '#08080c', // Outline
  'y': '#FFE600', // Gold Frame
  'w': '#ffffff', // Paper white
  'r': '#E03030', // Red seal
  'd': '#8e8e93', // Text grey
  'u': '#555562', // Shaded Gold
};

const SPRITE = [
  "kkkkkkkkkkkkkkkk",
  "kyyyyyyyyyyyyyyk",
  "kyuuuuuuuuuuuuyk",
  "kyuwwwwwwwwwwuyk",
  "kyuwddddddddwuyk",
  "kyuwwwwwwwwwwuyk",
  "kyuwddddddddwuyk",
  "kyuwwwwwwwwwwuyk",
  "kyuwwddddddwwuyk",
  "kyuwwwwwwwwwwuyk",
  "kyuwwwrrwwwwwuyk",
  "kyuwwwrrwwwwwuyk",
  "kyuwwwwwwwwwwuyk",
  "kyuuuuuuuuuuuuyk",
  "kyyyyyyyyyyyyyyk",
  "kkkkkkkkkkkkkkkk"
];

export function CertificateFrame({ x, y, scale = 3.5, isNearby }: CertificateFrameProps) {
  const width = 16;
  const height = 16;

  const rects = useMemo(() => {
    const list: React.ReactNode[] = [];
    for (let yIndex = 0; yIndex < height; yIndex++) {
      const row = SPRITE[yIndex] || "";
      let startX = -1;
      let currentColor = "";

      for (let xIndex = 0; xIndex <= width; xIndex++) {
        const char = xIndex < width ? row[xIndex] : "";
        const color = PALETTE[char] || "transparent";

        if (color !== currentColor) {
          if (currentColor !== "transparent" && startX !== -1) {
            const runLength = xIndex - startX;
            list.push(
              <rect
                key={`${yIndex}-${startX}`}
                x={startX}
                y={yIndex}
                width={runLength}
                height={1}
                fill={currentColor}
              />
            );
          }
          startX = xIndex;
          currentColor = color;
        }
      }
    }
    return list;
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width * scale,
        height: height * scale,
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: isNearby
            ? '0 0 16px #FFE600'
            : '0 0 8px rgba(255, 230, 0, 0.25)',
          transition: 'box-shadow 0.3s',
        }}
      />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width * scale}
        height={height * scale}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
          shapeRendering: 'crispEdges',
        }}
      >
        {rects}
      </svg>
    </div>
  );
}
