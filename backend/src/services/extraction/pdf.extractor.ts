import { PDFParse } from 'pdf-parse';
import { ExtractedDocument, IDocumentExtractor } from './extractor.interface';
import { AppError } from '../../middlewares/errorHandler';

export class PdfExtractor implements IDocumentExtractor {
  async extractText(buffer: Buffer): Promise<ExtractedDocument> {
    const parser = new PDFParse({ data: buffer });
    try {
      const textResult = await parser.getText();
      const text = (textResult.text || '').trim();

      return {
        text,
        characterCount: text.length,
        pageCount: textResult.pages?.length ?? 1,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error parsing PDF';
      throw new AppError(`Failed to parse PDF document: ${message}`, 400);
    } finally {
      await parser.destroy().catch(() => {});
    }
  }
}
