import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogueBoxProps {
  visible: boolean;
  lines: string[];
  currentLine: number;
  speaker?: string;
  onAdvance: () => void;
  onClose: () => void;
}

const COLOR_PALETTE: Record<string, string> = {
  '.': 'transparent',
  'k': '#0a0a0f', // Outer black outline
  'w': '#f5f5f5', // Crisp white
  'y': '#FFE600', // Persona yellow
  'r': '#E03030', // Crimson red
  's': '#f1c27d', // Face skin tone
  'o': '#d29b5c', // Shadow skin tone
  'c': '#24242d', // Hair / hoodie body
  'd': '#444452', // Accent hoodie color
  'u': '#8e8e93', // Metal/screen light gray
  'g': '#34c759', // Matrix terminal green
};

const SPRITES = {
  investigator: [
    "................................",
    ".............kkkkkk.............",
    "...........kkcccccckk..........."
    ,"..........kcccccccccck..........",
    ".........kcccccccccccck.........",
    "........kccccccccccccccc........",
    "........kccccccckkkcccck........",
    "........kcccccskkkkkscck........",
    "........kccccskkkkkkksck........",
    ".......kccccskwkwkkkwsck........",
    ".......kccccskskskkksksck.......",
    ".......kccccskskskkksksck.......",
    ".......kcccccskkkkkkkksck.......",
    ".......kccccccskkkkkkscck........",
    "........kccccccsssssscck........",
    "........kccccckkkkkkkcck........",
    ".........kcccssssssscck.........",
    "..........kccssssssscck.........",
    "...........kcssssssck...........",
    "..........kwwkkkkkkkwwk.........",
    "........kkwwyyyyyyyyywwkk.......",
    "......kkwwyyyyyyyyyyyyywwkk.....",
    ".....kwwyyyyyyyyyyyyyyyyywwk....",
    "....kwwyyyyyyyyyyyyyyyyyyywwk...",
    "....kyyyyyyyyyyyyyyyyyyyyyyyk...",
    "....kyyyyyykkkkkkkkkkkyyyyyyk...",
    "....kyyyyykkccccccccckkyyyyyk...",
    "....kyyyykkccccccccccckkyyyyk...",
    "....kyyykkcccccccccccccchyyyk...",
    "....kkkkkccccccccccccccchkkkk...",
    "................................",
    "................................"
  ],
  system: [
    "................................",
    "......kkkkkkkkkkkkkkkkkkkk......",
    "....kkkkwwwwwwwwwwwwwwwwkkkk....",
    "...kkwwggggggggggggggggggwwkk...",
    "..kwwggggggggggggggggggggggwwk..",
    "..kwgggggkkgggggggggggggggggwwk.",
    ".kwggggggkkggggggggggggggggggwk.",
    ".kwggggggkkgggggkkkkkkkkgggggwk.",
    ".kwggggggkkgggggkkkkkkkkgggggwk.",
    ".kwgkkkkkkkkkkggkkkkkkkkgggggwk.",
    ".kwggggggkkgggggkkkkkkkkgggggwk.",
    ".kwggggggkkggggggggggggggggggwk.",
    ".kwggggggggggggggggggggggggggwk.",
    ".kwggggggggggggggggggggggggggwk.",
    "..kwggggggggggggggggggggggggwk..",
    "..kwwggggggggggggggggggggggwwk..",
    "...kkwwggggggggggggggggggwwkk...",
    "....kkkkwwwwwwwwwwwwwwwwkkkk....",
    "......kkkkkkkkkkkkkkkkkkkk......",
    "...........kkkkkkkkkk...........",
    "..........kkkkkkkkkkkk..........",
    ".........kkkkkkkkkkkkkk.........",
    "........kkkkkkkkkkkkkkkk........",
    ".......kkkkkkkkkkkkkkkkkk.......",
    "......kkkkkkkkkkkkkkkkkkkk......",
    ".....kkkkkkkkkkkkkkkkkkkkkk.....",
    "....kkkkkkkkkkkkkkkkkkkkkkkk....",
    "...kkkkkkkkkkkkkkkkkkkkkkkkkk...",
    "..kkkkkkkkkkkkkkkkkkkkkkkkkkkk..",
    "..kkkkkkkkkkkkkkkkkkkkkkkkkkkk..",
    "................................",
    "................................"
  ],
  academy: [
    "................................",
    ".............kkkkk..............",
    "............kkyywwk.............",
    "...........kkyyyyywk............",
    "..........kkyyyyyywk............",
    ".........kkyyyyyyywk............",
    ".........kyyyyyyyywk............",
    "........kyyyyyyyywwk............",
    ".......kyyyyyyyyywk.............",
    "......kyyyyyyyyyywk.............",
    ".....kyyyyyyyyyywk..............",
    "....kyyyyyyyyyywwk..............",
    "...kwwwwwwwwwwwwkkkkkkkk........",
    "...kwwwwwwwwwwwkkkkkkkkkkk......",
    "...kwwwwwwwwwwkyyyyyyyyyykk.....",
    "...kwwwwwwwwwkyyyyyyyyyyyywk....",
    "...kwwwwwwwwkyyyyyyyyyyyyywk....",
    "...kwwwwwwwkyyyyyyyyyyyyyywk....",
    "...kwwwwwwkyyyyyyyyyyyyyyywk....",
    "...kwwwwwkyyyyyyyyyyyyyyyywk....",
    "...kwwwwkyyyyyyyyyyyyyyyyywk....",
    "...kwwwkyyyyyyyyyyyyyyyyyywk....",
    "...kwwkyyyyyyyyyyyyyyyyyyywk....",
    "...kwkyyyyyyyyyyyyyyyyyyyywk....",
    "...kkyyyyyyyyyyyyyyyyyyyyywk....",
    "....kkwwwwwwwwwwwwwwwwwwwwk.....",
    "......kkkkkkkkkkkkkkkkkkkk......",
    ".........krrrrrrrrrrrk..........",
    "........krrrrrrrrrrrrrk.........",
    "........krrrrrrrrrrrrrk.........",
    ".........krrrrrrrrrrrk..........",
    "................................"
  ],
  workshop: [
    "................................",
    "............kkkkkkkk............",
    "..........kkkkkkkkkkkk..........",
    "........kkkkkkuuuukkkkkk........",
    ".......kkkkuuuuuuuuuukkkk.......",
    "......kkkkuuuuukkkkuuuukkk......",
    ".....kkkkuuuukk..kkuuuukkkk.....",
    "....kkkkuuuukk....kkuuuukkkk....",
    "....kkkuuuukk......kkuuuukkk....",
    "...kkkuuuukk........kkuuuukkk...",
    "...kkuuuukk..........kkuuuukk...",
    "..kkuuuukk............kkuuuukk..",
    "..kkuuuuk..............kkuuuuk..",
    "..kkuuuuk..............kkuuuuk..",
    "..kkuuuuk..............kkuuuuk..",
    "..kkuuuuk..............kkuuuuk..",
    "..kkuuuuk..............kkuuuuk..",
    "..kkuuuuk..............kkuuuuk..",
    "..kkuuuuk..............kkuuuuk..",
    "..kkuuuukk............kkuuuukk..",
    "...kkuuuukk..........kkuuuukk...",
    "...kkkuuuukk........kkuuuukkk...",
    "....kkkuuuukk......kkuuuukkk....",
    "....kkkkuuuukk....kkuuuukkkk....",
    ".....kkkkuuuukk..kkuuuukkkk.....",
    "......kkkkuuuuukkkkuuuukkk......",
    ".......kkkkuuuuuuuuuukkkk.......",
    "........kkkkkkuuuukkkkkk........",
    "..........kkkkkkkkkkkk..........",
    "............kkkkkkkk............",
    "................................",
    "................................"
  ],
  project: [
    "................................",
    "........kkkkkkkkkkkkkk..........",
    ".......kyyyyyyyyyyyyyyk.........",
    "......kyyyyyyyyyyyyyyyyk........",
    ".....kyyyyyyyyyyyyyyyyyyk.......",
    "....kyyyyyykkkkkkkkkkkkkkkk.....",
    "....kyyyyykyyyyyyyyyyyyyyyyk....",
    "....kyyyyykyyyyyyyyyyyyyyyyk....",
    "....kyyyyykyyyyykkkkkyyyyyyk....",
    "....kyyyyykyyyykkkkkkkyyyyyk....",
    "....kyyyyykyyykkkkkkkkkyyyyk....",
    "....kyyyyykyykkkkkkkkkkkyyyk....",
    "....kyyyyykyykkkkkkkkkkkyyyk....",
    "....kyyyyykyykkkwwwwwkkkyyyk....",
    "....kyyyyykyykkkwwwwwkkkyyyk....",
    "....kyyyyykyykkkkkkkkkkkyyyk....",
    "....kyyyyykyykkkkkkkkkkkyyyk....",
    "....kyyyyykyykkkkkkkkkkkyyyk....",
    "....kyyyyykyyykkkkkkkkkyyyyk....",
    "....kyyyyykyyyykkkkkkkyyyyyk....",
    "....kyyyyykyyyyykkkkkyyyyyyk....",
    "....kyyyyykyyyyyyyyyyyyyyyyk....",
    "....kyyyyykyyyyyyyyyyyyyyyyk....",
    "....kyyyyykyyyyyyyyyyyyyyyyk....",
    "....kyyyyykyyyyyyyyyyyyyyyyk....",
    ".....kyyyykyyyyyyyyyyyyyykk.....",
    "......kyyykyyyyyyyyyyyyykk......",
    ".......kyykyyyyyyyyyyyykk.......",
    "........kykyyyyyyyyyykk.........",
    ".........kkkkkkkkkkkk...........",
    "................................",
    "................................"
  ],
  career: [
    "................................",
    "...........kkkkkkkk.............",
    "..........kuuuuuuuuk............",
    ".........kuuuuuuuuuuk...........",
    "........kuuuukkkkuuuuk..........",
    ".......kkkkkkkkkkkkkkkk.........",
    "......kcccccccccccccccck........",
    ".....kcccccccccccccccccck.......",
    "....kcccccccccccccccccccck......",
    "...kcccccccccccccccccccccck.....",
    "..kcccccccccccccccccccccccck....",
    "..kcccyyyyyyyyyyyyyyyyyyccck....",
    "..kcccyyyyyyyyyyyyyyyyyyccck....",
    "..kcccyykkkkkkkkkkkkkkyyccck....",
    "..kcccyykuuuuuuuuuuuukyyccck....",
    "..kcccyykuuuuuuuuuuuukyyccck....",
    "..kcccyykuuuukkkkuuuukyyccck....",
    "..kcccyykuuuukkkkuuuukyyccck....",
    "..kcccyykuuuuuuuuuuuukyyccck....",
    "..kcccyykuuuuuuuuuuuukyyccck....",
    "..kcccyykkkkkkkkkkkkkkyyccck....",
    "..kcccyyyyyyyyyyyyyyyyyyccck....",
    "..kcccyyyyyyyyyyyyyyyyyyccck....",
    "..kccccccccccccccccccccccck.....",
    "...kcccccccccccccccccccccck.....",
    "....kcccccccccccccccccccck......",
    ".....kcccccccccccccccccck.......",
    "......kcccccccccccccccck........",
    ".......kkkkkkkkkkkkkkkk.........",
    "................................",
    "................................",
    "................................"
  ],
  cognitive: [
    "................................",
    ".............kkk................",
    "............krrrk...............",
    "...........krrrrrk..............",
    "..........krrrrrrrk.............",
    ".........krrrrrrrrrk............",
    "........krrrrrrrrrrrk...........",
    ".......krrrrrrrrrrrrrk..........",
    "......krrrrrrrrrrrrrrrk.........",
    ".....krrrrrkkkkkkkrrrrrk........",
    "....krrrrrkkwwwwwkkrrrrrk.......",
    "....krrrrkkwwwwwwwkkrrrrk.......",
    "....krrrrkkwwwwwkkkrrrrrk.......",
    "....krrrrrkkkkkkkrrrrrrk........",
    ".....krrrrrrrrrrrrrrrrk.........",
    "......krrrrrrrrrrrrrrk..........",
    "......krrrrrrrrrrrrrk...........",
    ".......krrrrrrrrrrrk............",
    "........krrrrrrrrrk.............",
    ".........krrrrrrrk..............",
    "..........krrrrrk...............",
    "...........krrrk................",
    "............kkk.................",
    ".............k..................",
    "............kyk.................",
    "...........kyyyk................",
    "..........kyyyyyk...............",
    ".........kyyyyyyyk..............",
    "..........kyyyyyk...............",
    "...........kyyyk................",
    "............kyk.................",
    ".............k.................."
  ]
};

