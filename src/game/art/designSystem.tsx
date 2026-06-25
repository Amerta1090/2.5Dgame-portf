import React from 'react';

// Persona-inspired color palette
export const COLORS = {
  primary: '#F0E040',
  primaryDark: '#C8B830',
  primaryGlow: 'rgba(240, 224, 64, 0.6)',
  bg: '#0A0A0A',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  text: '#F5F5F5',
  textMuted: '#888888',
  danger: '#E04040',
  success: '#40E060',
  info: '#4080E0',
  accentBlue: '#4080E0',
  accentOrange: '#E07040',
  accentGreen: '#40E060',
  accentCyan: '#00E0E0',
};

// Persona-style diagonal cut SVG clip paths
export const CLIP_PATHS = {
  diagonalRight: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
  diagonalLeft: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
  chevronTop: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)',
  chevronBottom: 'polygon(0 10%, 50% 0, 100% 10%, 100% 100%, 0 100%)',
  hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  skewed: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
};

// SVG Decorative Corner elements (Persona-style)
export function CornerBrackets({ size = 20, color = COLORS.primary }: { size?: number; color?: string }) {
  return (
    <svg width={size * 2} height={size * 2} style={{ position: 'absolute', top: 0, left: 0 }}>
      <path d={`M 0 ${size} L 0 0 L ${size} 0`} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}

export function CornerBracketsBottomRight({ size = 20, color = COLORS.primary }: { size?: number; color?: string }) {
  return (
    <svg width={size * 2} height={size * 2} style={{ position: 'absolute', bottom: 0, right: 0 }}>
      <path d={`M 0 ${size} L 0 ${size * 2} L ${size} ${size * 2}`} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}

// Halftone pattern as SVG data URI
export function HalftonePattern({ color = COLORS.primary, opacity = 0.08, size = 4 }: { color?: string; opacity?: number; size?: number }) {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
      <defs>
        <pattern id={`halftone-${size}`} width={size * 2} height={size * 2} patternUnits="userSpaceOnUse">
          <circle cx={size} cy={size} r={size * 0.3} fill={color} />
          <circle cx={size * 2} cy={size * 2} r={size * 0.3} fill={color} opacity={0.5} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#halftone-${size})`} />
    </svg>
  );
}

// Geometric divider line (Persona-style diagonal accent)
export function GeometricDivider({
  width = '100%',
  color = COLORS.primary,
  thickness = 2,
  slant = false,
}: {
  width?: string | number;
  color?: string;
  thickness?: number;
  slant?: boolean;
}) {
  return (
    <div
      style={{
        width,
        height: slant ? thickness * 3 : thickness,
        background: slant
          ? `linear-gradient(90deg, transparent 0%, ${color} 20%, ${color} 80%, transparent 100%)`
          : color,
        transform: slant ? 'skewX(-20deg)' : undefined,
        margin: '8px 0',
      }}
    />
  );
}

// Persona-style panel with diagonal corners
export function StyledPanel({
  children,
  borderColor = COLORS.primary,
  bgColor = 'rgba(10, 10, 10, 0.92)',
  accent = true,
  style,
}: {
  children: React.ReactNode;
  borderColor?: string;
  bgColor?: string;
  accent?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: bgColor,
        border: `2px solid ${borderColor}`,
        position: 'relative',
        padding: '24px 28px',
        boxShadow: accent ? `8px 8px 0px ${COLORS.danger}` : `0 0 20px ${borderColor}22`,
        transform: 'skewX(-2deg)',
        ...style,
      }}
    >
      <div style={{ transform: 'skewX(2deg)' }}>{children}</div>
      {/* Decorative corner accents */}
      <CornerBrackets size={16} color={borderColor} />
      <CornerBracketsBottomRight size={16} color={borderColor} />
    </div>
  );
}

// Diagonal stripe pattern background (Persona 5 style)
export function DiagonalStripes({
  color = COLORS.primary,
  opacity = 0.04,
  width = 20,
}: {
  color?: string;
  opacity?: number;
  width?: number;
}) {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
      <defs>
        <pattern id={`diagonal-${width}`} width={width * 2} height={width * 2} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1={0} y1={0} x2={0} y2={width * 2} stroke={color} strokeWidth={width * 0.15} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#diagonal-${width})`} />
    </svg>
  );
}

// Screen edge vignette
export function Vignette({ opacity = 0.6 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        background: `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,${opacity}) 100%)`,
      }}
    />
  );
}

// Zone name formatter
export function formatZoneName(zoneId: string): string {
  const labels: Record<string, string> = {
    zone1: 'ZONE 1 — SPAWN AREA',
    zone2: 'ZONE 2 — ACADEMY ROOM',
    zone3: 'ZONE 3 — WORKSHOP',
    zone4: 'ZONE 4 — PROJECT DISTRICT',
    zone5: 'ZONE 5 — CAREER CORRIDOR',
    zone6: 'ZONE 6 — FINAL ROOM',
  };
  return labels[zoneId] || zoneId.toUpperCase();
}
