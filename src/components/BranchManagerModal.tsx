import React from 'react';
import {
  X,
  GitBranch,
  Plus
} from 'lucide-react';
import { ResumeBranch, ResumeVersion } from '../types/resume';

interface BranchManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: ResumeBranch[];
  currentBranchId: string;
  versions: ResumeVersion[];
  onSelectBranch: (branchId: string) => void;
  onCreateBranch: (newBranch: ResumeBranch) => void;
}

const PRESET_COLORS = [
  '#121212', // Charcoal Ink
  '#8B261D', // Terracotta
  '#264634', // Forest Olive
  '#946B12', // Ochre
  '#1B4965', // Navy
  '#4A4E69'  // Muted Slate
];

export const BranchManagerModal: React.FC<BranchManagerModalProps> = ({
  isOpen,
  onClose,
  branches,
  currentBranchId,
  versions,
  onSelectBranch,
  onCreateBranch
}) => {
  const [name, setName] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [targetRole, setTargetRole] = React.useState('');
  const [color, setColor] = React.useState(PRESET_COLORS[0]);
  const [description, setDescription] = React.useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !displayName.trim()) return;

    const formattedName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const branchId = `branch-${Date.now()}`;

    // Head commit is current head
    const headVersion = versions.find(v => v.branchId === currentBranchId) || versions[0];

    const newBranch: ResumeBranch = {
      id: branchId,
      name: formattedName,
      displayName,
      targetRole: targetRole || displayName,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      headVersionId: headVersion ? headVersion.id : 'v1',
      description: description || `Specialized track targeting ${displayName} roles.`
    };

    onCreateBranch(newBranch);
    setName('');
    setDisplayName('');
    setTargetRole('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#121212] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                INDEX // ARCHITECTURE
              </span>
              <h2 className="font-serif-display text-xl font-bold italic tracking-tight text-[#121212]">
                Track & Specialization Registry
              </h2>
              <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
                Fork specialized career tracks (e.g. Distributed Systems, AI Research, Leadership) from any checkpoint.
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

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Existing Branches List (6 cols) */}
          <div className="md:col-span-6 border-r border-[#121212] overflow-y-auto p-5 space-y-3 bg-[#F4F1EA]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/70 block mb-2 font-sans">
              Configured Tracks ({branches.length})
            </span>

            <div className="space-y-3">
              {branches.map(branch => {
                const isCurrent = branch.id === currentBranchId;
                const commitCount = versions.filter(v => v.branchId === branch.id).length;

                return (
                  <div
                    key={branch.id}
                    className={`p-4 border transition-all shadow-[2px_2px_0px_0px_#121212] ${
                      isCurrent
                        ? 'bg-[#FAF8F5] border-[#121212] ring-2 ring-[#121212]'
                        : 'bg-[#FAF8F5] border-[#121212] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 border border-[#121212]" style={{ backgroundColor: branch.color }} />
                        <span className="font-mono text-xs font-bold text-[#121212]">{branch.name}</span>
                      </div>
                      {isCurrent ? (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-[#121212] text-[#F4F1EA] font-mono">
                          Active HEAD
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectBranch(branch.id);
                            onClose();
                          }}
                          className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] hover:underline"
                        >
                          Switch Track
                        </button>
                      )}
                    </div>

                    <p className="font-serif-display font-bold text-sm text-[#121212] italic mb-1">{branch.displayName}</p>
                    <p className="text-[11px] font-editorial-body text-[#121212]/70 line-clamp-2">{branch.description}</p>

                    <div className="flex items-center justify-between text-[10px] text-[#121212]/60 pt-2 mt-2 border-t border-[#121212]/20 font-mono">
                      <span>Target: {branch.targetRole}</span>
                      <span>{commitCount} snapshots</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create Branch Form (6 cols) */}
          <form onSubmit={handleCreate} className="md:col-span-6 p-5 space-y-3.5 overflow-y-auto bg-[#FAF8F5] text-xs font-sans">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block">
              Fork New Track
            </span>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block mb-1">
                Branch Slug
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. ai-platform, staff-infra"
                required
                className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block mb-1">
                Display Title
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. AI / ML Platform Engineer"
                required
                className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Machine Learning Infrastructure Engineer"
                className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block mb-1">
                Track Color Accent
              </label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 border transition-all ${
                      color === c ? 'border-[#121212] ring-2 ring-[#121212]' : 'border-[#121212]/40'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212] block mb-1">
                Description & Strategy
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Focus on distributed training, Ray clusters, and Triton serving..."
                className="w-full bg-[#FAF8F5] border border-[#121212] p-2 text-xs text-[#121212] focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-[0.15em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create & Fork Track</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
