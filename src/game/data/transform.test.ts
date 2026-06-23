import { describe, it, expect } from 'vitest';
import {
  normalizeProfile,
  normalizeHonors,
  normalizeCertifications,
  normalizeSkills,
  normalizeProjects,
  normalizeExperiences,
  normalizeVolunteering,
} from './transform';

// --- Profile ---
const rawProfile = {
  name: 'Abdul Majid Ridwan Tyastonoatmaja',
  headline: 'AI/ML Engineer & Systems Builder',
  tagline: 'Building production ML systems from sensor to deployment.',
  location: 'Tulungagung, East Java, Indonesia',
  timezone: 'Asia/Jakarta',
  contact: {
    email: 'test@test.com',
    phone: '+6280000000000',
    linkedin: 'https://linkedin.com/in/test',
    github: 'https://github.com/test',
    website: null,
  },
  summary: 'Test summary.',
  metrics: {
    years_experience: 2,
    projects_shipped: 18,
    certifications: 49,
    languages: ['English', 'Indonesian'],
  },
  resume_url: '/resume',
};

describe('normalizeProfile', () => {
  it('converts snake_case to camelCase', () => {
    const result = normalizeProfile(rawProfile);
    expect(result.metrics.yearsExperience).toBe(2);
    expect(result.metrics.projectsShipped).toBe(18);
    expect(result.metrics.certifications).toBe(49);
    expect(result.resumeUrl).toBe('/resume');
  });

  it('preserves all contact fields', () => {
    const result = normalizeProfile(rawProfile);
    expect(result.contact.email).toBe('test@test.com');
    expect(result.contact.github).toBe('https://github.com/test');
  });
});

// --- Honors ---
const rawHonors = [
  {
    id: 'test-honor-1',
    title: '2nd Place Winner - IoT Category',
    event: 'Ignition Informatics 2024',
    date: '2024',
    category: 'competition',
    description: null,
  },
];

describe('normalizeHonors', () => {
  it('normalizes honors array', () => {
    const result = normalizeHonors(rawHonors);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test-honor-1');
    expect(result[0].description).toBeNull();
  });
});

// --- Certifications ---
const rawCerts = [
  {
    id: 'test-cert-1',
    title: 'Test Certification',
    issuer: 'Test Issuer',
    issue_date: '2024-01',
    expiration_date: null,
    credential_id: 'ABC123',
    skills: ['Test Skill'],
    url: null,
  },
  {
    id: 'test-cert-2',
    title: 'Empty Skills Cert',
    issuer: 'Test Issuer',
    issue_date: '2024-02',
    expiration_date: null,
    credential_id: null,
    skills: [],
    url: null,
  },
];

describe('normalizeCertifications', () => {
  it('converts snake_case to camelCase', () => {
    const result = normalizeCertifications(rawCerts);
    expect(result[0].issueDate).toBe('2024-01');
    expect(result[0].credentialId).toBe('ABC123');
  });

  it('handles empty skills array', () => {
    const result = normalizeCertifications(rawCerts);
    expect(result[1].skills).toEqual([]);
  });

  it('handles null fields', () => {
    const result = normalizeCertifications(rawCerts);
    expect(result[0].expirationDate).toBeNull();
    expect(result[0].url).toBeNull();
    expect(result[1].credentialId).toBeNull();
  });
});

// --- Skills ---
const rawSkills = {
  categories: [
    {
      name: 'Machine Learning & AI',
      icon: 'brain',
      skills: [
        { name: 'Machine Learning', proficiency: 5 },
        { name: 'Deep Learning', proficiency: 4 },
      ],
    },
  ],
};

describe('normalizeSkills', () => {
  it('normalizes skill categories', () => {
    const result = normalizeSkills(rawSkills);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Machine Learning & AI');
    expect(result[0].skills).toHaveLength(2);
    expect(result[0].skills[0].proficiency).toBe(5);
  });
});

// --- Projects ---
const rawProjects = {
  projects: [
    {
      id: 'test-project-1',
      title: 'Test Project',
      featured: true,
      category: 'web',
      period: 'Jan 2024 – Present',
      description: 'A test project.',
      links: [{ label: 'GitHub', url: 'https://github.com/test' }],
      skills: ['Web Development'],
    },
  ],
};

describe('normalizeProjects', () => {
  it('normalizes projects array', () => {
    const result = normalizeProjects(rawProjects);
    expect(result).toHaveLength(1);
    expect(result[0].featured).toBe(true);
    expect(result[0].association).toBeNull();
    expect(result[0].media).toEqual([]);
  });
});

// --- Experience ---
const rawExp = [
  {
    id: 'test-exp-1',
    company: 'Test Company',
    role: 'Engineer',
    type: 'full-time contract',
    start_date: '2024-01',
    end_date: null,
    location: 'Jakarta',
    highlights: ['Did stuff'],
    technologies: ['Python'],
    url: null,
  },
];

describe('normalizeExperiences', () => {
  it('normalizes experience array', () => {
    const result = normalizeExperiences(rawExp);
    expect(result).toHaveLength(1);
    expect(result[0].startDate).toBe('2024-01');
    expect(result[0].endDate).toBeNull();
  });
});

// --- Volunteering ---
const rawVol = [
  {
    role: 'Speaker',
    organization: 'Test Org',
    cause: 'Education',
    start_date: '2025-05',
    end_date: '2025-05',
    highlights: ['Spoke at event'],
  },
];

describe('normalizeVolunteering', () => {
  it('generates id and normalizes', () => {
    const result = normalizeVolunteering(rawVol);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('vol-0');
    expect(result[0].startDate).toBe('2025-05');
  });
});
