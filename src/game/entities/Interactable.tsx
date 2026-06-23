import { type ReactNode } from 'react';

interface InteractableProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isNearby: boolean;
  onClick: () => void;
  children?: ReactNode;
}

export function Interactable({ x, y, width, height, isNearby, onClick, children }: InteractableProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Interactable object"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        zIndex: 5,
        cursor: isNearby ? 'pointer' : 'default',
        transition: 'box-shadow 0.3s',
        boxShadow: isNearby ? '0 0 16px rgba(240, 224, 64, 0.8)' : 'none',
        border: isNearby ? '1px solid rgba(240, 224, 64, 0.4)' : '1px solid transparent',
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  );
}
