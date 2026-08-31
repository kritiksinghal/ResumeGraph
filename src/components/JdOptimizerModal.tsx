import React from 'react';
import {
  X,
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Plus,
  RefreshCw,
  Check
} from 'lucide-react';
import { ResumeData, JobDescriptionAnalysis, JdMatchReport, AtsSuggestion } from '../types/resume';
import { analyzeJobDescriptionDirectly, matchResumeAgainstJd } from '../utils/atsEngine';

interface JdOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onApplySuggestions: (updatedResume: ResumeData, appliedNote: string) => void;
}

const PRESET_JDS = [
  {
    company: 'Stripe',
    title: 'Staff Systems & Infrastructure Engineer',
    text: `About the Role:
We are looking for an experienced Staff Systems Engineer to build core high-throughput distributed infrastructure powering billions of global payment transactions.

Key Responsibilities:
- Design, scale, and maintain mission-critical distributed databases and consensus systems (Raft/Paxos).
- Optimize low-latency microservices with sub-millisecond p99 SLA guarantees in Go and C++.
- Architect resilient disaster recovery topologies with 99.999% availability.
- Lead system reliability post-mortems and capacity planning for global cloud infrastructure (AWS/Kubernetes).

Requirements:
- 5+ years of experience with distributed systems, high throughput, and concurrency.
- Expert proficiency in Go, C++, or Rust.
- Deep understanding of database internals, storage engines, and network protocols (TCP/gRPC).
- Experience with Kubernetes, Docker, Terraform, and high availability systems.`
  },
  {
    company: 'Anthropic',
    title: 'AI Systems & Alignment Infrastructure Engineer',
    text: `About the Role:
Anthropic is an AI safety and research company. We're looking for an Infrastructure Engineer to build high-scale cluster orchestration for frontier AI training and alignment evaluations.

Responsibilities:
- Build fault-tolerant distributed training pipelines across thousands of H100 GPU clusters.
- Design low-latency inference endpoints with KV cache optimization and speculative decoding.
- Develop automated benchmark harnesses measuring hallucination rates, jailbreak resistance, and safety metrics.
- Collaborate closely with alignment researchers to operationalize Constitutional AI classifiers.

Requirements:
- Strong experience with PyTorch, CUDA, Python, and high performance computing (HPC).
- Background in distributed data parallel / tensor parallel training (Megatron-LM, DeepSpeed).
- Demonstrated experience deploying LLM inference pipelines with sub-50ms TTFT.
- Understanding of LLM evaluation benchmarks (MMLU, GSM8K) and guardrail systems.`
  },
  {
    company: 'Linear',
    title: 'Staff Product & Real-time Systems Engineer',
    text: `About the Role:
Linear is looking for a Systems-minded Product Engineer to scale our real-time collaborative issue tracking platform.

Responsibilities:
- Architect conflict-free replicated data types (CRDTs) and local-first SQLite sync protocols.
- Build instantaneous, high-density desktop and web interfaces using React, TypeScript, and WebAssembly.
- Optimize client-side rendering pipelines to sustain smooth 60fps animations and offline state transitions.

Requirements:
- Deep expertise in TypeScript, React, Vite, and modern web standards.
- Strong knowledge of real-time sync, WebSockets, IndexedDB, and state machines.
- Obsession with craft, micro-interactions, and keyboard-first workflows.`
  }
];

