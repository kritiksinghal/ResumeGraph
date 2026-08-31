import React from 'react';
import {
  X,
  BookOpen
} from 'lucide-react';

interface ResearchInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchInsightsModal: React.FC<ResearchInsightsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#121212] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                SCHOLARLY // MONOGRAPH
              </span>
              <h2 className="font-serif-display text-xl font-bold italic tracking-tight text-[#121212]">
                Research Specification & Inquiries
              </h2>
              <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
                Academic research framing for Semantic Document Evolution & AI Optimization (RQ1–RQ5).
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#121212] bg-[#FAF8F5]">
          {/* Abstract */}
          <div className="bg-[#F4F1EA] border border-[#121212] p-4 space-y-2 shadow-[3px_3px_0px_0px_#121212]">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/70 block">
              Abstract & Core Thesis
            </span>
            <p className="font-editorial-body text-xs text-[#121212] leading-relaxed italic">
              Modern job applications require candidates to continuously tailor resumes to distinct role archetypes.
              However, traditional word processors lack version control, while naive AI tools produce full-document
              hallucinatory rewrites. <strong>ResumeFlow</strong> introduces a structured, entity-anchored document
              evolution framework combining Git-style semantic branching, 4-level component diffing, and incremental,
              grounded AI optimization with verified provenance.
            </p>
          </div>

          {/* Research Questions Grid */}
          <div className="space-y-3">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]/70 block">
              Core Research Questions (RQ1–RQ5)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#FAF8F5] border border-[#121212] p-4 space-y-2 shadow-[2px_2px_0px_0px_#121212]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#121212] text-[#F4F1EA] font-bold">
                    RQ1
                  </span>
                  <h4 className="font-serif-display font-bold italic text-sm text-[#121212]">4-Level Semantic Diff Accuracy</h4>
                </div>
                <p className="text-[11px] font-editorial-body text-[#121212]/80 leading-relaxed">
                  How does component-aware entity diffing compare with Myers line-based diff in capturing resume edits
                  without false positive whitespace/reordering noise?
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#121212] p-4 space-y-2 shadow-[2px_2px_0px_0px_#121212]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#121212] text-[#F4F1EA] font-bold">
                    RQ2
                  </span>
                  <h4 className="font-serif-display font-bold italic text-sm text-[#121212]">Incremental vs Full-Rewrite AI</h4>
                </div>
                <p className="text-[11px] font-editorial-body text-[#121212]/80 leading-relaxed">
                  Does incremental bullet-level AI suggestion preserve candidate authentic voice and reduce hallucination
                  compared to whole-document LLM regeneration?
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#121212] p-4 space-y-2 shadow-[2px_2px_0px_0px_#121212]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#121212] text-[#F4F1EA] font-bold">
                    RQ3
                  </span>
                  <h4 className="font-serif-display font-bold italic text-sm text-[#121212]">Role-Branching Efficacy</h4>
                </div>
                <p className="text-[11px] font-editorial-body text-[#121212]/80 leading-relaxed">
                  Do specialized role branches (e.g. Systems vs AI/ML) yield significantly higher ATS keyword match and
                  interview response rates than a monolithic canonical resume?
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#121212] p-4 space-y-2 shadow-[2px_2px_0px_0px_#121212]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#121212] text-[#F4F1EA] font-bold">
                    RQ4
                  </span>
                  <h4 className="font-serif-display font-bold italic text-sm text-[#121212]">3-Way Semantic Merge Resolution</h4>
                </div>
                <p className="text-[11px] font-editorial-body text-[#121212]/80 leading-relaxed">
                  How effectively can 3-way semantic conflict resolution synthesize divergent achievements into a unified
                  master document with automated collision detection?
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#121212] p-4 space-y-2 md:col-span-2 shadow-[2px_2px_0px_0px_#121212]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#121212] text-[#F4F1EA] font-bold">
                    RQ5
                  </span>
                  <h4 className="font-serif-display font-bold italic text-sm text-[#121212]">Anti-Hallucination Grounding & Ethics</h4>
                </div>
                <p className="text-[11px] font-editorial-body text-[#121212]/80 leading-relaxed">
                  How do verified evidence anchors (linking skills to concrete role experiences) prevent generative AI
                  from fabricating fake technologies, companies, or credentials?
                </p>
              </div>
            </div>
          </div>

          {/* Comparative Framework Table */}
          <div className="space-y-3">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]/70 block">
              Architectural Comparison Matrix
            </span>

            <div className="overflow-x-auto border border-[#121212] shadow-[3px_3px_0px_0px_#121212]">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#121212] text-[9px] font-mono uppercase text-[#F4F1EA] border-b border-[#121212]">
                  <tr>
                    <th className="p-3">Dimension</th>
                    <th className="p-3">Traditional (Word / Docs)</th>
                    <th className="p-3">Generic LLM Chatbot</th>
                    <th className="p-3 bg-[#264634]">ResumeFlow Framework</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121212]/20 bg-[#FAF8F5]">
                  <tr>
                    <td className="p-3 font-bold text-[#121212]">Data Model</td>
                    <td className="p-3 text-[#121212]/70">Unstructured binary / text</td>
                    <td className="p-3 text-[#121212]/70">Ephemeral markdown text</td>
                    <td className="p-3 font-mono font-bold text-[#264634]">Structured Semantic Entity DAG</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#121212]">Version History</td>
                    <td className="p-3 text-[#121212]/70">Filename clutter (`v2_final.pdf`)</td>
                    <td className="p-3 text-[#121212]/70">Lost across chat sessions</td>
                    <td className="p-3 font-bold text-[#264634]">Git-Style Commits & Branches</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#121212]">Diff Precision</td>
                    <td className="p-3 text-[#121212]/70">Character/Line diff (noisy)</td>
                    <td className="p-3 text-[#121212]/70">None</td>
                    <td className="p-3 font-bold text-[#264634]">4-Level Semantic Diff</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#121212]">AI Safety</td>
                    <td className="p-3 text-[#121212]/70">N/A</td>
                    <td className="p-3 text-[#8B261D] font-bold">High Hallucination Risk</td>
                    <td className="p-3 font-bold text-[#264634]">Grounded Incremental Anchors</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#121212]">Merging</td>
                    <td className="p-3 text-[#121212]/70">Manual copy-pasting</td>
                    <td className="p-3 text-[#121212]/70">Uncontrolled rewrite</td>
                    <td className="p-3 font-bold text-[#264634]">3-Way Semantic Resolver</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
