import pdfParse from 'pdf-parse';
import { ExtractedDocument, IDocumentExtractor } from './extractor.interface';
import { AppError } from '../../middlewares/errorHandler';

export class PdfExtractor implements IDocumentExtractor {
  async extractText(buffer: Buffer): Promise<ExtractedDocument> {
    try {
      const data = await pdfParse(buffer);
      const text = (data.text || '').trim();

      return {
        text,
        characterCount: text.length,
        pageCount: data.numpages,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error parsing PDF';
      throw new AppError(`Failed to parse PDF document: ${message}`, 400);
    }
  }
}
