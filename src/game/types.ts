export type ZoneId = 'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5' | 'zone6';

export type GameScreen = 'title' | 'menu' | 'game' | 'about' | 'credits' | 'standard';

export type ProjectCategory = 'web' | 'ml' | 'cli' | 'devops' | 'iot';

export type ExperienceType = 'full-time contract' | 'part-time' | 'contract' | 'internship';

export type PuzzleId =
  | 'timeline-sort'
  | 'ai-pipeline'
  | 'component-connect'
  | 'debug-challenge'
  | 'decision-sim';

// --- Normalized entity interfaces (matching BLUEPRINT §1.4) ---

export interface Person {
  name: string;
  headline: string;
  tagline: string;
  location: string;
  timezone: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string | null;
  };
  summary: string;
  metrics: {
    yearsExperience: number;
    projectsShipped: number;
    certifications: number;
    languages: string[];
  };
  resumeUrl: string;
}

export interface Honor {
  id: string;
  title: string;
  event: string;
  date: string;
  category: string;
  description: string | null;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string | null;
  expirationDate: string | null;
  credentialId: string | null;
  skills: string[];
  url: string | null;
}

export interface Skill {
  name: string;
  proficiency: number;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  featured: boolean;
  category: ProjectCategory;
  period: string;
  description: string;
  links: ProjectLink[];
  skills: string[];
  association: string | null;
  media: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  type: ExperienceType;
  startDate: string;
  endDate: string | null;
  location: string;
  highlights: string[];
  technologies: string[];
  url: string | null;
}

export interface Volunteering {
  id: string;
  role: string;
  organization: string;
  cause: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface GameData {
  profile: Person;
  honors: Honor[];
  certifications: Certification[];
  skills: SkillCategory[];
  projects: Project[];
  experiences: Experience[];
  volunteering: Volunteering[];
}

// --- Game state interfaces (matching BLUEPRINT §6.4) ---

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface GameState {
  screen: GameScreen;
  currentZone: ZoneId;
  zonesCompleted: ZoneId[];
  zoneProgress: Record<ZoneId, number>;
  playerPosition: PlayerPosition;
  playerFacing: 'left' | 'right';
  loreFragments: string[];
  collectedCertIds: string[];
  badges: string[];
  puzzlesCompleted: string[];
  puzzleAttempts: Record<string, number>;
  achievements: string[];
  playTime: number;
  totalInteractions: number;
  developerCommentary: boolean;
}

export type GameAction =
  | { type: 'SET_SCREEN'; screen: GameScreen }
  | { type: 'SET_ZONE'; zone: ZoneId }
  | { type: 'COMPLETE_ZONE'; zone: ZoneId }
  | { type: 'MOVE_PLAYER'; x: number; y: number }
  | { type: 'SET_PLAYER_FACING'; facing: 'left' | 'right' }
  | { type: 'COLLECT_LORE'; id: string }
  | { type: 'COLLECT_CERT'; id: string }
  | { type: 'COMPLETE_PUZZLE'; id: string }
  | { type: 'INCREMENT_ATTEMPT'; puzzleId: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; id: string }
  | { type: 'TICK_TIME' }
  | { type: 'TOGGLE_COMMENTARY' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'RESET' };

export interface SaveData {
  version: number;
  timestamp: number;
  zonesCompleted: ZoneId[];
  loreFragments: string[];
  collectedCertIds: string[];
  badges: string[];
  puzzlesCompleted: string[];
  achievements: string[];
  playTime: number;
  totalInteractions: number;
  developerCommentary: boolean;
}

// --- Zone unlock conditions (matching BLUEPRINT §4.2) ---

export interface ZoneUnlockCondition {
  zone: ZoneId;
  requires: string[];
}

export const ZONE_UNLOCKS: ZoneUnlockCondition[] = [
  { zone: 'zone2', requires: ['zone1_terminal_interaction'] },
  { zone: 'zone3', requires: ['zone2_cert_collections >= 3'] },
  { zone: 'zone4', requires: ['zone3_puzzles_completed >= 2'] },
  { zone: 'zone5', requires: ['zone4_projects_visited >= 3'] },
  { zone: 'zone6', requires: ['zone5_decision_completed', 'all_previous_zones_complete'] },
];
