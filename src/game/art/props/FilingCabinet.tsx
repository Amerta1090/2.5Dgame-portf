import { useMemo } from 'react';

interface FilingCabinetProps {
  x: number;
  y: number;
  scale?: number;
  drawers?: number;
}

const PALETTE: Record<string, string> = {
  '.': 'transparent',
  'k': '#08080c', // Outline
  'c': '#1d1d24', // Base cabinet grey
  'd': '#333340', // Highlight cabinet grey
  'y': '#FFE600', // Persona yellow accents
  'u': '#111116', // Dark cabinet shadow
  'w': '#ffffff', // Shine
};

const SPRITE_3_DRAWERS = [
  "........................",
  ".....kkkkkkkkkkkkkk.....",
  "....kddddddddddddddk....",
  "...kdccccccccccccccdk...",
  "..kdccccccccccccccccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdcskyyyyyyyyyykscck..",
  "..kdcckyyyyyyyyyykccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdccccccccccccccccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdcskyyyyyyyyyykscck..",
  "..kdcckyyyyyyyyyykccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdccccccccccccccccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdcskyyyyyyyyyykscck..",
  "..kdcckyyyyyyyyyykccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kuuuuuuuuuuuuuuuuukk..",
  "..kuuuuuuuuuuuuuuuuukk..",
  "...kkkkkkkkkkkkkkkkkk...",
  "....kck..........kck....",
  "....kkk..........kkk...."
];

const SPRITE_4_DRAWERS = [
  "........................",
  ".....kkkkkkkkkkkkkk.....",
  "....kddddddddddddddk....",
  "...kdccccccccccccccdk...",
  "..kdccccccccccccccccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdcskyyyyyyyyyykscck..",
  "..kdcckyyyyyyyyyykccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdccccccccccccccccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdcskyyyyyyyyyykscck..",
  "..kdcckyyyyyyyyyykccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdccccccccccccccccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdcskyyyyyyyyyykscck..",
  "..kdcckyyyyyyyyyykccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdccccccccccccccccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kdcskyyyyyyyyyykscck..",
  "..kdcckyyyyyyyyyykccdk..",
  "..kdcckkkkkkkkkkkkccdk..",
  "..kuuuuuuuuuuuuuuuuukk..",
  "..kuuuuuuuuuuuuuuuuukk..",
  "...kkkkkkkkkkkkkkkkkk...",
  "....kck..........kck....",
  "....kkk..........kkk...."
];

export function FilingCabinet({ x, y, scale = 2.5, drawers = 4 }: FilingCabinetProps) {
  const width = 24;
  const sprite = drawers === 3 ? SPRITE_3_DRAWERS : SPRITE_4_DRAWERS;
  const height = sprite.length;

  const rects = useMemo(() => {
    const list: React.ReactNode[] = [];
    for (let yIndex = 0; yIndex < height; yIndex++) {
      const row = sprite[yIndex] || "";
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
  }, [sprite, height]);

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
