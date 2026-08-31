import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// 1. Analyze Job Description Endpoint
app.post('/api/gemini/analyze-jd', async (req, res) => {
  try {
    const { jdText, jobTitle, company } = req.body;
    if (!jdText) {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return structured fallback
      return res.json({
        success: true,
        source: 'local_fallback',
        data: {
          extractedSkills: {
            required: ['Distributed Systems', 'Go', 'Python', 'Kafka', 'PostgreSQL', 'Kubernetes'],
            preferred: ['gRPC', 'Raft Consensus', 'AWS', 'Terraform']
          },
          keyTechnologies: ['Go', 'Kafka', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'Python'],
          coreResponsibilities: [
            'Architect scalable high-throughput microservices',
            'Ensure sub-millisecond latency SLAs and zero-downtime reliability',
            'Conduct code reviews and champion engineering best practices'
          ],
          experienceLevel: 'Senior (4+ years)',
          domainKeywords: ['Distributed Systems', 'Throughput', 'Event-Driven', 'Cloud Infrastructure', 'Microservices']
        }
      });
    }

    const prompt = `You are an expert ATS & Technical Recruiter parsing this job description for ${jobTitle || 'the role'} at ${company || 'the company'}.
Extract requirements in JSON format:
{
  "extractedSkills": {
    "required": ["skill1", "skill2"],
    "preferred": ["skill3", "skill4"]
  },
  "keyTechnologies": ["tech1", "tech2"],
  "coreResponsibilities": ["resp1", "resp2"],
  "experienceLevel": "e.g. Senior (4+ years)",
  "domainKeywords": ["keyword1", "keyword2"]
}

Job Description:
${jdText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, source: 'gemini', data: parsed });
  } catch (err: any) {
    console.error('Error analyzing JD with Gemini:', err);
    return res.status(500).json({ error: err.message || 'Failed to analyze JD' });
  }
});

// 2. Resume-JD Match & Incremental Suggestions Endpoint
app.post('/api/gemini/match-and-suggest', async (req, res) => {
  try {
    const { resumeData, jdText, jobTitle, company } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'local_fallback',
        message: 'Gemini API not configured. Local ATS rules engine active.'
      });
    }

    const prompt = `You are a research-grade Resume Optimization & ATS Auditor.
CRITICAL SAFETY & ETHICAL DIRECTIVE: You MUST NEVER fabricate claims, degrees, certifications, or employment history. Every suggestion must either:
1. Re-frame or quantify verified candidate experience, OR
2. Explicitly flag the skill as "unverified - candidate confirmation required".

Analyze candidate's structured resume against the target Job Description for "${jobTitle}" at "${company}".

Candidate Resume (JSON):
${JSON.stringify({
  profile: resumeData.profile,
  summary: resumeData.summary,
  experience: resumeData.experience?.map((e: any) => ({ company: e.company, role: e.role, bullets: e.bullets, tech: e.techStack })),
  projects: resumeData.projects?.map((p: any) => ({ name: p.name, tagline: p.tagline, bullets: p.bullets, tech: p.techStack })),
  skills: resumeData.skillCategories
})}

Job Description:
${jdText}

Return valid JSON:
{
  "matchScore": 88,
  "matchingBreakdown": [
    { "skill": "Kafka", "status": "exact_match", "foundIn": ["Work Experience"], "priority": "required" },
    { "skill": "Raft", "status": "exact_match", "foundIn": ["Projects"], "priority": "required" }
  ],
  "gapAnalysis": {
    "criticalGaps": ["missing_skill_1"],
    "keywordDeficits": ["underrepresented_term_1"],
    "strongMatches": ["strong_match_1"]
  },
  "aiSuggestions": [
    {
      "id": "sugg-1",
      "section": "summary",
      "title": "Sharpen Executive Summary for Target Role",
      "originalText": "...",
      "suggestedText": "...",
      "reason": "Why this aligns better with the job requirements",
      "confidence": "High",
      "groundedInEvidence": true,
      "evidenceSource": "Found in ChronosDB project & Apex Cloud experience"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, source: 'gemini', data: parsed });
  } catch (err: any) {
    console.error('Error matching with Gemini:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate suggestions' });
  }
});

// 3. Explain Semantic Diff Endpoint
app.post('/api/gemini/explain-diff', async (req, res) => {
  try {
    const { fromResume, toResume, fromBranch, toBranch } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'local_fallback',
        explanation: `Semantic divergence between ${fromBranch} and ${toBranch} centers on role specialization.`
      });
    }

    const prompt = `Compare these two resume revisions and generate high-level semantic insights on how the candidate's professional narrative and positioning evolved between the two versions.

Version A (${fromBranch}):
Summary: ${fromResume.summary?.text}
Top Experience: ${fromResume.experience?.[0]?.bullets?.join('; ')}
Top Project: ${fromResume.projects?.[0]?.name} (${fromResume.projects?.[0]?.tagline})

Version B (${toBranch}):
Summary: ${toResume.summary?.text}
Top Experience: ${toResume.experience?.[0]?.bullets?.join('; ')}
Top Project: ${toResume.projects?.[0]?.name} (${toResume.projects?.[0]?.tagline})

Return JSON:
{
  "semanticInsights": [
    {
      "sectionKey": "summary",
      "interpretation": "Explanation of narrative pivot...",
      "confidence": "High",
      "impact": "Direct impact on recruiter perception...",
      "reasoning": "Underlying rationale..."
    }
  ],
  "narrativeShiftSummary": "Overall narrative trajectory in 2 sentences."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, source: 'gemini', data: parsed });
  } catch (err: any) {
    console.error('Error generating diff explanation:', err);
    return res.status(500).json({ error: err.message });
  }
});

// 4. Synthesize Conflict Endpoint
app.post('/api/gemini/synthesize-conflict', async (req, res) => {
  try {
    const { conflict, sourceBranch, targetBranch } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        synthesizedText: `${conflict.sourceValue?.text || conflict.sourceValue || ''}`
      });
    }

    const prompt = `You are a professional document conflict resolution assistant.
Two resume branches have diverged with conflicting content:
Section: ${conflict.sectionKey}
Conflict Type: ${conflict.type}
Description: ${conflict.description}

Source Branch (${sourceBranch}) text:
${JSON.stringify(conflict.sourceValue)}

Target Branch (${targetBranch}) text:
${JSON.stringify(conflict.targetValue)}

Synthesize a single, superior, unified version that harmoniously integrates the best elements from both branches without redundancy or contradiction.

Return JSON:
{
  "synthesizedText": "The unified statement...",
  "rationale": "Why this resolves the divergence cleanly",
  "confidence": 0.94
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, source: 'gemini', data: parsed });
  } catch (err: any) {
    console.error('Error synthesizing conflict:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumeFlow Server running on http://localhost:${PORT}`);
  });
}

startServer();
