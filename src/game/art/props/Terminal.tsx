import { useMemo } from 'react';

interface TerminalProps {
  x: number;
  y: number;
  scale?: number;
}

const PALETTE: Record<string, string> = {
  '.': 'transparent',
  'k': '#08080c', // Outline
  'c': '#1e1e24', // Cabinet base grey
  'd': '#343440', // Cabinet highlight grey
  'y': '#FFE600', // Persona yellow accents
  'g': '#0e5c26', // Deep green screen
  'l': '#39d353', // Bright matrix green text/lines
  'u': '#8e8e93', // Metallic grey keyboard
  'w': '#ffffff', // Reflection/white
};

const SPRITE = [
  "................................",
  ".......kkkkkkkkkkkkkkkkkk.......",
  "......kddddddddddddddddddk......",
  ".....kdccccccccccccccccccdk.....",
  "....kdccccccccccccccccccccdk....",
  "....kdcckkkkkkkkkkkkkkkkccdk....",
  "....kdcckyyyyyyyyyyyyyykccdk....",
  "....kdcckygglgggggggggykccdk....",
  "....kdcckyglglggggglggykccdk....",
  "....kdcckygggglgggggggykccdk....",
  "....kdcckygggglglglglgykccdk....",
  "....kdcckyggggggggggggykccdk....",
  "....kdcckyyyyyyyyyyyyyykccdk....",
  "....kdcckkkkkkkkkkkkkkkkccdk....",
  "....kdccccccccccccccccccdk.....",
  ".....kddddddddddddddddddk......",
  "......kkkkkkkkkkkkkkkkkk........",
  "............kcccck..............",
  "............kcccck..............",
  "...........kddddddk.............",
  ".........kkkkkkkkkkkk...........",
  "........kuuuuuuuuuuuuk..........",
  "........kuuuuuuuuuuuuk..........",
  "........kkkkkkkkkkkkkk.........."
];

export function Terminal({ x, y, scale = 2.5 }: TerminalProps) {
  const width = 32;
  const height = 24;

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
      {/* Screen glow shadow */}
      <div
        style={{
          position: 'absolute',
          left: 4 * scale,
          top: 6 * scale,
          width: 16 * scale,
          height: 8 * scale,
          background: '#39d353',
          filter: 'blur(20px)',
          opacity: 0.25,
          pointerEvents: 'none',
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
