import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface PlayerSpriteProps {
  facing: 'left' | 'right';
  walking: boolean;
}

const PALETTE: Record<string, string> = {
  '.': 'transparent',
  'k': '#08080c', // Outline/Black
  'w': '#ffffff', // Glasses/white highlights
  'y': '#FFE600', // Persona yellow highlights/shoes
  'r': '#E03030', // Crimson strings/drawstrings
  's': '#f5c68c', // Skin tone (light)
  'o': '#d4a26a', // Shaded skin
  't': '#e8b87c', // Mid skin
  'c': '#202028', // Dark grey hoodie
  'd': '#3a3a46', // Light grey hoodie detail
  'h': '#2a2a36', // Mid hoodie
  'b': '#101014', // Pants dark black
  'g': '#5a5a6e', // Dark silver/backpack
  'p': '#484858', // Mid grey backpack
  'j': '#1a1a24', // Shoe shadow
};

const IDLE_FRAMES = [
  [
    "........................",
    ".........kkkkkk.........",
    ".......kkcccccckk.......",
    "......kcccccccccck......",
    ".....kcccccccccccck.....",
    "....kcccccccccccccck....",
    "....kcccccckkkkcccck....",
    "....kcccccskkkkkscck....",
    "....kccccskkkkkkksck....",
    "....kccccskwkwkkwsck....",
    "....kccccskskskksksck...",
    "....kcccccskkkkkksck....",
    ".....kcccccssssssck.....",
    "......kcccckkkkkck......",
    ".......kcccsssssck......",
    "........kccssssck.......",
    "........kwwkkkkwwk......",
    "......kkwwyyyyyywwkk....",
    "....kkwwyyyyyyyyyywwkk..",
    "...kwwyyyyyyyyyyyyyywwk.",
    "..kwwyyyyyyyyyyyyyyyywwk",
    "..kyyyyyyyyyyyyyyyyyyyyk",
    "..kyyyyyykkkkkkkkyyyyyyk",
    "..kyyyyykkccccccckyyyyyk",
    "..kyyyykkccccccccckyyykk",
    "..kyyykkccccccccccchyyyk",
    "..kkkkkccccccccccchkkkkk",
    ".....kccccccccccccc...k.",
    ".....kccccccccccccc....h.",
    ".....kbbbbbbbbbbbbb..h..",
    ".....kbbbbbbbbbbbbb.h...",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    "......kbbbbbbbbbbb......",
    "......kbbbb...kbbb......",
    "......kbbb.....kbb......",
    "......kbb......kbb......",
    "......kbb......kbb......",
    ".....kyyyk....kyyyk.....",
    "....kyyyyk...kyyyyk.....",
    "....kkkkkk...kkkkkk.....",
    "........................",
    "........................"
  ],
  [
    "........................",
    ".........kkkkkk.........",
    ".......kkcccccckk.......",
    "......kcccccccccck......",
    ".....kcccccccccccck.....",
    "....kcccccccccccccck....",
    "....kcccccckkkkcccck....",
    "....kcccccskkkkkscck....",
    "....kccccskkkkkkksck....",
    "....kccccskwkwkkwsck....",
    "....kccccskskskksksck...",
    "....kcccccskkkkkksck....",
    ".....kcccccssssssck.....",
    "......kcccckkkkkck......",
    ".......kcccsssssck......",
    "........kccssssck.......",
    "........kwwkkkkwwk......",
    "......kkwwyyyyyywwkk....",
    "....kkwwyyyyyyyyyywwkk..",
    "...kwwyyyyyyyyyyyyyywwk.",
    "..kwwyyyyyyyyyyyyyyyywwk",
    "..kyyyyyyyyyyyyyyyyyyyyk",
    "..kyyyyyykkkkkkkkyyyyyyk",
    "..kyyyyykkccccccckyyyyyk",
    "..kyyyykkccccccccckyyykk",
    "..kyyykkccccccccccchyyyk",
    "..kkkkkccccccccccchkkkkk",
    ".....kccccccccccccc...k.",
    ".....kccccccccccccc....h.",
    ".....kbbbbbbbbbbbbb..h..",
    ".....kbbbbbbbbbbbbb.h...",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    "......kbbbbbbbbbbb......",
    "......kbbbb...kbbb......",
    "......kbbb.....kbb......",
    "......kbb......kbb......",
    "......kbb......kbb......",
    ".....kyyyk....kyyyk.....",
    "....kyyyyk...kyyyyk.....",
    "....kkkkkk...kkkkkk.....",
    "........................",
    "........................"
  ]
];

