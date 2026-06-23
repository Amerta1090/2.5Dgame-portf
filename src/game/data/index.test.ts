import { describe, it, expect } from 'vitest';
import { getAllGameData } from './index';

describe('getAllGameData', () => {
  it('loads and normalizes all JSON data', () => {
    const data = getAllGameData();

    expect(data.profile.name).toBe('Abdul Majid Ridwan Tyastonoatmaja');
    expect(data.profile.metrics.certifications).toBe(62);

    expect(data.honors.length).toBeGreaterThanOrEqual(3);
    expect(data.honors[0].id).toBeTruthy();

    expect(data.certifications.length).toBe(62);
    expect(data.certifications[0].id).toBeTruthy();
    expect(data.certifications[0].issueDate).toBeDefined();

    expect(data.skills.length).toBeGreaterThanOrEqual(8);
    expect(data.skills[0].skills.length).toBeGreaterThan(0);

    expect(data.projects.length).toBeGreaterThanOrEqual(21);
    expect(data.projects.filter((p) => p.featured).length).toBeGreaterThanOrEqual(5);

    expect(data.experiences.length).toBe(7);
    expect(data.experiences[0].highlights.length).toBeGreaterThan(0);

    expect(data.volunteering.length).toBe(1);
    expect(data.volunteering[0].organization).toBe('Universitas AMIKOM Yogyakarta');
  });

  it('caches result on subsequent calls', () => {
    const a = getAllGameData();
    const b = getAllGameData();
    expect(a).toBe(b);
  });

  it('all projects have unique ids', () => {
    const data = getAllGameData();
    const ids = data.projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all experiences have unique ids', () => {
    const data = getAllGameData();
    const ids = data.experiences.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('certifications count matches profile metrics', () => {
    const data = getAllGameData();
    expect(data.certifications.length).toBe(data.profile.metrics.certifications);
  });

  it('all experience entries have valid types', () => {
    const data = getAllGameData();
    const validTypes = ['full-time contract', 'part-time', 'contract', 'internship'];
    for (const exp of data.experiences) {
      expect(validTypes).toContain(exp.type);
    }
  });
});
