import { describe, it, expect } from 'vitest';
import {
  resumeDataSchema,
  createResumeDataInputSchema,
  createResumeRequestSchema,
  createProjectInputSchema,
  createExperienceInputSchema,
  createEducationInputSchema,
  assignResumeDataIds,
  normalizeResumeDataForUpdate,
} from './resume.schema';
import { ResumeData, CreateResumeDataInput } from '../types/resume';

describe('ResumeData Schema & Backend ID Generation Tests', () => {
  const validStoredResume: ResumeData = {
    schemaVersion: 1,
    personalInfo: {
      fullName: 'Alex Rivera',
      headline: 'Software Engineer',
      email: 'alex@example.com',
      phone: '+1 555-0100',
      location: 'San Francisco, CA',
    },
    summary: 'Experienced full stack developer.',
    links: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        label: 'GitHub',
        url: 'https://github.com/alex',
      },
    ],
    education: [
      {
        id: '22222222-2222-2222-2222-222222222222',
        institution: 'UC Berkeley',
        degree: 'B.S.',
        fieldOfStudy: 'Computer Science',
        startDate: '2019-08',
        endDate: '2023-05',
        isCurrent: false,
        grade: '3.9 GPA',
      },
    ],
    experience: [
      {
        id: '33333333-3333-3333-3333-333333333333',
        company: 'TechCorp',
        position: 'Backend Engineer',
        startDate: '2023-06',
        endDate: 'Present',
        isCurrent: true,
        highlights: ['Built high throughput ingestion pipeline.'],
      },
    ],
    projects: [
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'NOVA',
        description: 'AI document assistant.',
        technologies: ['TypeScript', 'Node.js'],
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Job Scraper',
        description: 'Automated job search tool.',
        technologies: ['Python'],
      },
    ],
    skills: [
      {
        id: '66666666-6666-6666-6666-666666666666',
        category: 'Languages',
        skills: ['TypeScript', 'Go', 'SQL'],
      },
    ],
    certifications: [
      {
        id: '77777777-7777-7777-7777-777777777777',
        name: 'AWS Solutions Architect',
      },
    ],
    achievements: [
      {
        id: '88888888-8888-8888-8888-888888888888',
        title: 'Hackathon 1st Place',
      },
    ],
    unmappedSections: [
      {
        id: '99999999-9999-9999-9999-999999999999',
        title: 'Publications',
        content: 'Rivera, A. et al. (2024). LLM Structuring.',
      },
    ],
  };

  it('validates a complete, valid stored ResumeData object', () => {
    const parsed = resumeDataSchema.safeParse(validStoredResume);
    expect(parsed.success).toBe(true);
  });

  it('rejects stored ResumeData if an entity ID is missing or empty', () => {
    const invalidData = {
      ...validStoredResume,
      education: [
        {
          id: '', // empty ID
          institution: 'UC Berkeley',
        },
      ],
    };
    const parsed = resumeDataSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it('rejects stored ResumeData if personalInfo.fullName is missing', () => {
    const invalidData = {
      ...validStoredResume,
      personalInfo: {
        fullName: '',
      },
    };
    const parsed = resumeDataSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it('validates client create input where IDs are not provided', () => {
    const clientInput: CreateResumeDataInput = {
      personalInfo: { fullName: 'Alex Rivera' },
      links: [{ label: 'GitHub', url: 'https://github.com' }],
      education: [{ institution: 'UC Berkeley' }],
      experience: [{ company: 'TechCorp', position: 'Engineer' }],
      projects: [{ name: 'Project Alpha' }],
      skills: [{ category: 'Languages', skills: ['TypeScript'] }],
      certifications: [{ name: 'AWS Certified' }],
      achievements: [{ title: 'Dean’s List' }],
      unmappedSections: [{ title: 'Volunteer', content: 'Mentoring' }],
    };

    const parsed = createResumeDataInputSchema.safeParse(clientInput);
    expect(parsed.success).toBe(true);
  });

  it('strictly rejects createProjectInputSchema when client supplies id', () => {
    const invalidProject = {
      id: 'custom-proj-id',
      name: 'Client Injected Project',
    };
    const parsed = createProjectInputSchema.safeParse(invalidProject);
    expect(parsed.success).toBe(false);
  });

  it('strictly rejects createExperienceInputSchema when client supplies id', () => {
    const invalidExperience = {
      id: 'custom-exp-id',
      company: 'TechCorp',
      position: 'Engineer',
    };
    const parsed = createExperienceInputSchema.safeParse(invalidExperience);
    expect(parsed.success).toBe(false);
  });

  it('strictly rejects createEducationInputSchema when client supplies id', () => {
    const invalidEducation = {
      id: 'custom-edu-id',
      institution: 'Stanford',
    };
    const parsed = createEducationInputSchema.safeParse(invalidEducation);
    expect(parsed.success).toBe(false);
  });

  it('strictly rejects createResumeDataInputSchema when any section contains client-supplied id', () => {
    const payload = {
      personalInfo: { fullName: 'Alex Rivera' },
      projects: [{ id: 'proj-123', name: 'Project With ID' }],
    };
    const parsed = createResumeDataInputSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });

  it('assignResumeDataIds generates unique UUIDs for all entities', () => {
    const clientInput: CreateResumeDataInput = {
      personalInfo: { fullName: 'Alex Rivera' },
      links: [{ label: 'GitHub', url: 'https://github.com' }],
      education: [{ institution: 'MIT' }],
      experience: [{ company: 'Acme', position: 'Lead' }],
      projects: [{ name: 'Proj 1' }, { name: 'Proj 2' }],
      skills: [{ category: 'Languages', skills: ['Python'] }],
      certifications: [{ name: 'Cert A' }],
      achievements: [{ title: 'Award B' }],
      unmappedSections: [{ title: 'Patents', content: 'US 12345' }],
    };

    const result = assignResumeDataIds(clientInput);

    // Verify stored contract validation passes
    const validated = resumeDataSchema.safeParse(result);
    expect(validated.success).toBe(true);

    // Verify all generated IDs are distinct strings
    const allIds = [
      ...result.links.map((l) => l.id),
      ...result.education.map((e) => e.id),
      ...result.experience.map((e) => e.id),
      ...result.projects.map((p) => p.id),
      ...result.skills.map((s) => s.id),
      ...result.certifications.map((c) => c.id),
      ...result.achievements.map((a) => a.id),
      ...result.unmappedSections.map((u) => u.id),
    ];

    expect(allIds.length).toBe(9);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(9);

    // Verify UUID pattern
    for (const id of allIds) {
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    }
  });

  it('update semantics: preserves existing entity IDs, updates matching items, and assigns UUIDs only to new entities without ID', () => {
    const existing = validStoredResume;
    const projAAA = existing.projects[0].id; // "44444444-4444-4444-4444-444444444444" (NOVA)
    const projBBB = existing.projects[1].id; // "55555555-5555-5555-5555-555555555555" (Job Scraper)

    const updateInput = {
      projects: [
        // 1. Existing AAA with updated name
        {
          id: projAAA,
          name: 'NOVA Updated',
        },
        // 2. Existing BBB preserved as-is
        {
          id: projBBB,
          name: 'Job Scraper',
        },
        // 3. Newly added project without ID
        {
          name: 'ResumeGraph',
          description: 'Structured resume diff engine',
        },
      ],
    };

    const merged = normalizeResumeDataForUpdate(updateInput, existing);

    expect(merged.projects.length).toBe(3);

    // AAA is strictly preserved
    expect(merged.projects[0].id).toBe(projAAA);
    expect(merged.projects[0].name).toBe('NOVA Updated');

    // BBB is strictly preserved
    expect(merged.projects[1].id).toBe(projBBB);
    expect(merged.projects[1].name).toBe('Job Scraper');

    // ResumeGraph gets a new UUID
    expect(merged.projects[2].id).toBeDefined();
    expect(merged.projects[2].id).not.toBe(projAAA);
    expect(merged.projects[2].id).not.toBe(projBBB);
    expect(merged.projects[2].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(merged.projects[2].name).toBe('ResumeGraph');
  });

  it('update semantics: handles reordered entities strictly by ID, not array index or content', () => {
    const existing = validStoredResume;
    const projAAA = existing.projects[0].id;
    const projBBB = existing.projects[1].id;

    // Provide BBB first, AAA second
    const updateInput = {
      projects: [
        {
          id: projBBB,
          name: 'Job Scraper Reordered',
        },
        {
          id: projAAA,
          name: 'NOVA Reordered',
        },
      ],
    };

    const merged = normalizeResumeDataForUpdate(updateInput, existing);

    expect(merged.projects.length).toBe(2);
    // Index 0 has BBB's ID
    expect(merged.projects[0].id).toBe(projBBB);
    expect(merged.projects[0].name).toBe('Job Scraper Reordered');

    // Index 1 has AAA's ID
    expect(merged.projects[1].id).toBe(projAAA);
    expect(merged.projects[1].name).toBe('NOVA Reordered');
  });

  it('update semantics: rejects updating with non-existent entity ID', () => {
    const existing = validStoredResume;
    const nonExistentId = '00000000-0000-0000-0000-000000000000';

    const updateInput = {
      projects: [
        {
          id: nonExistentId,
          name: 'Fake ID Project',
        },
      ],
    };

    expect(() => normalizeResumeDataForUpdate(updateInput, existing)).toThrowError(
      /does not exist in the resume/
    );
  });

  it('validates createResumeRequestSchema with title and data', () => {
    const requestPayload = {
      title: 'Full Stack Resume 2026',
      data: {
        personalInfo: { fullName: 'Alex Rivera' },
      },
    };

    const parsed = createResumeRequestSchema.safeParse(requestPayload);
    expect(parsed.success).toBe(true);
  });
});