const WALK_FRAMES = [
  [
    "........................",
    ".........kkkkkk.........",
    ".......kkcccccckk.......",
    "......kcccccccccck......",
    ".....kcccccccccccck.....",
    "....kcccccccccccccck....",
    "....kcccccckkkkcccck....",
    "....kcccccskkkkkscck....",
    "....kccccskkkkkkksck....",
    "....kccccskwkwkkwsck....",
    "....kccccskskskksksck...",
    "....kcccccskkkkkksck....",
    ".....kcccccssssssck.....",
    "......kcccckkkkkck......",
    ".......kcccsssssck......",
    "........kccssssck.......",
    "........kwwkkkkwwk......",
    "......kkwwyyyyyywwkk....",
    "....kkwwyyyyyyyyyywwkk..",
    "...kwwyyyyyyyyyyyyyywwk.",
    "..kwwyyyyyyyyyyyyyyyywwk",
    "..kyyyyyyyyyyyyyyyyyyyyk",
    "..kyyyyyykkkkkkkkyyyyyyk",
    "..kyyyyykkccccccckyyyyyk",
    "..kyyyykkccccccccckyyykk",
    "..kyyykkccccccccccchyyyk",
    "..kkkkkccccccccccchkkkkk",
    ".....kccccccccccccc...k.",
    ".....kccccccccccccc....h.",
    ".....kbbbbbbbbbbbbb..h..",
    ".....kbbbbbbbbbbbbb.h...",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    "......kbbbbbbbbbbb......",
    "......kbbbb...kbbb......",
    "......kbbbb....kbb......",
    "......kbbb......kb......",
    ".....kyyyyk.....kyk.....",
    "....kyyyyyk.....kkk.....",
    "....kkkkkkk...........k.",
    "........................",
    "........................",
    "........................"
  ],
  [
    "........................",
    ".........kkkkkk.........",
    ".......kkcccccckk.......",
    "......kcccccccccck......",
    ".....kcccccccccccck.....",
    "....kccccccccccccccc....",
    "....kcccccckkkkcccck....",
    "....kcccccskkkkkscck....",
    "....kccccskkkkkkksck....",
    "....kccccskwkwkkwsck....",
    "....kccccskskskksksck...",
    "....kcccccskkkkkksck....",
    ".....kcccccssssssck.....",
    "......kcccckkkkkck......",
    ".......kcccsssssck......",
    "........kccssssck.......",
    "........kwwkkkkwwk......",
    "......kkwwyyyyyywwkk....",
    "....kkwwyyyyyyyyyywwkk..",
    "...kwwyyyyyyyyyyyyyywwk.",
    "..kwwyyyyyyyyyyyyyyyywwk",
    "..kyyyyyyyyyyyyyyyyyyyyk",
    "..kyyyyyykkkkkkkkyyyyyyk",
    "..kyyyyykkccccccckyyyyyk",
    "..kyyyykkccccccccckyyykk",
    "..kyyykkccccccccccchyyyk",
    "..kkkkkccccccccccchkkkkk",
    ".....kccccccccccccc...k.",
    ".....kccccccccccccc....h.",
    ".....kbbbbbbbbbbbbb..h..",
    ".....kbbbbbbbbbbbbb.h...",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    "......kbbbbbbbbbbb......",
    "......kbbbb...kbbb......",
    "......kbbb.....kbb......",
    "......kbb......kbb......",
    "......kbb......kbb......",
    ".....kyyyk....kyyyk.....",
    "....kyyyyk...kyyyyk.....",
    "....kkkkkk...kkkkkk.....",
    "........................",
    "........................"
  ],
  [
    "........................",
    ".........kkkkkk.........",
    ".......kkcccccckk.......",
    "......kcccccccccck......",
    ".....kcccccccccccck.....",
    "....kcccccccccccccck....",
    "....kcccccckkkkcccck....",
    "....kcccccskkkkkscck....",
    "....kccccskkkkkkksck....",
    "....kccccskwkwkkwsck....",
    "....kccccskskskksksck...",
    "....kcccccskkkkkksck....",
    ".....kcccccssssssck.....",
    "......kcccckkkkkck......",
    ".......kcccsssssck......",
    "........kccssssck.......",
    "........kwwkkkkwwk......",
    "......kkwwyyyyyywwkk....",
    "....kkwwyyyyyyyyyywwkk..",
    "...kwwyyyyyyyyyyyyyywwk.",
    "..kwwyyyyyyyyyyyyyyyywwk",
    "..kyyyyyyyyyyyyyyyyyyyyk",
    "..kyyyyyykkkkkkkkyyyyyyk",
    "..kyyyyykkccccccckyyyyyk",
    "..kyyyykkccccccccckyyykk",
    "..kyyykkccccccccccchyyyk",
    "..kkkkkccccccccccchkkkkk",
    ".....kccccccccccccc...k.",
    ".....kccccccccccccc....h.",
    ".....kbbbbbbbbbbbbb..h..",
    ".....kbbbbbbbbbbbbb.h...",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    ".....kbbbbbbbbbbbbb.....",
    "......kbbbbbbbbbbb......",
    "......kbbb...kbbbb......",
    "......kbb....kbbbb......",
    "......kb......kbbb......",
    ".....kyk.....kyyyyk.....",
    ".....kkk.....kyyyyyk....",
    ".............kkkkkkk....",
    "........................",
    "........................",
    "........................"
  ]
];

