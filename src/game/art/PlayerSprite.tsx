import { motion } from 'framer-motion';

interface PlayerSpriteProps {
  facing: 'left' | 'right';
  walking: boolean;
}

export function PlayerSprite({ facing, walking }: PlayerSpriteProps) {
  return (
    <motion.div
      style={{
        width: 40,
        height: 80,
        transform: facing === 'left' ? 'scaleX(-1)' : undefined,
        transformOrigin: 'center',
      }}
      animate={walking ? { y: [0, -2, 0, -2, 0] } : { y: 0 }}
      transition={walking ? { repeat: Infinity, duration: 0.3, ease: 'easeInOut' } : undefined}
    >
      <svg viewBox="0 0 40 80" width={40} height={80} style={{ display: 'block' }}>
        {/* Backpack */}
        <rect x={8} y={28} width={8} height={26} rx={2} fill="#1a1a1a" />

        {/* Arms */}
        <rect x={2} y={29} width={7} height={5} rx={2} fill="#2a2a2a" />
        <rect x={31} y={29} width={7} height={5} rx={2} fill="#2a2a2a" />

        {/* Legs */}
        <rect x={10} y={56} width={7} height={20} rx={2} fill="#1a1a1a" />
        <rect x={23} y={56} width={7} height={20} rx={2} fill="#1a1a1a" />

        {/* Shoes */}
        <rect x={8} y={74} width={10} height={4} rx={1.5} fill="#333" />
        <rect x={22} y={74} width={10} height={4} rx={1.5} fill="#333" />

        {/* Body (hoodie) */}
        <rect x={11} y={25} width={18} height={34} rx={3} fill="#2a2a2a" />

        {/* Neck */}
        <rect x={16} y={22} width={8} height={4} rx={1.5} fill="#d4a574" />

        {/* Head */}
        <circle cx={20} cy={14} r={11} fill="#d4a574" />

        {/* Hair */}
        <path d="M9 14 Q9 3 20 3 Q31 3 31 14 L31 11 Q31 1 20 1 Q9 1 9 11 Z" fill="#1a1a1a" />

        {/* Eyes */}
        <circle cx={16} cy={13} r={1} fill="#f5f5f5" />
        <circle cx={24} cy={13} r={1} fill="#f5f5f5" />
        <circle cx={16} cy={13} r={0.5} fill="#111" />
        <circle cx={24} cy={13} r={0.5} fill="#111" />
      </svg>
    </motion.div>
  );
}
