import type { ZoneId } from '@game/types';

export const ZONE_WIDTHS: Record<ZoneId, number> = {
  zone1: 2000,
  zone2: 3000,
  zone3: 5000,
  zone4: 8000,
  zone5: 4000,
  zone6: 1500,
};

export const PLAYER_SPEED = 4;
export const PLAYER_SPEED_SPRINT = 7;
export const INTERACTION_DISTANCE = 80;
export const VIEWPORT_WIDTH = 1920;
export const VIEWPORT_HEIGHT = 1080;
export const SAVE_KEY = '25dgame_save';
export const SAVE_VERSION = 1;
export const AUTO_SAVE_INTERVAL = 60000;

export const CAMERA_SPRING = { stiffness: 200, damping: 30, mass: 0.5 };
