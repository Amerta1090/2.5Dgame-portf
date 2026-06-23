import type {
  Person,
  Honor,
  Certification,
  SkillCategory,
  Project,
  Experience,
  Volunteering,
} from '@game/types';

// --- Profile ---
interface RawProfile {
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
    years_experience: number;
    projects_shipped: number;
    certifications: number;
    languages: string[];
  };
  resume_url: string;
}

export function normalizeProfile(raw: RawProfile): Person {
  return {
    name: raw.name,
    headline: raw.headline,
    tagline: raw.tagline,
    location: raw.location,
    timezone: raw.timezone,
    contact: { ...raw.contact },
    summary: raw.summary,
    metrics: {
      yearsExperience: raw.metrics.years_experience,
      projectsShipped: raw.metrics.projects_shipped,
      certifications: raw.metrics.certifications,
      languages: raw.metrics.languages,
    },
    resumeUrl: raw.resume_url,
  };
}

// --- Honors ---
interface RawHonor {
  id: string;
  title: string;
  event: string;
  date: string;
  category: string;
  description: string | null;
}

export function normalizeHonor(raw: RawHonor): Honor {
  return {
    id: raw.id,
    title: raw.title,
    event: raw.event,
    date: raw.date,
    category: raw.category,
    description: raw.description,
  };
}

export function normalizeHonors(raw: RawHonor[]): Honor[] {
  return raw.map(normalizeHonor);
}

// --- Certifications ---
interface RawCertification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  skills: string[];
  url: string | null;
}

export function normalizeCertification(raw: RawCertification): Certification {
  return {
    id: raw.id,
    title: raw.title,
    issuer: raw.issuer,
    issueDate: raw.issue_date,
    expirationDate: raw.expiration_date,
    credentialId: raw.credential_id,
    skills: raw.skills ?? [],
    url: raw.url,
  };
}

export function normalizeCertifications(raw: RawCertification[]): Certification[] {
  return raw.map(normalizeCertification);
}

// --- Skills ---
interface RawSkill {
  name: string;
  proficiency: number;
}

interface RawSkillCategory {
  name: string;
  icon: string;
  skills: RawSkill[];
}

export function normalizeSkillCategory(raw: RawSkillCategory): SkillCategory {
  return {
    name: raw.name,
    icon: raw.icon,
    skills: raw.skills.map((s) => ({ name: s.name, proficiency: s.proficiency })),
  };
}

export function normalizeSkills(raw: { categories: RawSkillCategory[] }): SkillCategory[] {
  return raw.categories.map(normalizeSkillCategory);
}

// --- Projects ---
interface RawProjectLink {
  label: string;
  url: string;
}

interface RawProject {
  id: string;
  title: string;
  featured?: boolean;
  category: string;
  period: string;
  description: string;
  links: RawProjectLink[];
  skills: string[];
  association?: string;
  media?: string[];
}

export function normalizeProject(raw: RawProject): Project {
  return {
    id: raw.id,
    title: raw.title,
    featured: raw.featured ?? false,
    category: raw.category as Project['category'],
    period: raw.period,
    description: raw.description,
    links: raw.links.map((l) => ({ label: l.label, url: l.url })),
    skills: raw.skills,
    association: raw.association ?? null,
    media: raw.media ?? [],
  };
}

export function normalizeProjects(raw: { projects: RawProject[] }): Project[] {
  return raw.projects.map(normalizeProject);
}

// --- Experience ---
interface RawExperience {
  id: string;
  company: string;
  role: string;
  type: string;
  start_date: string;
  end_date: string | null;
  location: string;
  highlights: string[];
  technologies: string[];
  url: string | null;
}

export function normalizeExperience(raw: RawExperience): Experience {
  return {
    id: raw.id,
    company: raw.company,
    role: raw.role,
    type: raw.type as Experience['type'],
    startDate: raw.start_date,
    endDate: raw.end_date,
    location: raw.location,
    highlights: raw.highlights,
    technologies: raw.technologies,
    url: raw.url,
  };
}

export function normalizeExperiences(raw: RawExperience[]): Experience[] {
  return raw.map(normalizeExperience);
}

// --- Volunteering ---
interface RawVolunteering {
  role: string;
  organization: string;
  cause: string;
  start_date: string;
  end_date: string;
  highlights: string[];
}

export function normalizeVolunteering(raw: RawVolunteering[]): Volunteering[] {
  return raw.map((v, index) => ({
    id: `vol-${index}`,
    role: v.role,
    organization: v.organization,
    cause: v.cause,
    startDate: v.start_date,
    endDate: v.end_date,
    highlights: v.highlights,
  }));
}
