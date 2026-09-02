import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { resumeStructurer } from '../services/ai/resume.structurer';
import { ResumeData } from '../types/resume';

describe('POST /api/resumes/structure API Endpoint', () => {
  const app = createApp();

  const mockStructuredResume: ResumeData = {
    schemaVersion: 1,
    personalInfo: {
      fullName: 'Alex Rivera',
      headline: 'Software Engineer',
      email: 'alex@example.com',
      phone: '+1 555-0199',
      location: 'San Francisco, CA',
    },
    summary: 'Full stack developer.',
    links: [],
    education: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        institution: 'UC Berkeley',
      },
    ],
    experience: [
      {
        id: '22222222-2222-2222-2222-222222222222',
        company: 'TechCorp',
        position: 'Backend Developer',
        highlights: ['Built high scale APIs'],
      },
    ],
    projects: [
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'ResumeGraph',
        technologies: ['TypeScript', 'Express'],
      },
    ],
    skills: [
      {
        id: '44444444-4444-4444-4444-444444444444',
        category: 'Languages',
        skills: ['TypeScript', 'Python'],
      },
    ],
    certifications: [],
    achievements: [],
    unmappedSections: [],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully structures raw resume text and returns 200 OK with ResumeData', async () => {
    vi.spyOn(resumeStructurer, 'structureResumeText').mockResolvedValueOnce(mockStructuredResume);

    const payload = {
      text: 'Alex Rivera\nSoftware Engineer\nEmail: alex@example.com\nUC Berkeley\nTechCorp - Backend Developer\nResumeGraph Project',
    };

    const res = await request(app).post('/api/resumes/structure').send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.schemaVersion).toBe(1);
    expect(res.body.data.personalInfo.fullName).toBe('Alex Rivera');
    expect(res.body.data.projects[0].name).toBe('ResumeGraph');
    expect(res.body.data.projects[0].id).toBe('33333333-3333-3333-3333-333333333333');
  });

  it('returns 400 Bad Request when text field is missing or empty', async () => {
    const res = await request(app).post('/api/resumes/structure').send({ text: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 Bad Request when request body is not JSON or invalid format', async () => {
    const res = await request(app).post('/api/resumes/structure').send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
