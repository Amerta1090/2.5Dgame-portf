import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogueBoxProps {
  visible: boolean;
  lines: string[];
  currentLine: number;
  speaker?: string;
  onAdvance: () => void;
  onClose: () => void;
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
      }, 30);
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
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            style={{
              background: '#0A0A0A',
              border: '2px solid #F0E040',
              borderRadius: 4,
              padding: '24px 32px',
              maxWidth: 600,
              width: '80%',
              color: '#f5f5f5',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              lineHeight: 1.6,
              position: 'relative',
            }}
          >
            {speaker && (
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 16,
                  background: '#0A0A0A',
                  padding: '0 8px',
                  color: '#F0E040',
                  fontWeight: 700,
                  fontFamily: "'Impact', sans-serif",
                  fontSize: 12,
                }}
              >
                {speaker}
              </div>
            )}

            <p style={{ margin: 0, minHeight: '1.6em', whiteSpace: 'pre-wrap' }}>
              {text.slice(0, displayedChars)}
              {isTyping && (
                <span
                  style={{
                    color: '#F0E040',
                    animation: 'blink 0.5s step-end infinite',
                  }}
                >
                  ▌
                </span>
              )}
            </p>

            {!isTyping && (
              <p
                style={{
                  margin: '16px 0 0',
                  color: '#888',
                  fontSize: 12,
                  textAlign: 'right',
                }}
              >
                {isLastLine ? '[Press E to close]' : '[Press E to continue]'}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
