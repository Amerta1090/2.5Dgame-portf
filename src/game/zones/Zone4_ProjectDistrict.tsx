import { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameState } from '@game/state/useGameState';
import { useInteraction } from '@game/engine/useInteraction';
import { ZONE_WIDTHS } from '@game/constants';
import { Zone4Background } from '@game/art/backgrounds/Zone4Background';
import { Building, type BuildingStyle } from '@game/art/props/Building';
import { Door, doorToInteractable } from '@game/entities/Door';
import { getAllGameData } from '@game/data';
import { ProjectRoom } from './subrooms/ProjectRoom';
import type { ZoneId, Project } from '@game/types';

interface Zone4ProjectDistrictProps {
  onTransition: (zone: ZoneId) => void;
}

const CATEGORY_STYLE: Record<string, BuildingStyle> = {
  web: 'brick',
  ml: 'glass',
  cli: 'concrete',
  devops: 'server',
  iot: 'industrial',
};

function distributeBuildings(projects: Project[]): { project: Project; x: number; w: number }[] {
  const featured = projects.filter((p) => p.featured);
  const standard = projects.filter((p) => !p.featured);
  const ordered = [...featured, ...standard];

  const total = ordered.length;
  const zoneStart = 200;
  const zoneEnd = 7600;
  const gap = (zoneEnd - zoneStart) / (total + 1);

  return ordered.map((project, i) => ({
    project,
    x: zoneStart + gap * (i + 1),
    w: project.featured ? 160 : 120,
  }));
}

export function Zone4ProjectDistrict({ onTransition }: Zone4ProjectDistrictProps) {
  const { state, dispatch } = useGameState();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [visitedProjects, setVisitedProjects] = useState<Set<string>>(new Set());

  const gameData = useMemo(() => getAllGameData(), []);
  const projects = useMemo(() => gameData.projects, [gameData]);
  const distributed = useMemo(() => distributeBuildings(projects), [projects]);

  const zoneWidth = ZONE_WIDTHS.zone4;
  const targetZone: ZoneId = 'zone5';
  const visitedCount = visitedProjects.size;
  const projectsMet = visitedCount >= 3;
  const doorX = zoneWidth - 120;

  const buildingInteractables = useMemo(
    () =>
      distributed.map((d) => ({
        id: `building-${d.project.id}`,
        x: d.x - d.w / 2,
        y: 200,
        width: d.w,
        height: 200,
      })),
    [distributed],
  );

  const zoneInteractables = useMemo(
    () => [
      ...buildingInteractables,
      doorToInteractable('door-4', doorX, 280),
    ],
    [buildingInteractables, doorX],
  );

  const nearby = useInteraction(
    state.playerPosition.x,
    state.playerPosition.y,
    currentProject ? [] : zoneInteractables,
    !currentProject,
  );

  const handleInteract = useCallback(
    (id: string) => {
      if (id.startsWith('building-')) {
        const projectId = id.replace('building-', '');
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          setCurrentProject(project);
          if (!visitedProjects.has(projectId)) {
            setVisitedProjects((prev) => {
              const next = new Set(prev);
              next.add(projectId);
              return next;
            });
            dispatch({ type: 'INCREMENT_ATTEMPT', puzzleId: 'visit-project' });
            if (!visitedProjects.has(projectId) && visitedProjects.size + 1 >= 3) {
              dispatch({ type: 'COMPLETE_ZONE', zone: 'zone4' });
            }
          }
        }
      } else if (id === 'door-4') {
        if (projectsMet) {
          onTransition(targetZone);
        }
      }
    },
    [projects, visitedProjects, dispatch, onTransition, targetZone, projectsMet],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (currentProject) return;

      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearby) {
        e.preventDefault();
        handleInteract(nearby.id);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentProject, nearby, handleInteract]);

  const isNearbyBuilding = nearby?.id?.startsWith('building-');
  const showPrompt = !currentProject && isNearbyBuilding;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Zone4Background />

      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          color: '#F0E040',
          fontFamily: "'Impact', sans-serif",
          fontSize: 14,
          letterSpacing: '0.1em',
        }}
      >
        PROJECT DISTRICT
      </div>

      <div
        style={{
          position: 'absolute',
          top: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          color: '#888',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
        }}
      >
        Projects visited: {visitedCount}/3 (need 3)
      </div>

      {distributed.map((d) => (
        <Building
          key={d.project.id}
          x={d.x}
          y={300}
          style={CATEGORY_STYLE[d.project.category] ?? 'concrete'}
          width={d.w}
          height={d.project.featured ? 180 : 140}
          featured={!!d.project.featured}
          label={d.project.title}
          isNearby={nearby?.id === `building-${d.project.id}`}
          onClick={() => {
            const id = `building-${d.project.id}`;
            handleInteract(id);
          }}
        />
      ))}

      <Door
        x={doorX}
        y={280}
        targetZone={targetZone}
        isNearby={nearby?.id === 'door-4'}
        onTransition={projectsMet ? onTransition : undefined}
      />

      {!projectsMet && (
        <div
          style={{
            position: 'absolute',
            left: doorX,
            top: 260,
            width: 80,
            textAlign: 'center',
            color: '#E04040',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            zIndex: 6,
          }}
        >
          🔒 Visit 3 projects
        </div>
      )}

      {showPrompt && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            color: '#F0E040',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            background: 'rgba(0,0,0,0.8)',
            padding: '8px 16px',
            borderRadius: 4,
            border: '1px solid #F0E040',
          }}
        >
          Press <span style={{ fontWeight: 700 }}>E</span> to enter
        </div>
      )}

      <AnimatePresence>
        {currentProject && (
          <ProjectRoom
            project={currentProject}
            onClose={() => setCurrentProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
