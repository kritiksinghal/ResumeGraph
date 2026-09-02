import { describe, it, expect } from 'vitest';
import {
  DocumentExtractionService,
  documentExtractionService,
} from './document.service';
import { PdfExtractor } from './pdf.extractor';
import { DocxExtractor } from './docx.extractor';
import {
  createSamplePdfBuffer,
  createSampleDocxBuffer,
  createMalformedPdfBuffer,
  createMalformedDocxBuffer,
} from '../../test/fixtures';

describe('Document Extraction Unit Tests', () => {
  const service = new DocumentExtractionService();
  const pdfExtractor = new PdfExtractor();
  const docxExtractor = new DocxExtractor();

  it('PdfExtractor extracts text from a valid PDF buffer fixture', async () => {
    const pdfBuffer = createSamplePdfBuffer('Alex Rivera - Lead Software Architect');
    const result = await pdfExtractor.extractText(pdfBuffer);

    expect(result.text).toContain('Alex Rivera - Lead Software Architect');
    expect(result.characterCount).toBeGreaterThan(0);
    expect(result.pageCount).toBe(1);
  });

  it('DocxExtractor extracts text from a valid DOCX buffer fixture', async () => {
    const docxBuffer = await createSampleDocxBuffer('Alex Rivera - Full Stack Engineer');
    const result = await docxExtractor.extractText(docxBuffer);

    expect(result.text).toContain('Alex Rivera - Full Stack Engineer');
    expect(result.characterCount).toBeGreaterThan(0);
  });

  it('DocumentExtractionService dispatches PDF and extracts text successfully', async () => {
    const pdfBuffer = createSamplePdfBuffer('Jane Doe - Data Engineer');
    const result = await service.extractDocumentText(
      pdfBuffer,
      'jane_resume.pdf',
      'application/pdf'
    );

    expect(result.fileName).toBe('jane_resume.pdf');
    expect(result.mimeType).toBe('application/pdf');
    expect(result.text).toContain('Jane Doe - Data Engineer');
    expect(result.characterCount).toBeGreaterThan(0);
  });

  it('DocumentExtractionService dispatches DOCX and extracts text successfully', async () => {
    const docxBuffer = await createSampleDocxBuffer('John Smith - DevOps Engineer');
    const result = await service.extractDocumentText(
      docxBuffer,
      'john_resume.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    expect(result.fileName).toBe('john_resume.docx');
    expect(result.mimeType).toContain('wordprocessingml');
    expect(result.text).toContain('John Smith - DevOps Engineer');
    expect(result.characterCount).toBeGreaterThan(0);
  });

  it('DocumentExtractionService falls back to extension when mimeType is octet-stream', async () => {
    const pdfBuffer = createSamplePdfBuffer('Fallback PDF Test');
    const result = await service.extractDocumentText(
      pdfBuffer,
      'test.pdf',
      'application/octet-stream'
    );

    expect(result.text).toContain('Fallback PDF Test');
  });

  it('DocumentExtractionService rejects unsupported file format (e.g. image or text)', async () => {
    const txtBuffer = Buffer.from('Plain text file');

    await expect(
      service.extractDocumentText(txtBuffer, 'resume.txt', 'text/plain')
    ).rejects.toThrowError(/Unsupported document format/);
  });

  it('PdfExtractor throws error on malformed/corrupted PDF buffer', async () => {
    const corruptedBuffer = createMalformedPdfBuffer();

    await expect(pdfExtractor.extractText(corruptedBuffer)).rejects.toThrowError(
      /Failed to parse PDF document/
    );
  });

  it('DocxExtractor throws error on malformed/corrupted DOCX buffer', async () => {
    const corruptedBuffer = createMalformedDocxBuffer();

    await expect(docxExtractor.extractText(corruptedBuffer)).rejects.toThrowError(
      /Failed to parse DOCX document/
    );
  });
});
