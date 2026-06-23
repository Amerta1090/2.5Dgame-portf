import { useEffect, useRef, useCallback, useState } from 'react';

interface MovementState {
  moveX: number;
  isSprinting: boolean;
}

export function usePlayerMovement(active = true): MovementState {
  const keysRef = useRef(new Set<string>());
  const [movement, setMovement] = useState<MovementState>({ moveX: 0, isSprinting: false });

  const update = useCallback(() => {
    const left = keysRef.current.has('ArrowLeft') || keysRef.current.has('KeyA');
    const right = keysRef.current.has('ArrowRight') || keysRef.current.has('KeyD');
    const sprint = keysRef.current.has('ShiftLeft') || keysRef.current.has('ShiftRight');

    let moveX = 0;
    if (left) moveX -= 1;
    if (right) moveX += 1;

    setMovement({ moveX, isSprinting: sprint });
  }, []);

  useEffect(() => {
    if (!active) {
      keysRef.current.clear();
      setMovement({ moveX: 0, isSprinting: false });
      return;
    }

    function onKeyDown(e: KeyboardEvent) {
      const code = e.code;
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'ShiftLeft', 'ShiftRight'].includes(code)) {
        e.preventDefault();
        keysRef.current.add(code);
        update();
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.code);
      update();
    }

    function onBlur() {
      keysRef.current.clear();
      setMovement({ moveX: 0, isSprinting: false });
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [active, update]);

  return movement;
}
