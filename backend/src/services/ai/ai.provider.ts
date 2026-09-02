export interface AIStructuredResponse {
  rawContent: string;
}

export interface IAIProvider {
  generateCompletion(systemPrompt: string, userPrompt: string): Promise<AIStructuredResponse>;
}
