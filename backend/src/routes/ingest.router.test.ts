import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { resumeIngestionService } from '../services/resume-ingestion.service';
import {
  createSamplePdfBuffer,
  createSampleDocxBuffer,
} from '../test/fixtures';
import { ResumeEntity } from '../types/resume';

describe('POST /api/resumes/ingest Integration Tests', () => {
  const app = createApp();

  const mockIngestedResume: ResumeEntity = {
    id: '12345678-1234-1234-1234-123456789abc',
    title: 'Anvesh Srivastava Resume',
    schemaVersion: 1,
    data: {
      schemaVersion: 1,
      personalInfo: {
        fullName: 'Anvesh Srivastava',
        headline: 'Lead Developer',
        email: 'anvesh@example.com',
      },
      summary: 'Experienced Engineer',
      links: [],
      education: [
        {
          id: 'edu-1111-1111-1111-111111111111',
          institution: 'IIT',
        },
      ],
      experience: [
        {
          id: 'exp-2222-2222-2222-222222222222',
          company: 'Acme Corp',
          position: 'Software Engineer',
        },
      ],
      projects: [
        {
          id: 'proj-3333-3333-3333-333333333333',
          name: 'ResumeGraph',
          technologies: ['TypeScript', 'Express', 'PostgreSQL'],
        },
      ],
      skills: [
        {
          id: 'skill-4444-4444-4444-444444444444',
          category: 'Languages',
          skills: ['TypeScript', 'Python'],
        },
      ],
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

  it('successfully ingests a PDF resume end-to-end and returns 201 Created', async () => {
    vi.spyOn(resumeIngestionService, 'ingestResume').mockResolvedValueOnce(mockIngestedResume);

    const pdfBuffer = createSamplePdfBuffer('Anvesh Srivastava - Software Engineer');

    const res = await request(app)
      .post('/api/resumes/ingest')
      .attach('resume', pdfBuffer, {
        filename: 'anvesh_resume.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockIngestedResume.id);
    expect(res.body.data.title).toBe('Anvesh Srivastava Resume');
    expect(res.body.data.schemaVersion).toBe(1);
    expect(res.body.data.data.personalInfo.fullName).toBe('Anvesh Srivastava');
    expect(res.body.data.data.projects[0].name).toBe('ResumeGraph');
  });

  it('successfully ingests a DOCX resume end-to-end and returns 201 Created', async () => {
    vi.spyOn(resumeIngestionService, 'ingestResume').mockResolvedValueOnce(mockIngestedResume);

    const docxBuffer = await createSampleDocxBuffer('Anvesh Srivastava - Backend Developer');

    const res = await request(app)
      .post('/api/resumes/ingest')
      .attach('resume', docxBuffer, {
        filename: 'anvesh_resume.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockIngestedResume.id);
  });

  it('returns 400 Bad Request when no file is attached for ingestion', async () => {
    const res = await request(app).post('/api/resumes/ingest');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/No resume file provided/);
  });

  it('returns 400 Bad Request for unsupported file type during ingestion', async () => {
    const txtBuffer = Buffer.from('Plain text file content');

    const res = await request(app)
      .post('/api/resumes/ingest')
      .attach('resume', txtBuffer, {
        filename: 'resume.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/Unsupported file format/);
  });
});
