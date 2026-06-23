import type { GameData } from '@game/types';
import {
  normalizeProfile,
  normalizeHonors,
  normalizeCertifications,
  normalizeSkills,
  normalizeProjects,
  normalizeExperiences,
  normalizeVolunteering,
} from '@game/data/transform';

import profileRaw from '@data/profile.json';
import honorsRaw from '@data/honors.json';
import licensesRaw from '@data/licenses_certifications.json';
import skillsRaw from '@data/skills.json';
import projectsRaw from '@data/projects.json';
import experienceRaw from '@data/experience.json';
import volunteeringRaw from '@data/volunteering.json';

let cached: GameData | null = null;

export function getAllGameData(): GameData {
  if (cached) return cached;

  const gameData: GameData = {
    profile: normalizeProfile(profileRaw as Parameters<typeof normalizeProfile>[0]),
    honors: normalizeHonors(honorsRaw as Parameters<typeof normalizeHonors>[0]),
    certifications: normalizeCertifications(
      (licensesRaw as { licenses_and_certifications: Parameters<typeof normalizeCertifications>[0] })
        .licenses_and_certifications,
    ),
    skills: normalizeSkills(skillsRaw as Parameters<typeof normalizeSkills>[0]),
    projects: normalizeProjects(projectsRaw as Parameters<typeof normalizeProjects>[0]),
    experiences: normalizeExperiences(experienceRaw as Parameters<typeof normalizeExperiences>[0]),
    volunteering: normalizeVolunteering(
      volunteeringRaw as Parameters<typeof normalizeVolunteering>[0],
    ),
  };

  cached = gameData;
  return gameData;
}

export { normalizeProfile } from '@game/data/transform';
export { normalizeHonors } from '@game/data/transform';
export { normalizeCertifications } from '@game/data/transform';
export { normalizeSkills } from '@game/data/transform';
export { normalizeProjects } from '@game/data/transform';
export { normalizeExperiences } from '@game/data/transform';
export { normalizeVolunteering } from '@game/data/transform';
