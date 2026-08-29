import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumeIngestionService } from './resume-ingestion.service';
import { DocumentExtractionService } from './extraction/document.service';
import { ResumeStructurer } from './ai/resume.structurer';
import { ResumeService } from './resume.service';
import { ResumeData, ResumeEntity } from '../types/resume';
import { AppError } from '../middlewares/errorHandler';

describe('ResumeIngestionService Unit Tests', () => {
  let extractionService: DocumentExtractionService;
  let structurer: ResumeStructurer;
  let resumeService: ResumeService;
  let ingestionService: ResumeIngestionService;

  const sampleStructuredResume: ResumeData = {
    schemaVersion: 1,
    personalInfo: {
      fullName: 'Anvesh Srivastava',
      headline: 'Software Engineer',
      email: 'anvesh@example.com',
    },
    summary: 'Full stack developer',
    links: [],
    education: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        institution: 'IIT',
      },
    ],
    experience: [
      {
        id: '22222222-2222-2222-2222-222222222222',
        company: 'TechCorp',
        position: 'Backend Developer',
      },
    ],
    projects: [
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'ResumeGraph',
        technologies: ['TypeScript', 'Node.js'],
      },
    ],
    skills: [
      {
        id: '44444444-4444-4444-4444-444444444444',
        category: 'Languages',
        skills: ['TypeScript'],
      },
    ],
    certifications: [],
    achievements: [],
    unmappedSections: [],
  };

  const samplePersistedEntity: ResumeEntity = {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Anvesh Srivastava Resume',
    schemaVersion: 1,
    data: sampleStructuredResume,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    extractionService = new DocumentExtractionService();
    structurer = new ResumeStructurer();
    resumeService = new ResumeService();
    ingestionService = new ResumeIngestionService(extractionService, structurer, resumeService);
  });

  it('1. successfully extracts, structures, and persists a valid PDF resume', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockResolvedValueOnce({
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
      text: 'Anvesh Srivastava\nSoftware Engineer\nIIT\nTechCorp\nResumeGraph Project',
      characterCount: 80,
    });
    vi.spyOn(structurer, 'structureResumeText').mockResolvedValueOnce(sampleStructuredResume);
    const persistSpy = vi.spyOn(resumeService, 'persistStructuredResume').mockResolvedValueOnce(samplePersistedEntity);

    const fakePdfBuffer = Buffer.from('%PDF-dummy');
    const result = await ingestionService.ingestResume(fakePdfBuffer, 'resume.pdf', 'application/pdf');

    expect(result.id).toBe(samplePersistedEntity.id);
    expect(result.title).toBe('Anvesh Srivastava Resume');
    expect(persistSpy).toHaveBeenCalledWith('Anvesh Srivastava Resume', sampleStructuredResume);
  });

  it('2. successfully extracts, structures, and persists a valid DOCX resume', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockResolvedValueOnce({
      fileName: 'resume.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      text: 'Anvesh Srivastava\nSoftware Engineer\nIIT\nTechCorp',
      characterCount: 65,
    });
    vi.spyOn(structurer, 'structureResumeText').mockResolvedValueOnce(sampleStructuredResume);
    const persistSpy = vi.spyOn(resumeService, 'persistStructuredResume').mockResolvedValueOnce(samplePersistedEntity);

    const fakeDocxBuffer = Buffer.from('PK-dummy-docx');
    const result = await ingestionService.ingestResume(
      fakeDocxBuffer,
      'resume.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    expect(result.id).toBe(samplePersistedEntity.id);
    expect(persistSpy).toHaveBeenCalledTimes(1);
  });

  it('3. extraction failure aborts ingestion and performs no database write', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockRejectedValueOnce(
      new AppError('Failed to parse corrupted PDF', 400)
    );
    const structureSpy = vi.spyOn(structurer, 'structureResumeText');
    const persistSpy = vi.spyOn(resumeService, 'persistStructuredResume');

    await expect(
      ingestionService.ingestResume(Buffer.from('corrupt'), 'bad.pdf', 'application/pdf')
    ).rejects.toThrowError('Failed to parse corrupted PDF');

    expect(structureSpy).not.toHaveBeenCalled();
    expect(persistSpy).not.toHaveBeenCalled();
  });

  it('4. AI provider failure aborts ingestion and performs no database write', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockResolvedValueOnce({
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
      text: 'Valid resume text with sufficient length for testing',
      characterCount: 52,
    });
    vi.spyOn(structurer, 'structureResumeText').mockRejectedValueOnce(
      new AppError('AI provider rate limit exceeded', 502)
    );
    const persistSpy = vi.spyOn(resumeService, 'persistStructuredResume');

    await expect(
      ingestionService.ingestResume(Buffer.from('valid'), 'resume.pdf', 'application/pdf')
    ).rejects.toThrowError('AI provider rate limit exceeded');

    expect(persistSpy).not.toHaveBeenCalled();
  });

  it('5. invalid AI structure aborts ingestion and performs no database write', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockResolvedValueOnce({
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
      text: 'Valid resume text with sufficient length',
      characterCount: 40,
    });
    vi.spyOn(structurer, 'structureResumeText').mockRejectedValueOnce(
      new AppError('AI output failed schema validation', 422)
    );
    const persistSpy = vi.spyOn(resumeService, 'persistStructuredResume');

    await expect(
      ingestionService.ingestResume(Buffer.from('valid'), 'resume.pdf', 'application/pdf')
    ).rejects.toThrowError('AI output failed schema validation');

    expect(persistSpy).not.toHaveBeenCalled();
  });

  it('6. empty extracted text aborts immediately with 400 and makes no AI call or DB write', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockResolvedValueOnce({
      fileName: 'blank.pdf',
      mimeType: 'application/pdf',
      text: '   ',
      characterCount: 3,
    });
    const structureSpy = vi.spyOn(structurer, 'structureResumeText');
    const persistSpy = vi.spyOn(resumeService, 'persistStructuredResume');

    await expect(
      ingestionService.ingestResume(Buffer.from('blank'), 'blank.pdf', 'application/pdf')
    ).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringMatching(/insufficient content/),
    });

    expect(structureSpy).not.toHaveBeenCalled();
    expect(persistSpy).not.toHaveBeenCalled();
  });

  it('7. verifies backend UUIDs are present in all structured entities when persisted', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockResolvedValueOnce({
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
      text: 'Full candidate resume text with various sections',
      characterCount: 50,
    });
    vi.spyOn(structurer, 'structureResumeText').mockResolvedValueOnce(sampleStructuredResume);

    let savedData: ResumeData | null = null;
    vi.spyOn(resumeService, 'persistStructuredResume').mockImplementationOnce(async (_title, data) => {
      savedData = data;
      return samplePersistedEntity;
    });

    await ingestionService.ingestResume(Buffer.from('content'), 'resume.pdf', 'application/pdf');

    expect(savedData).not.null;
    expect(savedData!.projects[0].id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(savedData!.experience[0].id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(savedData!.education[0].id).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it('8. derives candidate name + " Resume" for title', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockResolvedValueOnce({
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
      text: 'Anvesh Srivastava Resume Text',
      characterCount: 30,
    });
    vi.spyOn(structurer, 'structureResumeText').mockResolvedValueOnce({
      ...sampleStructuredResume,
      personalInfo: { fullName: 'Jane Doe' },
    });
    const persistSpy = vi.spyOn(resumeService, 'persistStructuredResume').mockResolvedValueOnce(samplePersistedEntity);

    await ingestionService.ingestResume(Buffer.from('pdf'), 'resume.pdf', 'application/pdf');

    expect(persistSpy).toHaveBeenCalledWith('Jane Doe Resume', expect.anything());
  });

  it('9. falls back to "Untitled Resume" when candidate name is absent or empty', async () => {
    vi.spyOn(extractionService, 'extractDocumentText').mockResolvedValueOnce({
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
      text: 'Anonymous Resume Text Content',
      characterCount: 30,
    });
    vi.spyOn(structurer, 'structureResumeText').mockResolvedValueOnce({
      ...sampleStructuredResume,
      personalInfo: { fullName: '' },
    });
    const persistSpy = vi.spyOn(resumeService, 'persistStructuredResume').mockResolvedValueOnce(samplePersistedEntity);

    await ingestionService.ingestResume(Buffer.from('pdf'), 'resume.pdf', 'application/pdf');

    expect(persistSpy).toHaveBeenCalledWith('Untitled Resume', expect.anything());
  });
});