export function PlayerSprite({ facing, walking }: PlayerSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const intervalTime = walking ? 120 : 600;
    const maxFrames = walking ? WALK_FRAMES.length : IDLE_FRAMES.length;

    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % maxFrames);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [walking]);

  const activeSprite = useMemo(() => {
    if (walking) {
      return WALK_FRAMES[frameIndex] || WALK_FRAMES[0];
    }
    return IDLE_FRAMES[frameIndex] || IDLE_FRAMES[0];
  }, [walking, frameIndex]);

  const rects = useMemo(() => {
    const width = 24;
    const height = 48;
    const list: React.ReactNode[] = [];

    for (let y = 0; y < height; y++) {
      const row = activeSprite[y] || "";
      let startX = -1;
      let currentColor = "";

      for (let x = 0; x <= width; x++) {
        const char = x < width ? row[x] : "";
        const color = PALETTE[char] || "transparent";

        if (color !== currentColor) {
          if (currentColor !== "transparent" && startX !== -1) {
            const runLength = x - startX;
            list.push(
              <rect
                key={`${y}-${startX}`}
                x={startX}
                y={y}
                width={runLength}
                height={1}
                fill={currentColor}
              />
            );
          }
          startX = x;
          currentColor = color;
        }
      }
    }
    return list;
  }, [activeSprite]);

  return (
    <motion.div
      style={{
        width: 40,
        height: 80,
        transform: facing === 'left' ? 'scaleX(-1)' : undefined,
        transformOrigin: 'center',
      }}
      animate={walking ? { y: [0, -2, 0, -2, 0] } : { y: 0 }}
      transition={walking ? { repeat: Infinity, duration: 0.4, ease: 'easeInOut' } : undefined}
    >
      <svg
        viewBox="0 0 24 48"
        width={40}
        height={80}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
          shapeRendering: 'crispEdges',
        }}
      >
        {rects}
      </svg>
    </motion.div>
  );
}
