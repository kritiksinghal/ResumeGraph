import { DocumentExtractionService, documentExtractionService } from './extraction/document.service';
import { ResumeStructurer, resumeStructurer } from './ai/resume.structurer';
import { ResumeService, resumeService } from './resume.service';
import { ResumeEntity } from '../types/resume';
import { AppError } from '../middlewares/errorHandler';

export class ResumeIngestionService {
  private extractionService: DocumentExtractionService;
  private structurer: ResumeStructurer;
  private resService: ResumeService;

  constructor(
    extractionService: DocumentExtractionService = documentExtractionService,
    structurer: ResumeStructurer = resumeStructurer,
    resService: ResumeService = resumeService
  ) {
    this.extractionService = extractionService;
    this.structurer = structurer;
    this.resService = resService;
  }

  /**
   * Ingests a raw resume file (PDF or DOCX), extracts text, structures with AI,
   * assigns UUIDs, derives a title, and persists the resume atomically to PostgreSQL.
   */
  async ingestResume(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<ResumeEntity> {
    // 1. Extract text from uploaded document
    const extracted = await this.extractionService.extractDocumentText(
      fileBuffer,
      originalName,
      mimeType
    );

    // 2. Reject empty or meaningless text
    const trimmedText = extracted.text ? extracted.text.trim() : '';
    if (trimmedText.length < 10) {
      throw new AppError(
        'Extracted document text is empty or contains insufficient content to structure',
        400
      );
    }

    // 3. Structure with AI, validate, and assign UUIDs
    const structuredResume = await this.structurer.structureResumeText(trimmedText);

    // 4. Derive candidate title
    const candidateName = structuredResume.personalInfo?.fullName?.trim();
    const title = candidateName ? `${candidateName} Resume` : 'Untitled Resume';

    // 5. Persist to PostgreSQL (only after all prior steps succeed)
    return this.resService.persistStructuredResume(title, structuredResume);
  }
}

export const resumeIngestionService = new ResumeIngestionService();
