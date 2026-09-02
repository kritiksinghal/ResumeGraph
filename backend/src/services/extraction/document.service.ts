import path from 'node:path';
import { IDocumentExtractor } from './extractor.interface';
import { PdfExtractor } from './pdf.extractor';
import { DocxExtractor } from './docx.extractor';
import { AppError } from '../../middlewares/errorHandler';

export interface UploadResponseData {
  fileName: string;
  mimeType: string;
  text: string;
  characterCount: number;
  pageCount?: number;
}

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
] as const;

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx'] as const;

export class DocumentExtractionService {
  private pdfExtractor: IDocumentExtractor;
  private docxExtractor: IDocumentExtractor;

  constructor(
    pdfExtractor: IDocumentExtractor = new PdfExtractor(),
    docxExtractor: IDocumentExtractor = new DocxExtractor()
  ) {
    this.pdfExtractor = pdfExtractor;
    this.docxExtractor = docxExtractor;
  }

  /**
   * Identifies the document type and extracts text.
   */
  async extractDocumentText(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResponseData> {
    const ext = path.extname(originalName).toLowerCase();
    const extractor = this.getExtractor(mimeType, ext);

    if (!extractor) {
      throw new AppError(
        `Unsupported document format: ${mimeType || ext}. Only PDF (.pdf) and Word (.docx) files are supported.`,
        400
      );
    }

    const extracted = await extractor.extractText(buffer);

    return {
      fileName: originalName,
      mimeType,
      text: extracted.text,
      characterCount: extracted.characterCount,
      ...(extracted.pageCount !== undefined ? { pageCount: extracted.pageCount } : {}),
    };
  }

  /**
   * Resolves the appropriate extractor based on MIME type or file extension.
   */
  getExtractor(mimeType: string, extension: string): IDocumentExtractor | null {
    if (mimeType === 'application/pdf' || extension === '.pdf') {
      return this.pdfExtractor;
    }
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword' ||
      extension === '.docx'
    ) {
      return this.docxExtractor;
    }
    return null;
  }
}

export const documentExtractionService = new DocumentExtractionService();