export const JdOptimizerModal: React.FC<JdOptimizerModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  onApplySuggestions
}) => {
  const [jdText, setJdText] = React.useState<string>(PRESET_JDS[0].text);
  const [company, setCompany] = React.useState<string>(PRESET_JDS[0].company);
  const [jobTitle, setJobTitle] = React.useState<string>(PRESET_JDS[0].title);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [matchReport, setMatchReport] = React.useState<JdMatchReport | null>(null);
  const [appliedSuggestionIds, setAppliedSuggestionIds] = React.useState<string[]>([]);

  // Analyze JD & Match Resume
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      let parsedJd: JobDescriptionAnalysis;
      try {
        const res = await fetch('/api/gemini/analyze-jd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jdText })
        });
        if (res.ok) {
          parsedJd = await res.json();
        } else {
          parsedJd = analyzeJobDescriptionDirectly(jdText, company, jobTitle);
        }
      } catch {
        parsedJd = analyzeJobDescriptionDirectly(jdText, company, jobTitle);
      }

      const report = matchResumeAgainstJd(resumeData, parsedJd);
      setMatchReport(report);
    } catch (err) {
      console.error('Error analyzing JD:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !matchReport) {
      handleAnalyze();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_JDS[0]) => {
    setCompany(preset.company);
    setJobTitle(preset.title);
    setJdText(preset.text);
    setMatchReport(null);
  };

  const handleApplySingleSuggestion = (suggestion: AtsSuggestion) => {
    const updated = JSON.parse(JSON.stringify(resumeData)) as ResumeData;

    if (suggestion.section === 'summary' && updated.summary) {
      updated.summary.text = suggestion.proposedText;
    } else if (suggestion.section === 'experience' && suggestion.entityId) {
      const exp = updated.experience.find(e => e.id === suggestion.entityId);
      if (exp) {
        if (suggestion.originalText) {
          const bIndex = exp.bullets.findIndex(b => b === suggestion.originalText);
          if (bIndex >= 0) {
            exp.bullets[bIndex] = suggestion.proposedText;
          } else {
            exp.bullets.unshift(suggestion.proposedText);
          }
        } else {
          exp.bullets.unshift(suggestion.proposedText);
        }
      }
    } else if (suggestion.section === 'projects' && suggestion.entityId) {
      const proj = updated.projects.find(p => p.id === suggestion.entityId);
      if (proj) {
        if (suggestion.originalText) {
          const bIndex = proj.bullets.findIndex(b => b === suggestion.originalText);
          if (bIndex >= 0) {
            proj.bullets[bIndex] = suggestion.proposedText;
          } else {
            proj.bullets.unshift(suggestion.proposedText);
          }
        } else {
          proj.bullets.unshift(suggestion.proposedText);
        }
      }
    }

    setAppliedSuggestionIds(prev => [...prev, suggestion.id]);
    onApplySuggestions(updated, `AI ATS Alignment for ${company} (${jobTitle}): ${suggestion.proposedText.slice(0, 40)}...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#121212] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                INTELLIGENCE // PARSING
              </span>
              <h2 className="font-serif-display text-xl font-bold italic tracking-tight text-[#121212]">
                ATS Semantic Alignment & Grounded Optimizer
              </h2>
              <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
                Ground-truth alignment against job descriptions with zero hallucinations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#121212] hover:opacity-60 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: JD Input & Presets (5 cols) */}
          <div className="md:col-span-5 border-r border-[#121212] overflow-y-auto p-5 space-y-4 bg-[#F4F1EA]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/70 font-sans">
                Target Opportunity Specification
              </span>
              <span className="text-[10px] font-mono text-[#121212]/60">Presets</span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {PRESET_JDS.map(preset => (
                <button
                  key={preset.company}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 border text-left transition-all text-xs shadow-[2px_2px_0px_0px_#121212] ${
                    company === preset.company
                      ? 'bg-[#121212] text-[#F4F1EA] border-[#121212]'
                      : 'bg-[#FAF8F5] border-[#121212] text-[#121212] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <p className="font-bold font-serif-display italic">{preset.company}</p>
                  <p className="text-[9px] font-sans truncate opacity-80">{preset.title}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#121212] block mb-1">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-[#121212] block mb-1">Role Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-[#121212] block mb-1 font-sans">Job Description Text</label>
              <textarea
                rows={9}
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                placeholder="Paste complete job description requirements here..."
                className="w-full bg-[#FAF8F5] border border-[#121212] p-3 text-xs text-[#121212] font-sans leading-relaxed focus:outline-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jdText.trim()}
              className="w-full py-2 px-3 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-[0.15em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Alignment...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Re-Compute ATS Match</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: ATS Score, Skill Match Matrix, Incremental Suggestions (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-5 space-y-5 bg-[#FAF8F5]">
            {matchReport ? (
              <>
                {/* Score Banner */}
                <div className="bg-[#F4F1EA] border border-[#121212] p-4 flex items-center justify-between shadow-[3px_3px_0px_0px_#121212]">
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/60">
                      Overall ATS Match Score
                    </span>
                    <h3 className="text-xl font-bold font-serif-display italic text-[#121212] flex items-center gap-2">
                      <span>{matchReport.company}</span>
                      <span className="text-[#121212]/60 text-sm font-normal font-sans">— {matchReport.jobTitle}</span>
                    </h3>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono px-3 py-1 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
                      {matchReport.overallScore}%
                    </div>
                    <span className="text-[9px] text-[#121212]/60 uppercase font-mono font-bold mt-0.5 block">
                      ATS Pass Grade
                    </span>
                  </div>
                </div>

                {/* Skill Match Matrix */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/70 block font-sans">
                    Skill & Keyword Alignment Matrix
                  </span>

                  <div className="bg-[#FAF8F5] border border-[#121212] p-4 space-y-3 text-xs shadow-[2px_2px_0px_0px_#121212]">
                    {/* Exact Matches */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#264634] block mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Exact Keyword Matches ({matchReport.matchedSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchReport.matchedSkills.map((s, i) => (
                          <span
                            key={i}
                            className="bg-[#264634]/10 text-[#264634] border border-[#264634]/30 px-2 py-0.5 text-[10px] font-mono font-bold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Semantic Matches */}
                    {matchReport.semanticMatches.length > 0 && (
                      <div className="pt-2 border-t border-[#121212]/20">
                        <span className="text-[10px] font-bold uppercase text-[#1B4965] block mb-1.5 flex items-center gap-1">
                          <Target className="w-3 h-3" /> Semantic Equivalents ({matchReport.semanticMatches.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {matchReport.semanticMatches.map((sm, i) => (
                            <span
                              key={i}
                              className="bg-[#1B4965]/10 text-[#1B4965] border border-[#1B4965]/30 px-2 py-0.5 text-[10px] font-mono font-bold"
                            >
                              {sm.resumeSkill} ≈ {sm.jdSkill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Gaps */}
                    {matchReport.missingSkills.length > 0 && (
                      <div className="pt-2 border-t border-[#121212]/20">
                        <span className="text-[10px] font-bold uppercase text-[#8B261D] block mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Keyword Gaps in Resume ({matchReport.missingSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {matchReport.missingSkills.map((s, i) => (
                            <span
                              key={i}
                              className="bg-[#8B261D]/10 text-[#8B261D] border border-[#8B261D]/30 px-2 py-0.5 text-[10px] font-mono font-bold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Incremental AI Suggestions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Grounded Incremental Bullet Improvements ({matchReport.suggestions.length})</span>
                    </span>
                    <span className="text-[10px] text-[#121212]/60 font-sans flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#264634]" />
                      Grounded
                    </span>
                  </div>

                  <div className="space-y-3">
                    {matchReport.suggestions.map((sug) => {
                      const isApplied = appliedSuggestionIds.includes(sug.id);

                      return (
                        <div
                          key={sug.id}
                          className={`bg-[#FAF8F5] border border-[#121212] p-4 space-y-2.5 shadow-[3px_3px_0px_0px_#121212] transition-all ${
                            isApplied ? 'opacity-75 bg-[#EAE6DC]' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[#121212]/20 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#121212] text-[#F4F1EA] font-semibold">
                                {sug.entityId || sug.section}
                              </span>
                              <span className="text-xs font-bold font-sans text-[#121212]">Targeting: {sug.targetRole}</span>
                            </div>

                            <span className="text-[9px] font-mono text-[#264634] font-bold border border-[#264634]/40 px-1.5 py-0.5 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              {sug.groundingType}
                            </span>
                          </div>

                          {/* Proposed Text */}
                          <div className="bg-[#F4F1EA] p-3 border border-[#121212]/30 text-xs text-[#121212] font-sans leading-relaxed">
                            <p>{sug.proposedText}</p>
                          </div>

                          {/* Rationale & Keyword Addressed */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#121212] pt-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[10px] uppercase">Keywords added:</span>
                              <div className="flex gap-1">
                                {sug.keywordsAddressed.map((k, i) => (
                                  <span key={i} className="text-[#121212] font-mono text-[10px] font-bold bg-[#FAF8F5] border border-[#121212]/40 px-1">
                                    +{k}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => handleApplySingleSuggestion(sug)}
                              disabled={isApplied}
                              className={`flex items-center gap-1 px-3 py-1 border border-[#121212] text-xs font-sans font-bold uppercase transition-all shadow-[2px_2px_0px_0px_#121212] ${
                                isApplied
                                  ? 'bg-[#264634] text-[#F4F1EA] cursor-default'
                                  : 'bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] cursor-pointer'
                              }`}
                            >
                              {isApplied ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Applied</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Apply Bullet</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
                <RefreshCw className="w-8 h-8 text-[#121212] animate-spin" />
                <p className="text-xs text-[#121212]/70 font-editorial-body italic">Analyzing Job Description against Candidate Resume...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
