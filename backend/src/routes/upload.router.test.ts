import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import {
  createSamplePdfBuffer,
  createSampleDocxBuffer,
  createMalformedPdfBuffer,
} from '../test/fixtures';
import { MAX_FILE_SIZE_BYTES } from '../middlewares/upload.middleware';

describe('POST /api/resumes/upload API Tests', () => {
  const app = createApp();

  it('successfully uploads and extracts text from a PDF file', async () => {
    const pdfBuffer = createSamplePdfBuffer('Alex Rivera - Software Engineer\nSkills: TypeScript, PostgreSQL');

    const res = await request(app)
      .post('/api/resumes/upload')
      .attach('resume', pdfBuffer, {
        filename: 'resume.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
    });
    expect(res.body.data.text).toContain('Alex Rivera - Software Engineer');
    expect(res.body.data.characterCount).toBeGreaterThan(0);
  });

  it('successfully uploads and extracts text from a DOCX file', async () => {
    const docxBuffer = await createSampleDocxBuffer('Alex Rivera - Backend Developer\nExperience: 4 years');

    const res = await request(app)
      .post('/api/resumes/upload')
      .attach('resume', docxBuffer, {
        filename: 'resume.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fileName).toBe('resume.docx');
    expect(res.body.data.text).toContain('Alex Rivera - Backend Developer');
    expect(res.body.data.characterCount).toBeGreaterThan(0);
  });

  it('returns 400 Bad Request when no file is attached', async () => {
    const res = await request(app)
      .post('/api/resumes/upload');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/No resume file provided/);
  });

  it('returns 400 Bad Request when file is attached under wrong field name', async () => {
    const pdfBuffer = createSamplePdfBuffer('Dummy text');

    const res = await request(app)
      .post('/api/resumes/upload')
      .attach('wrong_field_name', pdfBuffer, 'resume.pdf');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/Unexpected field 'wrong_field_name'/);
  });

  it('returns 400 Bad Request for unsupported file format (e.g., png/image)', async () => {
    const fakeImageBuffer = Buffer.from('FAKE_IMAGE_BYTES');

    const res = await request(app)
      .post('/api/resumes/upload')
      .attach('resume', fakeImageBuffer, {
        filename: 'avatar.png',
        contentType: 'image/png',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/Unsupported file format/);
  });

  it('returns 400 Bad Request for unsupported file format (e.g., text/plain)', async () => {
    const txtBuffer = Buffer.from('Just some plain text');

    const res = await request(app)
      .post('/api/resumes/upload')
      .attach('resume', txtBuffer, {
        filename: 'notes.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/Unsupported file format/);
  });

  it('returns 400 Bad Request when file exceeds size limit (5MB)', async () => {
    // Generate a buffer larger than 5MB
    const oversizedBuffer = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1024);

    const res = await request(app)
      .post('/api/resumes/upload')
      .attach('resume', oversizedBuffer, {
        filename: 'huge_resume.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/File size exceeds limit/);
  });

  it('returns 400 Bad Request when document content is corrupted/unreadable', async () => {
    const malformedBuffer = createMalformedPdfBuffer();

    const res = await request(app)
      .post('/api/resumes/upload')
      .attach('resume', malformedBuffer, {
        filename: 'corrupted.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/Failed to parse PDF document/);
  });
});
