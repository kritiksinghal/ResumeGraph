export interface ExtractedDocument {
  text: string;
  characterCount: number;
  pageCount?: number;
}

export interface IDocumentExtractor {
  extractText(buffer: Buffer): Promise<ExtractedDocument>;
}
