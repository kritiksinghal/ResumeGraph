import mammoth from 'mammoth';
import { ExtractedDocument, IDocumentExtractor } from './extractor.interface';
import { AppError } from '../../middlewares/errorHandler';

export class DocxExtractor implements IDocumentExtractor {
  async extractText(buffer: Buffer): Promise<ExtractedDocument> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = (result.value || '').trim();

      return {
        text,
        characterCount: text.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error parsing DOCX';
      throw new AppError(`Failed to parse DOCX document: ${message}`, 400);
    }
  }
}
