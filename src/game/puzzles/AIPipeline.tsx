import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

const PIPELINE_STAGES = [
  { id: 'data-collection', label: 'Data Collection' },
  { id: 'preprocessing', label: 'Preprocessing' },
  { id: 'training', label: 'Training' },
  { id: 'evaluation', label: 'Evaluation' },
  { id: 'deployment', label: 'Deployment' },
];

const CORRECT_ORDER = ['data-collection', 'preprocessing', 'training', 'evaluation', 'deployment'];

interface AIPipelineProps {
  onComplete: () => void;
  onClose: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function AIPipeline({ onComplete, onClose }: AIPipelineProps) {
  const [shuffled] = useState(() => shuffle(PIPELINE_STAGES));
  const [slots, setSlots] = useState<(string | null)[]>(Array(PIPELINE_STAGES.length).fill(null));
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [shakingSlots, setShakingSlots] = useState(false);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  const availableCards = useMemo(
    () => shuffled.filter((c) => !slots.includes(c.id)),
    [shuffled, slots],
  );

  const handleDragStart = useCallback((id: string) => {
    setDraggedCard(id);
  }, []);

  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      if (!draggedCard) return;
      if (slots[slotIndex] !== null) return;
      setSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = draggedCard;
        return next;
      });
      setDraggedCard(null);
      setResult('idle');
    },
    [draggedCard, slots],
  );

  const removeFromSlot = useCallback((slotIndex: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setResult('idle');
  }, []);

  const allFilled = slots.every((s) => s !== null);

  function handleSubmit() {
    const isCorrect = slots.every((id, i) => id === CORRECT_ORDER[i]);
    if (isCorrect) {
      setResult('correct');
      setTimeout(() => onComplete(), 800);
    } else {
      setResult('wrong');
      setShakingSlots(true);
      setTimeout(() => setShakingSlots(false), 500);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setTimeout(() => setShowHint(true), 1000);
      }
    }
  }

  function handleSkip() {
    onComplete();
  }

  function handleReset() {
    setSlots(Array(PIPELINE_STAGES.length).fill(null));
    setResult('idle');
    setShowHint(false);
    setDraggedCard(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2
        style={{
          color: '#F0E040',
          fontFamily: "'Impact', sans-serif",
          fontSize: 24,
          marginBottom: 8,
        }}
      >
        AI Pipeline
      </h2>
      <p
        style={{
          color: '#888',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          marginBottom: 16,
        }}
      >
        Arrange ML pipeline stages in correct order
      </p>

      <p
        style={{
          color: '#666',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          marginBottom: 24,
        }}
      >
        Click a card below, then click a slot to place it. Click a placed card to remove it.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 32,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 500,
        }}
      >
        {availableCards.map((card) => (
          <motion.div
            key={card.id}
            layout
            whileHover={{ scale: 1.05 }}
            onClick={() => handleDragStart(card.id)}
            style={{
              padding: '10px 20px',
              background: draggedCard === card.id ? '#2a2a4a' : '#1a1a2a',
              border: `2px solid ${draggedCard === card.id ? '#4080E0' : '#555'}`,
              borderRadius: 4,
              color: '#f5f5f5',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {card.label}
          </motion.div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {slots.map((slot, i) => (
          <motion.div
            key={i}
            animate={shakingSlots ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            onClick={() => {
              if (slot) {
                removeFromSlot(i);
              } else {
                handleSlotClick(i);
              }
            }}
            style={{
              width: 300,
              height: 44,
              border: `2px dashed ${slot ? '#4080E0' : '#555'}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f5f5f5',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              background: slot ? '#0d1530' : 'transparent',
              borderColor:
                result === 'correct'
                  ? '#40E060'
                  : result === 'wrong'
                    ? '#E04040'
                    : slot
                      ? '#4080E0'
                      : '#555',
              cursor: 'pointer',
            }}
          >
            {slot
              ? `${i + 1}. ${PIPELINE_STAGES.find((s) => s.id === slot)?.label}`
              : `Slot ${i + 1}`}
          </motion.div>
        ))}
      </div>

      {showHint && (
        <p
          style={{
            color: '#E0E040',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          Hint: Start with raw data, end with a live model
        </p>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleReset}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: '#888',
            padding: '8px 24px',
            borderRadius: 4,
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
          }}
        >
          Reset
        </button>

        {allFilled && (
          <button
            onClick={handleSubmit}
            style={{
              background: '#4080E0',
              border: 'none',
              color: '#fff',
              padding: '8px 24px',
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        )}

        {showHint && (
          <button
            onClick={handleSkip}
            style={{
              background: 'transparent',
              border: '1px solid #F0E040',
              color: '#F0E040',
              padding: '8px 24px',
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
            }}
          >
            Skip Puzzle
          </button>
        )}

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: '#888',
            padding: '8px 24px',
            borderRadius: 4,
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
