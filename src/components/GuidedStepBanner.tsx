import React from 'react';
import {
  Sparkles,
  GitCommit,
  GitBranch,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  HelpCircle,
  Play,
  ArrowRight
} from 'lucide-react';

interface GuidedStepBannerProps {
  currentStep: number;
  onSelectStep: (stepIndex: number) => void;
  onOpenJdOptimizer: () => void;
  onOpenCommitModal: () => void;
  onOpenBranchManager: () => void;
  onOpenPreview: () => void;
  onOpenEditor: () => void;
  onReopenTour: () => void;
  hasUncommittedChanges: boolean;
  branchCount: number;
  versionCount: number;
}

export const GuidedStepBanner: React.FC<GuidedStepBannerProps> = ({
  currentStep,
  onSelectStep,
  onOpenJdOptimizer,
  onOpenCommitModal,
  onOpenBranchManager,
  onOpenPreview,
  onOpenEditor,
  onReopenTour,
  hasUncommittedChanges,
  branchCount,
  versionCount
}) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) {
    return (
      <div className="bg-[#FAF8F5] border-b border-[#121212]/30 px-4 py-1.5 flex items-center justify-between text-xs font-sans">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-[#121212] hover:underline font-bold flex items-center gap-1.5 text-[11px]"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Show Guided Step-by-Step Workflow</span>
        </button>
        <button
          onClick={onReopenTour}
          className="text-[#121212]/70 hover:text-[#121212] flex items-center gap-1 text-[11px]"
        >
          <Play className="w-3 h-3" />
          <span>Re-open Intro Guide</span>
        </button>
      </div>
    );
  }

  const steps = [
    {
      number: 1,
      title: 'Draft & Edit Content',
      desc: 'Fill in your profile, experience bullets, and skills.',
      actionLabel: 'Go to Editor',
      action: onOpenEditor,
      isCompleted: true
    },
    {
      number: 2,
      title: 'AI Job Description Match',
      desc: 'Check keyword gaps against target job descriptions.',
      actionLabel: 'Match Target Role',
      action: onOpenJdOptimizer,
      isCompleted: false
    },
    {
      number: 3,
      title: 'Commit Snapshot',
      desc: hasUncommittedChanges
        ? 'You have uncommitted modifications ready to save.'
        : `${versionCount} versions saved in history.`,
      actionLabel: hasUncommittedChanges ? 'Commit Changes *' : 'Create Snapshot',
      action: onOpenCommitModal,
      isCompleted: versionCount > 1
    },
    {
      number: 4,
      title: 'Branch for Role Specialization',
      desc: `${branchCount} track(s) active. Fork tracks for specific roles.`,
      actionLabel: 'Manage Tracks',
      action: onOpenBranchManager,
      isCompleted: branchCount > 1
    },
    {
      number: 5,
      title: 'Preview & Export PDF',
      desc: 'Inspect clean formatting and export print-ready document.',
      actionLabel: 'Open Preview',
      action: onOpenPreview,
      isCompleted: false
    }
  ];

  return (
    <div className="bg-[#FAF8F5] border-b border-[#121212] transition-all">
      {/* Header Bar of Step Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#264634] rounded-full animate-pulse" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212]">
              Workflow Navigator
            </span>
          </div>
          <span className="text-[#121212]/40 hidden sm:inline">|</span>
          <p className="text-xs font-editorial-body italic text-[#121212]/80 hidden md:inline">
            Follow this 5-step path to iteratively polish, align, and branch your resume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReopenTour}
            className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] hover:underline flex items-center gap-1 px-2 py-0.5"
            title="Open Intro Onboarding Presentation"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Intro Guide</span>
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-[#121212] hover:bg-[#EAE6DC] border border-[#121212]/30"
            title={isMinimized ? 'Expand guide' : 'Minimize guide'}
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-[#121212]/60 hover:text-[#121212]"
            title="Dismiss guide banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Step Cards */}
      {!isMinimized && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
            {steps.map((s, idx) => {
              const isCurrent = currentStep === idx;

              return (
                <div
                  key={s.number}
                  className={`p-2.5 border transition-all flex flex-col justify-between shadow-[2px_2px_0px_0px_#121212] ${
                    isCurrent
                      ? 'bg-[#121212] text-[#F4F1EA] border-[#121212]'
                      : 'bg-[#F4F1EA] border-[#121212] text-[#121212] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[9px] font-mono font-bold px-1 py-0.2 border ${
                          isCurrent
                            ? 'bg-[#F4F1EA] text-[#121212] border-[#F4F1EA]'
                            : 'bg-[#FAF8F5] text-[#121212] border-[#121212]/40'
                        }`}
                      >
                        STEP {s.number}
                      </span>
                      {s.isCompleted && (
                        <span className="flex items-center gap-0.5 text-[9px] font-sans font-bold text-[#264634]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif-display font-bold text-xs italic line-clamp-1 mb-0.5">
                      {s.title}
                    </h4>
                    <p
                      className={`text-[10px] font-sans line-clamp-2 ${
                        isCurrent ? 'text-[#F4F1EA]/80' : 'text-[#121212]/70'
                      }`}
                    >
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-2 mt-1 border-t border-current/10">
                    <button
                      onClick={() => {
                        onSelectStep(idx);
                        s.action();
                      }}
                      className={`w-full py-1 px-1.5 text-[9px] font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1 border transition-all ${
                        isCurrent
                          ? 'bg-[#F4F1EA] text-[#121212] border-[#F4F1EA] hover:bg-white'
                          : 'bg-[#121212] text-[#F4F1EA] border-[#121212] hover:bg-[#2A2A2A]'
                      }`}
                    >
                      <span>{s.actionLabel}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
