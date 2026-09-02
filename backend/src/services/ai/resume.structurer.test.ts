import { describe, it, expect, vi } from 'vitest';
import { ResumeStructurer } from './resume.structurer';
import { IAIProvider, AIStructuredResponse } from './ai.provider';
import { STRUCTURING_SYSTEM_PROMPT, buildStructuringUserPrompt } from './prompts';

class MockAIProvider implements IAIProvider {
  public response: AIStructuredResponse = { rawContent: '{}' };
  public shouldFail = false;
  public failureError = new Error('Provider network connection failed');
  public capturedSystemPrompt = '';
  public capturedUserPrompt = '';

  async generateCompletion(systemPrompt: string, userPrompt: string): Promise<AIStructuredResponse> {
    this.capturedSystemPrompt = systemPrompt;
    this.capturedUserPrompt = userPrompt;

    if (this.shouldFail) {
      throw this.failureError;
    }
    return this.response;
  }
}

describe('ResumeStructurer Unit Tests', () => {
  const sampleValidAiJson = JSON.stringify({
    personalInfo: {
      fullName: 'Alex Rivera',
      headline: 'Full Stack Engineer',
      email: 'alex@example.com',
      phone: '+1 555-0199',
      location: 'San Francisco, CA',
    },
    summary: 'Experienced software developer.',
    links: [{ label: 'GitHub', url: 'https://github.com/alex' }],
    education: [{ institution: 'UC Berkeley', degree: 'B.S. CS' }],
    experience: [
      {
        company: 'TechCorp',
        position: 'Senior Engineer',
        highlights: ['Built ingestion pipeline'],
      },
    ],
    projects: [
      {
        name: 'ResumeGraph',
        description: 'Structured resume management',
        technologies: ['TypeScript', 'Express'],
      },
    ],
    skills: [{ category: 'Languages', skills: ['TypeScript', 'Python'] }],
    certifications: [{ name: 'AWS Certified' }],
    achievements: [{ title: 'Hackathon Winner' }],
    unmappedSections: [{ title: 'Publications', content: 'Paper on Document Structuring (2024)' }],
  });

  it('1. converts valid Claude JSON response into valid ResumeData with backend UUIDs and schemaVersion', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.response = { rawContent: sampleValidAiJson };

    const structurer = new ResumeStructurer(mockProvider);
    const result = await structurer.structureResumeText('Raw text content');

    expect(result.schemaVersion).toBe(1);
    expect(result.personalInfo.fullName).toBe('Alex Rivera');
    expect(result.projects[0].name).toBe('ResumeGraph');
    expect(result.projects[0].id).toBeDefined();
    expect(result.projects[0].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(result.experience[0].id).toBeDefined();
    expect(result.education[0].id).toBeDefined();
    expect(result.links[0].id).toBeDefined();
    expect(result.skills[0].id).toBeDefined();
    expect(result.certifications[0].id).toBeDefined();
    expect(result.achievements[0].id).toBeDefined();
    expect(result.unmappedSections[0].id).toBeDefined();
  });

  it('2. normalizes Claude Markdown-wrapped JSON (```json ... ```)', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.response = {
      rawContent: `\`\`\`json\n${sampleValidAiJson}\n\`\`\``,
    };

    const structurer = new ResumeStructurer(mockProvider);
    const result = await structurer.structureResumeText('Raw text content');

    expect(result.personalInfo.fullName).toBe('Alex Rivera');
    expect(result.projects).toHaveLength(1);
  });

  it('3. throws controlled 502 error on malformed JSON returned by AI', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.response = {
      rawContent: 'This is not JSON at all: { unclosed json object',
    };

    const structurer = new ResumeStructurer(mockProvider);

    await expect(structurer.structureResumeText('Raw text')).rejects.toMatchObject({
      statusCode: 502,
      message: expect.stringMatching(/AI generated malformed JSON/),
    });
  });

  it('4. throws controlled 422 error when Claude returns structurally invalid data (missing fullName)', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.response = {
      rawContent: JSON.stringify({
        personalInfo: {
          // missing required fullName
          email: 'no-name@example.com',
        },
      }),
    };

    const structurer = new ResumeStructurer(mockProvider);

    await expect(structurer.structureResumeText('Raw text')).rejects.toMatchObject({
      statusCode: 422,
      message: 'AI output failed schema validation',
    });
  });

  it('5. applies default empty arrays when Claude omits optional sections', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.response = {
      rawContent: JSON.stringify({
        personalInfo: {
          fullName: 'Minimal Candidate',
        },
      }),
    };

    const structurer = new ResumeStructurer(mockProvider);
    const result = await structurer.structureResumeText('Minimal text');

    expect(result.schemaVersion).toBe(1);
    expect(result.personalInfo.fullName).toBe('Minimal Candidate');
    expect(result.summary).toBe('');
    expect(result.links).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.experience).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.skills).toEqual([]);
    expect(result.certifications).toEqual([]);
    expect(result.achievements).toEqual([]);
    expect(result.unmappedSections).toEqual([]);
  });

  it('6 & 7. sanitizes any client/AI-supplied entity IDs and assigns authoritative backend UUIDs', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.response = {
      rawContent: JSON.stringify({
        personalInfo: { fullName: 'Alex Rivera' },
        projects: [
          {
            id: 'claude-hallucinated-id-1234',
            name: 'NOVA',
          },
        ],
      }),
    };

    const structurer = new ResumeStructurer(mockProvider);
    const result = await structurer.structureResumeText('Text');

    expect(result.projects[0].name).toBe('NOVA');
    expect(result.projects[0].id).not.toBe('claude-hallucinated-id-1234');
    expect(result.projects[0].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it('8. handles AI provider failure gracefully', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.shouldFail = true;
    mockProvider.failureError = new Error('Anthropic rate limit exceeded');

    const structurer = new ResumeStructurer(mockProvider);

    await expect(structurer.structureResumeText('Text')).rejects.toThrowError(
      /Anthropic rate limit exceeded/
    );
  });

  it('9. prompt construction contains the required anti-hallucination and formatting instructions', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.response = { rawContent: sampleValidAiJson };

    const structurer = new ResumeStructurer(mockProvider);
    await structurer.structureResumeText('Jane Doe\nStaff Engineer');

    expect(mockProvider.capturedSystemPrompt).toContain('NEVER hallucinate, invent, extrapolate');
    expect(mockProvider.capturedSystemPrompt).toContain('unmappedSections');
    expect(mockProvider.capturedSystemPrompt).toContain('DO NOT include any "id" fields');
    expect(mockProvider.capturedUserPrompt).toContain('Jane Doe\nStaff Engineer');
  });

  it('rejects empty input text with 400 Bad Request', async () => {
    const mockProvider = new MockAIProvider();
    const structurer = new ResumeStructurer(mockProvider);

    await expect(structurer.structureResumeText('   ')).rejects.toMatchObject({
      statusCode: 400,
      message: 'Resume text cannot be empty',
    });
  });
});
