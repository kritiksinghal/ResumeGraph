import React from 'react';
import {
  GitBranch,
  GitCommit,
  GitMerge,
  FileCode,
  Sparkles,
  BarChart3,
  Briefcase,
  BookOpen,
  Plus,
  ArrowRightLeft,
  ChevronDown,
  User,
  RotateCcw,
  Home,
  Sliders,
  Layers,
  Lock
} from 'lucide-react';
import { ResumeBranch, ResumeVersion } from '../types/resume';
import { MilestoneId } from '../config/milestone';

interface HeaderProps {
  userName?: string;
  candidateTitle?: string;
  branches: ResumeBranch[];
  currentBranch: ResumeBranch;
  currentVersion: ResumeVersion;
  onSelectBranch: (branchId: string) => void;
  onOpenCommitModal: () => void;
  onOpenVersionTree: () => void;
  onOpenDiffModal: () => void;
  onOpenMergeModal: () => void;
  onOpenJdModal: () => void;
  onOpenBranchManager: () => void;
  onOpenAnalytics: () => void;
  onOpenTracker: () => void;
  onOpenResearch: () => void;
  onOpenOnboarding: () => void;
  onOpenOnboardingWizard: () => void;
  onNavigateLanding: () => void;
  onResetToSample: () => void;
  activeView: 'editor' | 'preview' | 'diff' | 'tracker' | 'analytics';
  setActiveView: (view: 'editor' | 'preview' | 'diff' | 'tracker' | 'analytics') => void;
  hasUncommittedChanges: boolean;
  milestone: MilestoneId;
  onOpenMilestoneModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Candidate',
  candidateTitle = 'Software Engineer',
  branches,
  currentBranch,
  currentVersion,
  onSelectBranch,
  onOpenCommitModal,
  onOpenVersionTree,
  onOpenDiffModal,
  onOpenMergeModal,
  onOpenJdModal,
  onOpenBranchManager,
  onOpenAnalytics,
  onOpenTracker,
  onOpenResearch,
  onOpenOnboarding,
  onOpenOnboardingWizard,
  onNavigateLanding,
  onResetToSample,
  activeView,
  setActiveView,
  hasUncommittedChanges,
  milestone,
  onOpenMilestoneModal
}) => {
  const [branchDropdownOpen, setBranchDropdownOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  return (
    <header className="border-b border-[#121212] bg-[#F4F1EA] sticky top-0 z-40 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#121212]/60">
                ARCHIVE · VOL. VIII
              </span>
              <button
                onClick={onOpenMilestoneModal}
                className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-[#264634] text-[#FAF8F5] font-semibold tracking-wider hover:bg-[#1b3225] transition-colors flex items-center gap-1 cursor-pointer"
                title="View Active Milestone Scope (Showcase 1)"
              >
                <Layers className="w-2.5 h-2.5 text-[#E5C378]" />
                <span>{milestone === 'showcase-1' ? 'Showcase 1' : 'Full Engine'}</span>
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <button
                onClick={onNavigateLanding}
                className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212] hover:opacity-80 transition-opacity text-left cursor-pointer"
                title="Return to Landing Page"
              >
                ResumeFlow
              </button>
              <span className="text-[11px] font-sans text-[#121212]/70 hidden sm:inline italic">
                / {userName}
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[#121212]/20 hidden md:block" />

          {/* User Profile & Workspace Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#121212] bg-[#FAF8F5] hover:bg-[#EAE6DC] border border-[#121212] px-2.5 py-1.5 transition-all shadow-[2px_2px_0px_0px_#121212] cursor-pointer"
              title="Profile & Workspace Settings"
            >
              <User className="w-3 h-3 text-[#264634]" />
              <span className="max-w-[100px] truncate">{userName}</span>
              <ChevronDown className="w-2.5 h-2.5 text-[#121212]/60" />
            </button>

            {profileMenuOpen && (
              <div
                className="absolute left-0 mt-1.5 w-64 bg-[#FAF8F5] border border-[#121212] shadow-[4px_4px_0px_0px_#121212] z-50 py-1.5 animate-fadeIn"
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#121212]/10 bg-[#F4F1EA]">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#121212]/60 block">
                    ACTIVE CANDIDATE
                  </span>
                  <p className="font-serif-display font-bold italic text-sm text-[#121212]">{userName}</p>
                  <p className="font-editorial-body text-xs text-[#121212]/70 italic">{candidateTitle}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenMilestoneModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#EAE6DC] flex items-center gap-2 text-[#264634] font-bold"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#264634]" />
                    <span>Demo Milestone Scope (Showcase 1)</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenOnboardingWizard();
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#EAE6DC] flex items-center gap-2 text-[#121212]"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#946B12]" />
                    <span>Edit Personal Setup / Wizard</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onResetToSample();
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#EAE6DC] flex items-center gap-2 text-[#121212]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#264634]" />
                    <span>Load Staff Systems Sample</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onNavigateLanding();
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#EAE6DC] flex items-center gap-2 text-[#121212]"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Landing & Intro Chronicle</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Guide Trigger */}
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#121212] bg-[#FAF8F5] hover:bg-[#121212] hover:text-[#F4F1EA] border border-[#121212] px-2.5 py-1.5 transition-all shadow-[2px_2px_0px_0px_#121212] cursor-pointer"
            title="Open Intro Onboarding & Architecture Tour"
          >
            <Sparkles className="w-3 h-3 text-[#946B12]" />
            <span>Guide</span>
          </button>

          {/* Research Spec Trigger */}
          <button
            onClick={onOpenResearch}
            className="hidden lg:flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#121212]/80 bg-[#FAF8F5] hover:bg-[#121212] hover:text-[#F4F1EA] border border-[#121212]/40 px-2.5 py-1.5 transition-all shadow-[2px_2px_0px_0px_#121212]"
            title="View Undergraduate Research Specification (RQ1-RQ5)"
          >
            <BookOpen className="w-3 h-3" />
            <span>Research</span>
          </button>
        </div>

        {/* Branch & Version Controls */}
        <div className="flex items-center gap-2">
          {/* Branch Dropdown */}
          <div className="relative">
            <button
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] hover:bg-[#EAE6DC] text-xs font-mono text-[#121212] transition-all shadow-[2px_2px_0px_0px_#121212]"
              title="Switch or manage active resume branch"
            >
              <span
                className="w-2.5 h-2.5 border border-[#121212]"
                style={{ backgroundColor: currentBranch.color || '#121212' }}
              />
              <GitBranch className="w-3.5 h-3.5 text-[#121212]" />
              <span className="font-mono font-bold text-[#121212]">{currentBranch.name}</span>
              <span className="text-[#121212]/60 text-[10px] font-sans hidden lg:inline uppercase tracking-wider">
                ({currentBranch.displayName})
              </span>
              <ChevronDown className="w-3 h-3 text-[#121212]/70 ml-0.5" />
            </button>

            {branchDropdownOpen && (
              <div
                className="absolute left-0 mt-1.5 w-72 bg-[#FAF8F5] border border-[#121212] shadow-[4px_4px_0px_0px_#121212] z-50 py-1.5 animate-fadeIn"
                onMouseLeave={() => setBranchDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212] border-b border-[#121212] flex justify-between items-center bg-[#F4F1EA]">
                  <span>Role Branches</span>
                  <button
                    onClick={() => {
                      setBranchDropdownOpen(false);
                      onOpenBranchManager();
                    }}
                    className="text-[#121212] hover:underline flex items-center gap-1 font-sans text-[10px] font-bold"
                  >
                    <Plus className="w-3 h-3" /> New Track
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {branches.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBranch(b.id);
                        setBranchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#EAE6DC] transition-colors text-xs ${
                        b.id === currentBranch.id ? 'bg-[#121212] text-[#F4F1EA]' : 'text-[#121212]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 border border-[#121212]"
                          style={{ backgroundColor: b.color }}
                        />
                        <div>
                          <p className="font-mono font-bold text-xs">{b.name}</p>
                          <p
                            className={`text-[10px] font-sans ${
                              b.id === currentBranch.id ? 'text-[#F4F1EA]/70' : 'text-[#121212]/60'
                            }`}
                          >
                            {b.displayName}
                          </p>
                        </div>
                      </div>
                      {b.id === currentBranch.id && (
                        <span className="text-[9px] font-mono border border-[#F4F1EA] px-1 py-0.2 tracking-wider">
                          HEAD
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Version / Graph Trigger */}
          <button
            onClick={onOpenVersionTree}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F5] border border-[#121212] hover:bg-[#EAE6DC] text-xs font-mono text-[#121212] transition-all shadow-[2px_2px_0px_0px_#121212]"
            title="View complete version control graph history"
          >
            <GitCommit className="w-3.5 h-3.5 text-[#121212]" />
            <span className="font-bold">{currentVersion.id}</span>
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#121212]/60 hidden md:inline">
              Tree
            </span>
          </button>

          {/* Uncommitted Changes / Commit Button */}
          <button
            onClick={onOpenCommitModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-[0.1em] border border-[#121212] transition-all shadow-[2px_2px_0px_0px_#121212] ${
              hasUncommittedChanges
                ? 'bg-[#121212] text-[#F4F1EA] hover:bg-[#2A2A2A] ring-1 ring-[#121212]'
                : 'bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212]'
            }`}
            title="Snapshot / Commit current changes to history"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>{hasUncommittedChanges ? 'Commit *' : 'Snapshot'}</span>
          </button>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center bg-[#FAF8F5] border border-[#121212] p-0.5 shadow-[2px_2px_0px_0px_#121212]">
          <button
            onClick={() => setActiveView('editor')}
            className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 ${
              activeView === 'editor'
                ? 'bg-[#121212] text-[#F4F1EA]'
                : 'text-[#121212]/60 hover:text-[#121212] hover:bg-[#EAE6DC]'
            }`}
          >
            <FileCode className="w-3 h-3" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 ${
              activeView === 'preview'
                ? 'bg-[#121212] text-[#F4F1EA]'
                : 'text-[#121212]/60 hover:text-[#121212] hover:bg-[#EAE6DC]'
            }`}
          >
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveView('diff')}
            className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 ${
              activeView === 'diff'
                ? 'bg-[#121212] text-[#F4F1EA]'
                : 'text-[#121212]/60 hover:text-[#121212] hover:bg-[#EAE6DC]'
            }`}
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Diff</span>
            {milestone === 'showcase-1' && (
              <span className="text-[8px] font-mono uppercase px-1 py-0.2 bg-[#946B12]/15 text-[#946B12] font-semibold border border-[#946B12]/30">
                S2
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveView('tracker')}
            className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 ${
              activeView === 'tracker'
                ? 'bg-[#121212] text-[#F4F1EA]'
                : 'text-[#121212]/60 hover:text-[#121212] hover:bg-[#EAE6DC]'
            }`}
          >
            <Briefcase className="w-3 h-3" />
            <span className="hidden sm:inline">Applications</span>
            {milestone === 'showcase-1' && (
              <span className="text-[8px] font-mono uppercase px-1 py-0.2 bg-[#946B12]/15 text-[#946B12] font-semibold border border-[#946B12]/30">
                S2
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 ${
              activeView === 'analytics'
                ? 'bg-[#121212] text-[#F4F1EA]'
                : 'text-[#121212]/60 hover:text-[#121212] hover:bg-[#EAE6DC]'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span className="hidden sm:inline">Analytics</span>
            {milestone === 'showcase-1' && (
              <span className="text-[8px] font-mono uppercase px-1 py-0.2 bg-[#946B12]/15 text-[#946B12] font-semibold border border-[#946B12]/30">
                S2
              </span>
            )}
          </button>
        </div>

        {/* Action Tools: Merge & JD AI Optimization */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMergeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#121212] hover:text-[#F4F1EA] text-[#121212] border border-[#121212] text-xs font-sans font-bold uppercase tracking-[0.1em] transition-all shadow-[2px_2px_0px_0px_#121212]"
            title="3-Way Semantic Branch Merge & Conflict Resolver"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Merge</span>
            {milestone === 'showcase-1' && (
              <span className="text-[8px] font-mono uppercase px-1 py-0.2 bg-[#946B12]/15 text-[#946B12] font-semibold border border-[#946B12]/30">
                S3
              </span>
            )}
          </button>

          <button
            onClick={onOpenJdModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] text-xs font-sans font-bold uppercase tracking-[0.15em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all"
            title="AI Job Description Parser & Incremental Optimization"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>JD Match & ATS</span>
          </button>
        </div>
      </div>
    </header>
  );
};

