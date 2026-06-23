import { VIEWPORT_WIDTH } from '@game/constants';
import type { ZoneId } from '@game/types';

const ZONE_WIDTH: Record<ZoneId, number> = {
  zone1: 2000,
  zone2: 3000,
  zone3: 5000,
  zone4: 8000,
  zone5: 4000,
  zone6: 1500,
};

export function clampToWorldBounds(x: number, currentZone: ZoneId): number {
  const zoneWidth = ZONE_WIDTH[currentZone];
  const maxX = Math.max(0, zoneWidth - VIEWPORT_WIDTH);
  return Math.max(0, Math.min(x, maxX));
}

export type Collider = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function aabbCollision(
  playerX: number,
  playerY: number,
  playerWidth: number,
  playerHeight: number,
  colliders: Collider[],
): Collider | null {
  for (const c of colliders) {
    if (
      playerX < c.x + c.width &&
      playerX + playerWidth > c.x &&
      playerY < c.y + c.height &&
      playerY + playerHeight > c.y
    ) {
      return c;
    }
  }
  return null;
}
