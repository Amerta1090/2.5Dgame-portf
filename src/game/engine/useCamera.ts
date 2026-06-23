import { useSpring } from 'framer-motion';
import { useEffect } from 'react';
import type { ZoneId } from '@game/types';
import { VIEWPORT_WIDTH, CAMERA_SPRING } from '@game/constants';

const ZONE_WIDTH: Record<ZoneId, number> = {
  zone1: 2000,
  zone2: 3000,
  zone3: 5000,
  zone4: 8000,
  zone5: 4000,
  zone6: 1500,
};

export function useCamera(playerX: number, currentZone: ZoneId) {
  const spring = useSpring(0, CAMERA_SPRING);

  useEffect(() => {
    const zoneWidth = ZONE_WIDTH[currentZone];
    const maxOffset = Math.max(0, zoneWidth - VIEWPORT_WIDTH);
    const target = -Math.min(Math.max(playerX - VIEWPORT_WIDTH / 2, 0), maxOffset);
    spring.set(target);
  }, [playerX, currentZone, spring]);

  return spring;
}
