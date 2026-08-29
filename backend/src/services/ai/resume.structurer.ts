import { IAIProvider } from './ai.provider';
import { ClaudeProvider } from './claude.provider';
import { STRUCTURING_SYSTEM_PROMPT, buildStructuringUserPrompt } from './prompts';
import {
  createResumeDataInputSchema,
  assignResumeDataIds,
  resumeDataSchema,
} from '../../schemas/resume.schema';
import { CreateResumeDataInput, ResumeData } from '../../types/resume';
import { AppError } from '../../middlewares/errorHandler';

export class ResumeStructurer {
  private provider: IAIProvider;

  constructor(provider: IAIProvider = new ClaudeProvider()) {
    this.provider = provider;
  }

  /**
   * Cleans raw AI response text, stripping markdown code fences if present.
   */
  cleanJsonResponse(rawText: string): string {
    let cleaned = rawText.trim();

    // Match and extract content inside ```json ... ``` or ``` ... ```
    const markdownRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i;
    const match = cleaned.match(markdownRegex);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }

    return cleaned;
  }

  /**
   * Sanitizes entity items in case the AI generated extraneous 'id' or 'schemaVersion' fields.
   */
  private sanitizeAiInput(data: Record<string, unknown>): Record<string, unknown> {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const { schemaVersion: _sv, ...rest } = data;

    const sanitizeArray = (arr: unknown) => {
      if (!Array.isArray(arr)) return arr;
      return arr.map((item) => {
        if (typeof item === 'object' && item !== null) {
          const { id: _id, ...itemRest } = item as Record<string, unknown>;
          return itemRest;
        }
        return item;
      });
    };

    return {
      ...rest,
      links: sanitizeArray(rest.links),
      education: sanitizeArray(rest.education),
      experience: sanitizeArray(rest.experience),
      projects: sanitizeArray(rest.projects),
      skills: sanitizeArray(rest.skills),
      certifications: sanitizeArray(rest.certifications),
      achievements: sanitizeArray(rest.achievements),
      unmappedSections: sanitizeArray(rest.unmappedSections),
    };
  }

  /**
   * Converts raw resume text into validated, structured ResumeData.
   */
  async structureResumeText(rawText: string): Promise<ResumeData> {
    if (!rawText || rawText.trim().length === 0) {
      throw new AppError('Resume text cannot be empty', 400);
    }

    const systemPrompt = STRUCTURING_SYSTEM_PROMPT;
    const userPrompt = buildStructuringUserPrompt(rawText);

    // 1. Call AI Provider
    const response = await this.provider.generateCompletion(systemPrompt, userPrompt);

    // 2. Extract & Parse JSON
    const cleanedJson = this.cleanJsonResponse(response.rawContent);
    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(cleanedJson);
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : 'Invalid JSON format';
      throw new AppError(`AI generated malformed JSON output: ${message}`, 502);
    }

    if (typeof parsedJson !== 'object' || parsedJson === null) {
      throw new AppError('AI generated an invalid non-object response', 502);
    }

    // 3. Sanitize and validate input against create schema
    const sanitized = this.sanitizeAiInput(parsedJson as Record<string, unknown>);
    const parseResult = createResumeDataInputSchema.safeParse(sanitized);

    if (!parseResult.success) {
      throw new AppError(
        'AI output failed schema validation',
        422,
        parseResult.error.issues
      );
    }

    const validatedInput: CreateResumeDataInput = parseResult.data;

    // 4. Backend assigns UUIDs to all entities
    const fullResumeData = assignResumeDataIds(validatedInput);

    // 5. Final validation against stored contract schema
    return resumeDataSchema.parse(fullResumeData);
  }
}

export const resumeStructurer = new ResumeStructurer();
