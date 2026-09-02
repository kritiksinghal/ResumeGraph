import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { resumeService } from '../services/resume.service';
import { ResumeEntity } from '../types/resume';

describe('Resume API Endpoints', () => {
  const app = createApp();

  const mockResume: ResumeEntity = {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Software Engineer Resume',
    schemaVersion: 1,
    data: {
      schemaVersion: 1,
      personalInfo: { fullName: 'Alex Rivera' },
      summary: 'Experienced developer',
      links: [],
      education: [],
      experience: [],
      projects: [
        {
          id: '44444444-4444-4444-4444-444444444444',
          name: 'NOVA',
          technologies: ['TypeScript'],
        },
        {
          id: '55555555-5555-5555-5555-555555555555',
          name: 'Job Scraper',
          technologies: ['Python'],
        },
      ],
      skills: [],
      certifications: [],
      achievements: [],
      unmappedSections: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/resumes should create a resume and return 201 Created', async () => {
    vi.spyOn(resumeService, 'createResume').mockResolvedValueOnce(mockResume);

    const payload = {
      title: 'Software Engineer Resume',
      data: {
        personalInfo: { fullName: 'Alex Rivera' },
      },
    };

    const res = await request(app).post('/api/resumes').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockResume.id);
    expect(res.body.data.title).toBe(mockResume.title);
  });

  it('POST /api/resumes should return 400 Bad Request on invalid payload', async () => {
    const invalidPayload = {
      title: '', // Missing title
      data: {}, // Missing personalInfo.fullName
    };

    const res = await request(app).post('/api/resumes').send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/resumes should return 400 when client supplies project.id', async () => {
    const payloadWithProjectId = {
      title: 'Resume with Client Project ID',
      data: {
        personalInfo: { fullName: 'Alex Rivera' },
        projects: [
          {
            id: 'client-supplied-project-id',
            name: 'Client Injected Project',
          },
        ],
      },
    };

    const res = await request(app).post('/api/resumes').send(payloadWithProjectId);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(res.body.error.details)).toContain('unrecognized_keys');
  });

  it('POST /api/resumes should return 400 when client supplies experience.id', async () => {
    const payloadWithExperienceId = {
      title: 'Resume with Client Experience ID',
      data: {
        personalInfo: { fullName: 'Alex Rivera' },
        experience: [
          {
            id: 'client-supplied-experience-id',
            company: 'Acme Corp',
            position: 'Engineer',
          },
        ],
      },
    };

    const res = await request(app).post('/api/resumes').send(payloadWithExperienceId);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(res.body.error.details)).toContain('unrecognized_keys');
  });

  it('POST /api/resumes should return 400 when client supplies education.id', async () => {
    const payloadWithEducationId = {
      title: 'Resume with Client Education ID',
      data: {
        personalInfo: { fullName: 'Alex Rivera' },
        education: [
          {
            id: 'client-supplied-education-id',
            institution: 'MIT',
          },
        ],
      },
    };

    const res = await request(app).post('/api/resumes').send(payloadWithEducationId);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(res.body.error.details)).toContain('unrecognized_keys');
  });

  it('GET /api/resumes should list all resumes', async () => {
    vi.spyOn(resumeService, 'listResumes').mockResolvedValueOnce([mockResume]);

    const res = await request(app).get('/api/resumes');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(mockResume.id);
  });

  it('GET /api/resumes/:id should return 200 OK when found', async () => {
    vi.spyOn(resumeService, 'getResumeById').mockResolvedValueOnce(mockResume);

    const res = await request(app).get(`/api/resumes/${mockResume.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockResume.id);
  });

  it('GET /api/resumes/:id should return 404 Not Found when missing', async () => {
    vi.spyOn(resumeService, 'getResumeById').mockResolvedValueOnce(null);

    const res = await request(app).get('/api/resumes/non-existent-id');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('APP_ERROR');
  });

  it('PUT /api/resumes/:id should update a resume accepting optional entity IDs on existing items and no ID on new items', async () => {
    const updated: ResumeEntity = {
      ...mockResume,
      title: 'Updated Title',
      data: {
        ...mockResume.data,
        projects: [
          {
            id: '44444444-4444-4444-4444-444444444444',
            name: 'NOVA Updated',
            technologies: ['TypeScript'],
          },
          {
            id: '55555555-5555-5555-5555-555555555555',
            name: 'Job Scraper',
            technologies: ['Python'],
          },
          {
            id: '66666666-6666-6666-6666-666666666666',
            name: 'ResumeGraph',
            technologies: ['TypeScript', 'Express'],
          },
        ],
      },
    };

    vi.spyOn(resumeService, 'updateResume').mockResolvedValueOnce(updated);

    const res = await request(app)
      .put(`/api/resumes/${mockResume.id}`)
      .send({
        title: 'Updated Title',
        data: {
          projects: [
            {
              id: '44444444-4444-4444-4444-444444444444',
              name: 'NOVA Updated',
            },
            {
              id: '55555555-5555-5555-5555-555555555555',
              name: 'Job Scraper',
            },
            {
              name: 'ResumeGraph',
              technologies: ['TypeScript', 'Express'],
            },
          ],
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated Title');
    expect(res.body.data.data.projects).toHaveLength(3);
    expect(res.body.data.data.projects[0].id).toBe('44444444-4444-4444-4444-444444444444');
    expect(res.body.data.data.projects[1].id).toBe('55555555-5555-5555-5555-555555555555');
    expect(res.body.data.data.projects[2].id).toBe('66666666-6666-6666-6666-666666666666');
  });

  it('DELETE /api/resumes/:id should delete a resume', async () => {
    vi.spyOn(resumeService, 'deleteResume').mockResolvedValueOnce(true);

    const res = await request(app).delete(`/api/resumes/${mockResume.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Resume successfully deleted');
  });
});
