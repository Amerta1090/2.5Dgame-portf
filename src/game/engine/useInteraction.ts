import { useEffect, useRef, useState } from 'react';
import { INTERACTION_DISTANCE } from '@game/constants';

export interface InteractableDef {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useInteraction(
  playerX: number,
  playerY: number,
  interactables: InteractableDef[],
  active = true,
) {
  const [nearby, setNearby] = useState<InteractableDef | null>(null);
  const nearbyRef = useRef<InteractableDef | null>(null);

  useEffect(() => {
    if (!active) {
      setNearby(null);
      nearbyRef.current = null;
      return;
    }

    const playerCenterX = playerX + 15;
    const playerCenterY = playerY + 30;

    let closest: InteractableDef | null = null;
    let closestDist = Infinity;

    for (const obj of interactables) {
      const cx = obj.x + obj.width / 2;
      const cy = obj.y + obj.height / 2;
      const dx = playerCenterX - cx;
      const dy = playerCenterY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < INTERACTION_DISTANCE && dist < closestDist) {
        const overlap =
          playerCenterX < obj.x + obj.width + INTERACTION_DISTANCE &&
          playerCenterX > obj.x - INTERACTION_DISTANCE &&
          playerCenterY < obj.y + obj.height + INTERACTION_DISTANCE &&
          playerCenterY > obj.y - INTERACTION_DISTANCE;

        if (overlap) {
          closest = obj;
          closestDist = dist;
        }
      }
    }

    setNearby(closest);
    nearbyRef.current = closest;
  }, [playerX, playerY, interactables, active]);

  return nearby;
}
