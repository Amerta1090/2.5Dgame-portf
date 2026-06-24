import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DraggableCard } from './DraggableCard';

interface CardData {
  id: string;
  label: string;
}

interface TimelineSortProps {
  cards: CardData[];
  correctOrder: string[];
  onComplete: () => void;
  onClose: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TimelineSort({ cards, correctOrder, onComplete, onClose }: TimelineSortProps) {
  const [shuffled] = useState(() => shuffleArray(cards));
  const [slots, setSlots] = useState<(string | null)[]>(Array(cards.length).fill(null));
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [shakingSlots, setShakingSlots] = useState(false);

  const availableCards = useMemo(
    () => shuffled.filter((c) => !slots.includes(c.id)),
    [shuffled, slots],
  );

  const handleDragEnd = useCallback((cardId: string, slotIndex: number) => {
    if (slots[slotIndex] !== null) return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = cardId;
      return next;
    });
    setResult('idle');
  }, [slots]);

  const allFilled = slots.every((s) => s !== null);

  function handleSubmit() {
    const isCorrect = slots.every((id, i) => id === correctOrder[i]);
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
    setSlots(Array(cards.length).fill(null));
    setResult('idle');
    setShowHint(false);
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
        Timeline Sort
      </h2>
      <p style={{ color: '#888', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginBottom: 32 }}>
        Arrange IoT milestones in chronological order
      </p>

      <div
        style={{
          position: 'relative',
          width: 600,
          height: 60,
          marginBottom: 40,
        }}
      >
        <AnimatePresence>
          {availableCards.map((card, i) => (
            <DraggableCard
              key={card.id}
              id={card.id}
              label={card.label}
              index={i}
              isPlaced={false}
              onDragEnd={handleDragEnd}
              slotCount={cards.length}
            />
          ))}
        </AnimatePresence>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {slots.map((slot, i) => (
          <motion.div
            key={i}
            animate={shakingSlots ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
              width: 130,
              height: 50,
              border: `2px dashed ${slot ? '#d4a017' : '#555'}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f5f5f5',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              textAlign: 'center',
              padding: '0 8px',
              background: slot ? '#1a1a2a' : 'transparent',
              borderColor: result === 'correct' ? '#40E060' : result === 'wrong' ? '#E04040' : slot ? '#d4a017' : '#555',
            }}
          >
            {slot ? cards.find((c) => c.id === slot)?.label : ''}
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
          Hint: Try ordering by date (earliest first)
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
              background: '#d4a017',
              border: 'none',
              color: '#000',
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
