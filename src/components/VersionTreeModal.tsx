import React from 'react';
import {
  X,
  GitCommit,
  ArrowRight,
  RotateCcw,
  Eye,
  Tag,
  Calendar,
  User,
  GitFork
} from 'lucide-react';
import { ResumeVersion, ResumeBranch } from '../types/resume';

interface VersionTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ResumeVersion[];
  branches: ResumeBranch[];
  currentVersionId: string;
  onCheckoutVersion: (version: ResumeVersion) => void;
  onRollbackToVersion: (version: ResumeVersion) => void;
  onCompareWithVersion: (version: ResumeVersion) => void;
  onCreateBranchFromVersion: (version: ResumeVersion) => void;
}

export const VersionTreeModal: React.FC<VersionTreeModalProps> = ({
  isOpen,
  onClose,
  versions,
  branches,
  currentVersionId,
  onCheckoutVersion,
  onRollbackToVersion,
  onCompareWithVersion,
  onCreateBranchFromVersion
}) => {
  const [selectedVersion, setSelectedVersion] = React.useState<ResumeVersion>(
    versions.find(v => v.id === currentVersionId) || versions[versions.length - 1]
  );

  if (!isOpen) return null;

  const branchMap = new Map<string, ResumeBranch>(branches.map(b => [b.id, b]));

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'feat':
        return <span className="text-[9px] font-mono uppercase bg-[#264634] text-[#F4F1EA] px-1.5 py-0.2 font-bold">feat</span>;
      case 'ai-opt':
        return <span className="text-[9px] font-mono uppercase bg-[#8B261D] text-[#F4F1EA] px-1.5 py-0.2 font-bold">ai-opt</span>;
      case 'merge':
        return <span className="text-[9px] font-mono uppercase bg-[#1B4965] text-[#F4F1EA] px-1.5 py-0.2 font-bold">merge</span>;
      case 'refactor':
        return <span className="text-[9px] font-mono uppercase bg-[#946B12] text-[#F4F1EA] px-1.5 py-0.2 font-bold">refactor</span>;
      default:
        return <span className="text-[9px] font-mono uppercase bg-[#121212] text-[#F4F1EA] px-1.5 py-0.2 font-bold">snapshot</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#121212] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                CHRONOLOGY // ARCHIVE
              </span>
              <h2 className="font-serif-display text-xl font-bold italic tracking-tight text-[#121212] flex items-center gap-2">
                <span>Resume Version Control Graph</span>
                <span className="text-xs font-mono font-normal text-[#121212]/60 not-italic">({versions.length} total snapshots)</span>
              </h2>
              <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
                Inspect historical snapshots, compare versions, checkout revisions, or fork specialized tracks.
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

        {/* Content Layout: Version Graph Timeline on Left + Inspector on Right */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Timeline List (7 cols) */}
          <div className="md:col-span-7 border-r border-[#121212] overflow-y-auto p-5 space-y-4 bg-[#F4F1EA]">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/70 flex items-center justify-between pb-2 border-b border-[#121212]/20">
              <span>Chronological Snapshot DAG</span>
              <span className="text-[9px] font-mono text-[#121212]/60">Most Recent First</span>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#121212]/30">
              {[...versions].reverse().map((version) => {
                const branch = branchMap.get(version.branchId) || {
                  name: version.branchId,
                  displayName: version.branchId,
                  color: '#121212'
                };
                const isSelected = selectedVersion.id === version.id;
                const isCurrent = version.id === currentVersionId;

                return (
                  <div
                    key={version.id}
                    onClick={() => setSelectedVersion(version)}
                    className={`relative cursor-pointer p-4 border transition-all shadow-[2px_2px_0px_0px_#121212] ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-[#121212] ring-2 ring-[#121212]'
                        : 'bg-[#FAF8F5] border-[#121212] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {/* Node Dot on Timeline */}
                    <div
                      className={`absolute -left-[27px] top-4.5 w-3.5 h-3.5 border border-[#121212] transition-transform ${
                        isSelected ? 'scale-125 ring-2 ring-[#121212]' : ''
                      }`}
                      style={{ backgroundColor: branch.color }}
                    />

                    {/* Commit Row Header */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#121212]">{version.id}</span>
                        {getCategoryBadge(version.changeCategory)}
                        <span className="text-[9px] font-mono px-1.5 py-0.2 border border-[#121212]/30 text-[#121212] font-semibold bg-[#FAF8F5]">
                          {branch.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-sans font-bold tracking-wider uppercase px-1.5 py-0.2 bg-[#121212] text-[#F4F1EA]">
                            Active HEAD
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#121212]/60 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-[#121212]/60" />
                        {new Date(version.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Commit Message */}
                    <p className="font-serif-display text-sm font-bold italic text-[#121212] line-clamp-2 mb-2">
                      {version.commitMessage}
                    </p>

                    {/* Semantic Changes preview */}
                    {version.changeSummary && version.changeSummary.length > 0 && (
                      <div className="space-y-0.5">
                        {version.changeSummary.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-[11px] font-editorial-body text-[#121212]/80 flex items-center gap-1.5 truncate">
                            <span className="text-[#121212] font-bold">•</span>
                            {item}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {version.tags && version.tags.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        {version.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono text-[#121212] bg-[#F4F1EA] border border-[#121212]/40 px-1.5 py-0.2 flex items-center gap-1"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Version Inspector (5 cols) */}
          <div className="md:col-span-5 bg-[#FAF8F5] p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/70 pb-2 border-b border-[#121212]/20 mb-4 flex items-center justify-between">
                <span>Snapshot Inspector</span>
                <span className="font-mono font-bold text-[#121212]">{selectedVersion.id}</span>
              </div>

              {/* Version Metadata Card */}
              <div className="bg-[#F4F1EA] border border-[#121212] p-4 space-y-3 mb-4 shadow-[3px_3px_0px_0px_#121212]">
                <div>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#121212]/60 block mb-1">Commit Message</span>
                  <p className="font-serif-display text-base font-bold italic text-[#121212]">{selectedVersion.commitMessage}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#121212]/20 font-sans">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#121212]/60 block">Track</span>
                    <span className="font-mono font-bold text-[#121212]">{selectedVersion.branchId}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#121212]/60 block">Author</span>
                    <span className="text-[#121212] flex items-center gap-1 font-medium">
                      <User className="w-3 h-3 text-[#121212]/60" />
                      {selectedVersion.author}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#121212]/60 block">Parents</span>
                    <span className="font-mono text-[#121212]/80 text-[10px]">
                      {selectedVersion.parentVersionIds.length > 0
                        ? selectedVersion.parentVersionIds.join(', ')
                        : 'Root Snapshot'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#121212]/60 block">Timestamp</span>
                    <span className="text-[#121212]/80 text-[10px] font-mono">
                      {new Date(selectedVersion.timestamp).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Semantic Changes List */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]/70 block">
                  Recorded Semantic Modifications
                </span>
                <div className="bg-[#F4F1EA] border border-[#121212] p-3 space-y-1.5 text-xs text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
                  {selectedVersion.changeSummary && selectedVersion.changeSummary.length > 0 ? (
                    selectedVersion.changeSummary.map((change, i) => (
                      <div key={i} className="flex items-start gap-2 font-editorial-body text-xs">
                        <span className="text-[#121212] font-mono text-[9px] font-bold mt-0.5">#{i + 1}</span>
                        <span>{change}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#121212]/60 italic text-xs font-editorial-body">No explicit change notes provided.</p>
                  )}
                </div>
              </div>

              {/* Resume Entity Count Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                <div className="bg-[#F4F1EA] border border-[#121212] p-2 shadow-[2px_2px_0px_0px_#121212]">
                  <span className="text-[9px] text-[#121212]/60 uppercase font-bold block">Roles</span>
                  <span className="font-serif-display font-bold text-base text-[#121212]">{selectedVersion.resumeData.experience?.length || 0}</span>
                </div>
                <div className="bg-[#F4F1EA] border border-[#121212] p-2 shadow-[2px_2px_0px_0px_#121212]">
                  <span className="text-[9px] text-[#121212]/60 uppercase font-bold block">Projects</span>
                  <span className="font-serif-display font-bold text-base text-[#121212]">{selectedVersion.resumeData.projects?.length || 0}</span>
                </div>
                <div className="bg-[#F4F1EA] border border-[#121212] p-2 shadow-[2px_2px_0px_0px_#121212]">
                  <span className="text-[9px] text-[#121212]/60 uppercase font-bold block">Skills</span>
                  <span className="font-serif-display font-bold text-base text-[#121212]">
                    {selectedVersion.resumeData.skillCategories?.reduce((acc, c) => acc + c.skills.length, 0) || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-[#121212]/20 font-sans">
              <button
                onClick={() => {
                  onCheckoutVersion(selectedVersion);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-bold text-xs uppercase tracking-[0.15em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Checkout Snapshot ({selectedVersion.id})</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onCompareWithVersion(selectedVersion);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] border border-[#121212] text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#121212] transition-all"
                >
                  <ArrowRight className="w-3 h-3 text-[#121212]" />
                  <span>Diff vs HEAD</span>
                </button>

                <button
                  onClick={() => {
                    onCreateBranchFromVersion(selectedVersion);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] border border-[#121212] text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#121212] transition-all"
                >
                  <GitFork className="w-3 h-3 text-[#121212]" />
                  <span>Fork Track</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to rollback to ${selectedVersion.id}? This will create a new commit restoring this state while preserving history.`)) {
                    onRollbackToVersion(selectedVersion);
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#8B261D]/10 hover:bg-[#8B261D]/20 text-[#8B261D] border border-[#8B261D]/40 text-xs font-bold uppercase transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-[#8B261D]" />
                <span>Rollback / Restore Snapshot</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
