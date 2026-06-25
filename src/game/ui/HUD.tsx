import { useMemo } from 'react';
import { useGameState } from '@game/state/useGameState';
import { COLORS, GeometricDivider } from '@game/art/designSystem';

const ZONE_LABELS: Record<string, string> = {
  zone1: 'Spawn Area',
  zone2: 'Academy Room',
  zone3: 'Workshop',
  zone4: 'Project District',
  zone5: 'Career Corridor',
  zone6: 'Final Room',
};

interface HUDProps {
  onMenuClick?: () => void;
}

export function HUD({ onMenuClick }: HUDProps) {
  const { state } = useGameState();
  const zoneLabel = ZONE_LABELS[state.currentZone] || state.currentZone;

  const hudContent = useMemo(() => (
    <>
      {/* Left section — Menu */}
      <div
        onClick={onMenuClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onMenuClick) onMenuClick(); }}
        style={{
          cursor: onMenuClick ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          border: `1px solid ${COLORS.primary}33`,
          background: 'rgba(10, 10, 10, 0.7)',
          borderRadius: 2,
          transform: 'skewX(-6deg)',
          transition: 'border-color 0.2s, background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = COLORS.primary;
          e.currentTarget.style.background = 'rgba(10, 10, 10, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${COLORS.primary}33`;
          e.currentTarget.style.background = 'rgba(10, 10, 10, 0.7)';
        }}
      >
        {/* SVG hamburger icon */}
        <svg width={14} height={12} viewBox="0 0 14 12">
          <rect x={0} y={0} width={14} height={2} rx={1} fill={COLORS.primary} />
          <rect x={0} y={5} width={14} height={2} rx={1} fill={COLORS.primary} />
          <rect x={0} y={10} width={14} height={2} rx={1} fill={COLORS.primary} />
        </svg>
        <span style={{ color: COLORS.primary, fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', fontFamily: "'Impact', sans-serif" }}>
          MENU
        </span>
      </div>

      {/* Center — Zone Name */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            color: COLORS.primary,
            fontWeight: 700,
            fontSize: 13,
            fontFamily: "'Impact', sans-serif",
            letterSpacing: '0.08em',
            textShadow: `0 0 20px ${COLORS.primaryGlow}`,
          }}
        >
          {zoneLabel.toUpperCase()}
        </div>
      </div>

      {/* Right section — Lore & Achievements */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(10, 10, 10, 0.5)',
            borderRadius: 2,
          }}
        >
          <svg width={12} height={12} viewBox="0 0 12 12">
            <polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 10,12 6,9 2,12 3.5,7.5 0,4.5 4.5,4.5" fill={COLORS.primary} opacity={0.6} />
          </svg>
          <span style={{ color: '#888', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            {state.loreFragments.length}/9
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            border: `1px solid ${COLORS.primary}33`,
            background: 'rgba(10, 10, 10, 0.5)',
            borderRadius: 2,
          }}
        >
          <span style={{ color: COLORS.primary, fontSize: 11 }}>★</span>
          <span style={{ color: COLORS.primary, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            {state.achievements.length}
          </span>
        </div>
      </div>
    </>
  ), [state.currentZone, state.loreFragments.length, state.achievements.length, onMenuClick]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '8px 12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: '#888',
      }}
    >
      <GeometricDivider width="100%" color={COLORS.primary} thickness={1} slant />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 0',
        }}
      >
        {hudContent}
      </div>
    </div>
  );
}
