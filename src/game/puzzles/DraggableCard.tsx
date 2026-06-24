import { motion } from 'framer-motion';

interface DraggableCardProps {
  id: string;
  label: string;
  index: number;
  isPlaced: boolean;
  onDragEnd: (id: string, slotIndex: number) => void;
  slotCount: number;
}

const SLOT_WIDTH = 130;
const SLOT_GAP = 16;

export function DraggableCard({ id, label, index, isPlaced, onDragEnd, slotCount }: DraggableCardProps) {
  const slotPositions = Array.from({ length: slotCount }, (_, i) => ({
    x: -((slotCount - 1) * (SLOT_WIDTH + SLOT_GAP)) / 2 + i * (SLOT_WIDTH + SLOT_GAP),
    threshold: SLOT_WIDTH / 2,
  }));

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    let closestSlot = -1;
    let closestDist = Infinity;
    slotPositions.forEach((slot, i) => {
      const dist = Math.abs(info.offset.x - slot.x);
      if (dist < closestDist) {
        closestDist = dist;
        closestSlot = i;
      }
    });
    if (closestSlot >= 0 && closestDist < SLOT_WIDTH) {
      onDragEnd(id, closestSlot);
    }
  }

  if (isPlaced) return null;

  return (
    <motion.div
      drag="x"
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
      style={{
        position: 'absolute',
        top: 0,
        left: `calc(50% + ${(index - (slotCount - 1) / 2) * (SLOT_WIDTH + SLOT_GAP)}px)`,
        width: SLOT_WIDTH,
        height: 50,
        background: '#1a1a2a',
        border: '1px solid #d4a017',
        borderRadius: 4,
        color: '#F0E040',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8px',
        textAlign: 'center',
        cursor: 'grab',
        userSelect: 'none',
        zIndex: 10,
      }}
      layout
    >
      {label}
    </motion.div>
  );
}
