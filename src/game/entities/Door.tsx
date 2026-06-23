import type { ZoneId } from '@game/types';
import { useGameState } from '@game/state/useGameState';
import type { InteractableDef } from '@game/engine/useInteraction';

interface DoorProps {
  x: number;
  y: number;
  targetZone: ZoneId;
  isNearby: boolean;
}

export function Door({ x, y, targetZone, isNearby }: DoorProps) {
  const { dispatch } = useGameState();

  function handleEnter() {
    dispatch({ type: 'SET_ZONE', zone: targetZone });
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Door to ${targetZone}`}
      onClick={handleEnter}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleEnter(); }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 80,
        height: 120,
        zIndex: 5,
        cursor: isNearby ? 'pointer' : 'default',
        background: isNearby
          ? 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)'
          : 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        border: isNearby ? '2px solid #F0E040' : '2px solid #333',
        borderRadius: 4,
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: isNearby ? '0 0 20px rgba(240, 224, 64, 0.4)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isNearby ? '#F0E040' : '#666',
        fontSize: 24,
        fontWeight: 900,
        fontFamily: "'Impact', sans-serif",
      }}
    >
      ▶
    </div>
  );
}

export function doorToInteractable(id: string, x: number, y: number): InteractableDef {
  return { id, x, y, width: 80, height: 120 };
}
