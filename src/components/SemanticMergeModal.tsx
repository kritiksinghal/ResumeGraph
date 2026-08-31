import React from 'react';
import {
  X,
  GitMerge,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResumeBranch, ResumeVersion, MergeReport } from '../types/resume';
import { runSemantic3WayMerge, applyMergeResolutions } from '../utils/mergeEngine';

interface SemanticMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: ResumeBranch[];
  currentBranch: ResumeBranch;
  versions: ResumeVersion[];
  onCompleteMerge: (newVersion: ResumeVersion, targetBranchId: string) => void;
}

export const SemanticMergeModal: React.FC<SemanticMergeModalProps> = ({
  isOpen,
  onClose,
  branches,
  currentBranch,
  versions,
  onCompleteMerge
}) => {
  const otherBranches = branches.filter(b => b.id !== currentBranch.id);
  const [sourceBranchId, setSourceBranchId] = React.useState<string>(
    otherBranches.length > 0 ? otherBranches[0].id : branches[0].id
  );
  const [targetBranchId, setTargetBranchId] = React.useState<string>(currentBranch.id);

  const sourceBranch = branches.find(b => b.id === sourceBranchId) || branches[0];
  const targetBranch = branches.find(b => b.id === targetBranchId) || currentBranch;

  // Find latest versions for both
  const sourceVersion =
    [...versions].reverse().find(v => v.branchId === sourceBranch.id) || versions[0];
  const targetVersion =
    [...versions].reverse().find(v => v.branchId === targetBranch.id) || versions[0];

  // Compute Merge Report
  const [mergeReport, setMergeReport] = React.useState<MergeReport>(() =>
    runSemantic3WayMerge(
      sourceVersion.resumeData,
      targetVersion.resumeData,
      undefined,
      sourceBranch.name,
      targetBranch.name
    )
  );

  // Recalculate when branches change
  React.useEffect(() => {
    if (sourceVersion && targetVersion) {
      setMergeReport(
        runSemantic3WayMerge(
          sourceVersion.resumeData,
          targetVersion.resumeData,
          undefined,
          sourceBranch.name,
          targetBranch.name
        )
      );
    }
  }, [sourceBranchId, targetBranchId]);

  if (!isOpen) return null;

  // Handle conflict choice selection
  const handleResolveConflict = (
    conflictId: string,
    choice: 'source' | 'target' | 'synthesize' | 'custom',
    customText?: string
  ) => {
    setMergeReport(prev => {
      const updatedConflicts = prev.conflicts.map(c => {
        if (c.id === conflictId) {
          return {
            ...c,
            resolvedChoice: choice,
            resolvedValue: customText,
            isResolved: true
          };
        }
        return c;
      });
      return {
        ...prev,
        conflicts: updatedConflicts
      };
    });
  };

  const allConflictsResolved = mergeReport.conflicts.every(c => c.isResolved);

  const handleExecuteMerge = () => {
    const nextVerId = `v${versions.length + 1}-merge`;
    const mergedResume = applyMergeResolutions(
      sourceVersion.resumeData,
      targetVersion.resumeData,
      mergeReport,
      nextVerId,
      targetBranch.id
    );

    const newVersion: ResumeVersion = {
      id: nextVerId,
      branchId: targetBranch.id,
      parentVersionIds: [targetVersion.id, sourceVersion.id],
      timestamp: new Date().toISOString(),
      author: 'Alex Rivera',
      commitMessage: `Semantic Merge: ${sourceBranch.name} into ${targetBranch.name}`,
      changeSummary: [
        `Integrated modifications from ${sourceBranch.displayName}`,
        `Auto-merged ${mergeReport.autoMergedEntities.length} non-conflicting items`,
        `Resolved ${mergeReport.conflicts.length} semantic conflict(s)`
      ],
      changeCategory: 'merge',
      resumeData: mergedResume,
      tags: ['merged', `${sourceBranch.name}-sync`]
    };

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    onCompleteMerge(newVersion, targetBranch.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#121212] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                SYNCHRONIZATION // STUDIO
              </span>
              <h2 className="font-serif-display text-xl font-bold italic tracking-tight text-[#121212]">
                Semantic 3-Way Merge Studio
              </h2>
              <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
                Safely combine changes across role branches with automated conflict detection.
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

        {/* Branch Selection & Direction */}
        <div className="bg-[#F4F1EA] px-6 py-3 border-b border-[#121212] flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#121212]/60 block mb-1">Source Track (Incoming)</span>
              <select
                value={sourceBranchId}
                onChange={e => setSourceBranchId(e.target.value)}
                className="bg-[#FAF8F5] border border-[#121212] px-2.5 py-1 text-[#121212] font-mono text-xs shadow-[2px_2px_0px_0px_#121212] focus:outline-none"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id} disabled={b.id === targetBranchId}>
                    {b.name} ({b.displayName})
                  </option>
                ))}
              </select>
            </div>

            <ArrowRight className="w-4 h-4 text-[#121212] mt-3" />

            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#121212]/60 block mb-1">Target Track (Receiving)</span>
              <select
                value={targetBranchId}
                onChange={e => setTargetBranchId(e.target.value)}
                className="bg-[#FAF8F5] border border-[#121212] px-2.5 py-1 text-[#121212] font-mono text-xs shadow-[2px_2px_0px_0px_#121212] focus:outline-none"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id} disabled={b.id === sourceBranchId}>
                    {b.name} ({b.displayName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#121212]">
              Conflicts:{' '}
              <span className={`font-bold ${mergeReport.conflicts.length > 0 ? 'text-[#8B261D]' : 'text-[#264634]'}`}>
                {mergeReport.conflicts.length}
              </span>
            </span>
            <span className="text-[#121212]/40">•</span>
            <span className="text-[#121212]">
              Auto-Merged: <span className="font-bold text-[#264634]">{mergeReport.autoMergedEntities.length}</span>
            </span>
          </div>
        </div>

        {/* Merge Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF8F5]">
          {/* Conflicts Section */}
          {mergeReport.conflicts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8B261D]">
                <AlertTriangle className="w-4 h-4" />
                <span>Conflicting Modifications Requiring Resolution ({mergeReport.conflicts.length})</span>
              </div>

              <div className="space-y-4">
                {mergeReport.conflicts.map((conflict) => {
                  const isResolved = conflict.isResolved;

                  return (
                    <div
                      key={conflict.id}
                      className="bg-[#FAF8F5] border border-[#121212] p-4 md:p-5 space-y-4 shadow-[3px_3px_0px_0px_#121212]"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[#121212]/20 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono uppercase bg-[#121212] text-[#F4F1EA] px-2 py-0.5 font-bold">
                            {conflict.type.replace('_', ' ')}
                          </span>
                          <h4 className="font-serif-display text-base font-bold italic text-[#121212]">{conflict.title}</h4>
                        </div>
                        {isResolved ? (
                          <span className="flex items-center gap-1 text-xs text-[#264634] font-bold font-sans">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved ({conflict.resolvedChoice})
                          </span>
                        ) : (
                          <span className="text-xs text-[#8B261D] font-mono font-bold">Action Required</span>
                        )}
                      </div>

                      <p className="text-xs text-[#121212] font-editorial-body italic leading-relaxed">{conflict.description}</p>

                      {/* Side-by-side Branch Values */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                        <div
                          onClick={() => handleResolveConflict(conflict.id, 'source')}
                          className={`p-3.5 border cursor-pointer transition-all shadow-[2px_2px_0px_0px_#121212] ${
                            conflict.resolvedChoice === 'source'
                              ? 'bg-[#121212] text-[#F4F1EA] border-[#121212]'
                              : 'bg-[#F4F1EA] border-[#121212] text-[#121212] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold mb-1.5">
                            <span>Option 1: Source ({sourceBranch.name})</span>
                            {conflict.resolvedChoice === 'source' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <p className="text-xs font-sans leading-relaxed">
                            {conflict.sourceValue?.text || JSON.stringify(conflict.sourceValue)}
                          </p>
                        </div>

                        <div
                          onClick={() => handleResolveConflict(conflict.id, 'target')}
                          className={`p-3.5 border cursor-pointer transition-all shadow-[2px_2px_0px_0px_#121212] ${
                            conflict.resolvedChoice === 'target'
                              ? 'bg-[#121212] text-[#F4F1EA] border-[#121212]'
                              : 'bg-[#F4F1EA] border-[#121212] text-[#121212] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold mb-1.5">
                            <span>Option 2: Target ({targetBranch.name})</span>
                            {conflict.resolvedChoice === 'target' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <p className="text-xs font-sans leading-relaxed">
                            {conflict.targetValue?.text || JSON.stringify(conflict.targetValue)}
                          </p>
                        </div>
                      </div>

                      {/* AI Synthesized Option */}
                      {conflict.aiSuggestion && (
                        <div
                          onClick={() => handleResolveConflict(conflict.id, 'synthesize')}
                          className={`p-3.5 border cursor-pointer transition-all shadow-[2px_2px_0px_0px_#121212] ${
                            conflict.resolvedChoice === 'synthesize'
                              ? 'bg-[#FAF8F5] border-[#121212] ring-2 ring-[#121212]'
                              : 'bg-[#F4F1EA] border-[#121212] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-sans text-[#121212] font-bold uppercase tracking-wider mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Option 3: AI Smart Synthesis (Recommended)</span>
                            </div>
                            {conflict.resolvedChoice === 'synthesize' && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#264634]" />
                            )}
                          </div>
                          <p className="text-xs text-[#121212] font-sans font-medium mb-1.5 leading-relaxed">
                            {conflict.aiSuggestion.synthesizedValue?.text ||
                              conflict.aiSuggestion.synthesizedValue?.tagline ||
                              JSON.stringify(conflict.aiSuggestion.synthesizedValue)}
                          </p>
                          <p className="text-[11px] text-[#121212]/70 font-editorial-body italic">{conflict.aiSuggestion.rationale}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#264634]/10 border border-[#264634]/40 p-4 flex items-center gap-3 shadow-[2px_2px_0px_0px_#121212]">
              <CheckCircle2 className="w-6 h-6 text-[#264634] shrink-0" />
              <div>
                <h4 className="text-sm font-serif-display font-bold italic text-[#264634]">Clean Fast-Forward Merge Available</h4>
                <p className="text-xs text-[#121212]/80 font-sans">
                  No semantic collisions detected. All incoming skills, projects, and achievements can be safely integrated.
                </p>
              </div>
            </div>
          )}

          {/* Auto-merged summary card */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
              <FileCheck className="w-4 h-4" />
              <span>Auto-Resolved Non-Conflicting Updates ({mergeReport.autoMergedEntities.length})</span>
            </div>

            <div className="bg-[#F4F1EA] border border-[#121212] p-4 space-y-2 text-xs shadow-[2px_2px_0px_0px_#121212]">
              {mergeReport.autoMergedEntities.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[#121212] py-1 border-b border-[#121212]/20 last:border-0 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#121212] text-[#F4F1EA] font-semibold">
                      {item.sectionKey}
                    </span>
                    <span className="font-bold">{item.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#264634] font-bold">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#121212] bg-[#F4F1EA] flex items-center justify-between">
          <div className="text-xs text-[#121212]/70 font-sans">
            Target branch will advance to new merge snapshot.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] border border-[#121212] font-sans font-bold text-xs uppercase"
            >
              Cancel
            </button>

            <button
              onClick={handleExecuteMerge}
              disabled={!allConflictsResolved}
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-sans font-bold uppercase border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all ${
                allConflictsResolved
                  ? 'bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] cursor-pointer'
                  : 'bg-[#EAE6DC] text-[#121212]/40 cursor-not-allowed'
              }`}
            >
              <GitMerge className="w-4 h-4" />
              <span>Commit Semantic Merge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