function PixelSprite({ spriteName, size = 96 }: { spriteName: keyof typeof SPRITES; size?: number }) {
  const sprite = SPRITES[spriteName] || SPRITES.system;
  const width = 32;
  const height = 32;

  const rects = useMemo(() => {
    const list: React.ReactNode[] = [];
    for (let y = 0; y < height; y++) {
      const row = sprite[y] || "";
      let startX = -1;
      let currentColor = "";

      for (let x = 0; x <= width; x++) {
        const char = x < width ? row[x] : "";
        const color = COLOR_PALETTE[char] || "transparent";

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
  }, [sprite]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      style={{
        display: "block",
        imageRendering: "pixelated",
        shapeRendering: "crispEdges",
      }}
    >
      {rects}
    </svg>
  );
}

export function DialogueBox({
  visible,
  lines,
  currentLine,
  speaker,
  onAdvance,
  onClose,
}: DialogueBoxProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const text = lines[currentLine] || '';
  const isTyping = displayedChars < text.length;
  const isLastLine = currentLine >= lines.length - 1;

  useEffect(() => {
    setDisplayedChars(0);
  }, [currentLine, visible]);

  useEffect(() => {
    if (!visible) return;

    if (displayedChars < text.length) {
      timerRef.current = setInterval(() => {
        setDisplayedChars((c) => Math.min(c + 1, text.length));
      }, 25);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [displayedChars, text.length, visible]);

  const handleAction = useCallback(() => {
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedChars(text.length);
    } else if (isLastLine) {
      onClose();
    } else {
      onAdvance();
    }
  }, [isTyping, isLastLine, text.length, onAdvance, onClose]);

  useEffect(() => {
    if (!visible) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAction();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, handleAction]);

  // Determine speaker type to show the correct pixel portrait
  const spriteName = useMemo((): keyof typeof SPRITES => {
    if (!speaker) return 'investigator';
    const s = speaker.toUpperCase();
    if (s.includes('SYSTEM') || s.includes('TERMINAL') || s.includes('GATE') || s.includes('BOOTH')) return 'system';
    if (s.includes('ACADEMY') || s.includes('DIPLOMA') || s.includes('HONOR')) return 'academy';
    if (s.includes('WORKSHOP') || s.includes('LAB') || s.includes('SKILL') || s.includes('BENCH')) return 'workshop';
    if (s.includes('PROJECT') || s.includes('DATABASE')) return 'project';
    if (s.includes('CAREER') || s.includes('EXPERIENCE') || s.includes('STATION')) return 'career';
    if (s.includes('CORE') || s.includes('INNER') || s.includes('ECHO') || s.includes('MOTIVATION')) return 'cognitive';
    return 'investigator';
  }, [speaker]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleAction}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 900,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            paddingBottom: '4vh',
          }}
        >
          {/* Persona-style slanted container wrapper */}
          <motion.div
            initial={{ y: 80, rotate: -2, opacity: 0 }}
            animate={{ y: 0, rotate: -1, opacity: 1 }}
            exit={{ y: 80, rotate: -2, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            style={{
              background: '#0E0E0E',
              border: '3px solid #FFE600',
              boxShadow: '10px 10px 0px #E03030',
              padding: '24px 32px',
              maxWidth: 900,
              width: '90%',
              minHeight: 180,
              color: '#f5f5f5',
              position: 'relative',
              display: 'flex',
              gap: 24,
              alignItems: 'center',
              transform: 'skewX(-4deg)', // Slanted container
            }}
          >
            {/* Portrait area */}
            <div
              style={{
                flexShrink: 0,
                width: 104,
                height: 104,
                border: '3px solid #FFE600',
                background: '#1A1A1A',
                boxShadow: '4px 4px 0px #E03030',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                transform: 'skewX(4deg) rotate(-2deg)', // Undo slant + custom rotate
              }}
            >
              {/* Halftone backdrop */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.15,
                  background: 'radial-gradient(circle, #FFE600 20%, transparent 20%)',
                  backgroundSize: '8px 8px',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <PixelSprite spriteName={spriteName} size={96} />
            </div>

            {/* Content area */}
            <div
              style={{
                flexGrow: 1,
                transform: 'skewX(4deg)', // Undo slant for readability
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {/* Speaker Label */}
              {speaker && (
                <div
                  style={{
                    position: 'absolute',
                    top: -24,
                    left: 20,
                    background: '#FFE600',
                    color: '#0E0E0E',
                    padding: '4px 16px',
                    fontWeight: 900,
                    fontFamily: "'Impact', sans-serif",
                    fontSize: 14,
                    letterSpacing: '0.05em',
                    boxShadow: '4px 4px 0px #E03030',
                    transform: 'skewX(-6deg) rotate(-1.5deg)',
                  }}
                >
                  {speaker}
                </div>
              )}

              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.6,
                  minHeight: '2.5em',
                  whiteSpace: 'pre-wrap',
                  color: '#FFFFFF',
                  fontWeight: 500,
                  textShadow: '1px 1px 1px #000',
                }}
              >
                {text.slice(0, displayedChars)}
                {isTyping && (
                  <span
                    style={{
                      color: '#FFE600',
                      animation: 'pulse 0.4s ease-in-out infinite',
                    }}
                  >
                    █
                  </span>
                )}
              </p>

              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 230, 0, 0.15)',
                  paddingTop: 8,
                }}
              >
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                  2.5D Cognitive System v1.9
                </div>
                <div
                  style={{
                    color: '#FFE600',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    animation: !isTyping ? 'pulse 1s ease-in-out infinite' : 'none',
                  }}
                >
                  {isLastLine ? '[E] Close Dialog' : '[E] Continue'}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

