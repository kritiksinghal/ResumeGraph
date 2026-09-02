import Anthropic from '@anthropic-ai/sdk';
import { IAIProvider, AIStructuredResponse } from './ai.provider';
import { env } from '../../config/env';
import { AppError } from '../../middlewares/errorHandler';

export class ClaudeProvider implements IAIProvider {
  private client: Anthropic | null = null;
  private model: string;

  constructor(apiKey: string = env.ANTHROPIC_API_KEY, model: string = env.ANTHROPIC_MODEL) {
    this.model = model;
    if (apiKey && apiKey.trim().length > 0) {
      this.client = new Anthropic({ apiKey });
    }
  }

  async generateCompletion(systemPrompt: string, userPrompt: string): Promise<AIStructuredResponse> {
    if (!this.client) {
      throw new AppError(
        'Anthropic API key is not configured. Please set ANTHROPIC_API_KEY in your environment variables.',
        500
      );
    }

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        temperature: 0,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const firstContent = message.content[0];
      if (!firstContent || firstContent.type !== 'text') {
        throw new AppError('Received empty or non-text response from Claude AI provider', 502);
      }

      return {
        rawContent: firstContent.text,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      const message = error instanceof Error ? error.message : 'Unknown Anthropic error';
      throw new AppError(`AI Provider Error (Claude): ${message}`, 502);
    }
  }
}
