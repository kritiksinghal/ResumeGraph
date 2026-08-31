import React from 'react';
import {
  X,
  GitCommit
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResumeData, ResumeVersion, ResumeBranch } from '../types/resume';
import { computeSemanticDiff } from '../utils/diffEngine';

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch: ResumeBranch;
  headVersion: ResumeVersion;
  draftResumeData: ResumeData;
  onCommit: (newVersion: ResumeVersion) => void;
}

export const CommitModal: React.FC<CommitModalProps> = ({
  isOpen,
  onClose,
  currentBranch,
  headVersion,
  draftResumeData,
  onCommit
}) => {
  const [message, setMessage] = React.useState('');
  const [category, setCategory] = React.useState<'feat' | 'fix' | 'refactor' | 'ai-opt' | 'merge'>('feat');
  const [tagsInput, setTagsInput] = React.useState('');
  const [author] = React.useState('Alex Rivera');

  // Compute live semantic changes between head and current draft
  const diff = React.useMemo(() => {
    return computeSemanticDiff(headVersion.resumeData, draftResumeData);
  }, [headVersion, draftResumeData]);

  // Generate automated change summary checklist
  const autoSummary = React.useMemo(() => {
    const lines: string[] = [];
    diff.level1_sections.forEach(s => {
      if (s.status !== 'unchanged') {
        lines.push(`${s.sectionName}: ${s.summary}`);
      }
    });
    diff.level2_entities.forEach(e => {
      lines.push(`${e.status.toUpperCase()} ${e.title} (${e.entityId})`);
    });
    if (lines.length === 0) {
      lines.push('Updated resume details');
    }
    return lines;
  }, [diff]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const versionId = `v${Date.now().toString().slice(-4)}`;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const newVersion: ResumeVersion = {
      id: versionId,
      branchId: currentBranch.id,
      parentVersionIds: [headVersion.id],
      timestamp: new Date().toISOString(),
      author,
      commitMessage: message.trim(),
      changeSummary: autoSummary,
      changeCategory: category,
      resumeData: JSON.parse(JSON.stringify(draftResumeData)),
      tags: tags.length > 0 ? tags : undefined
    };

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 }
    });

    onCommit(newVersion);
    setMessage('');
    setTagsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#121212] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                DISPATCH // RECORD
              </span>
              <h2 className="font-serif-display text-xl font-bold italic tracking-tight text-[#121212]">
                Commit & Snapshot Resume State
              </h2>
              <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
                Create an immutable checkpoint with automated semantic diff logging.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
          {/* Branch indicator */}
          <div className="bg-[#F4F1EA] p-3 border border-[#121212] flex items-center justify-between shadow-[2px_2px_0px_0px_#121212]">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#121212]/60 block">Target Track</span>
              <span className="font-mono text-xs font-bold text-[#121212]">{currentBranch.name}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#121212]/60 block">Parent Commit</span>
              <span className="font-mono text-xs text-[#121212] font-semibold">{headVersion.id}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#121212]/60 block">Delta Score</span>
              <span className="font-mono text-xs text-[#264634] font-bold">{diff.stats.semanticShiftScore}%</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block mb-1">
              Commit Message / Revision Log
            </label>
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. Added Raft consensus benchmarks and quantified TPS metrics"
              required
              className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block mb-1">
                Change Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none"
              >
                <option value="feat">feat (New section or entity)</option>
                <option value="ai-opt">ai-opt (ATS/JD AI bullet tuning)</option>
                <option value="refactor">refactor (Rephrased or reordered)</option>
                <option value="fix">fix (Corrected date or typo)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="e.g. stable, staff-eng, 2026-q1"
                className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-1.5 text-xs text-[#121212] focus:outline-none"
              />
            </div>
          </div>

          {/* Auto-detected semantic changes */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/70 block">
              Auto-Detected Semantic Modifications ({autoSummary.length})
            </span>

            <div className="bg-[#F4F1EA] border border-[#121212] p-3 space-y-1.5 max-h-36 overflow-y-auto font-sans">
              {autoSummary.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[#121212] text-xs">
                  <span className="font-bold">•</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#121212] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] border border-[#121212] font-sans font-bold text-xs uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] border border-[#121212] font-sans font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#121212] flex items-center gap-1.5"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Snapshot & Commit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
