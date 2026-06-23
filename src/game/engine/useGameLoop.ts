import { useEffect, useRef } from 'react';

export function useGameLoop(callback: (delta: number) => void, active = true) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    let lastTime = performance.now();
    let rafId: number;

    function tick(now: number) {
      const delta = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;
      callbackRef.current(delta);
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active]);
}
