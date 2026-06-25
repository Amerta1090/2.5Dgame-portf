import { useGameState } from '@game/state/useGameState';

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

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '12px 16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: '#888',
      }}
    >
      <div
        onClick={onMenuClick}
        style={{ cursor: onMenuClick ? 'pointer' : 'default' }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onMenuClick) onMenuClick(); }}
      >
        <span style={{ color: '#F0E040' }}>☰</span>
        {'  '}Menu
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#F0E040', fontWeight: 700, fontSize: 14 }}>
          {ZONE_LABELS[state.currentZone]}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span>⬡ {state.loreFragments.length}/9</span>
        {'  '}
        <span style={{ color: '#F0E040' }}>★ {state.achievements.length}</span>
      </div>
    </div>
  );
}
