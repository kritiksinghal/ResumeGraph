import React from 'react';
import {
  Sparkles,
  GitBranch,
  GitCommit,
  ArrowRight,
  CheckCircle2,
  FileText,
  Briefcase,
  Layers,
  Zap,
  BookOpen,
  X,
  Play
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'sample' | 'guided' | 'fresh') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectOption
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'WELCOME TO RESUMEFLOW',
      title: 'A Smarter, Git-Powered Way to Manage Your Resume',
      subtitle: 'Never juggle messy files like "resume_final_v3_edit.pdf" again.',
      description:
        'ResumeFlow brings software engineering version control principles to career management. Tailor your resume for different roles without losing your original master achievements.',
      icon: Layers,
      highlight: 'Entity-Anchored Version Control',
      points: [
        'Organize your experience, projects, and skills into structured blocks',
        'Save snapshots (commits) whenever you make meaningful improvements',
        'Track exact visual diffs between any two versions of your resume'
      ]
    },
    {
      badge: 'ROLE-BASED TRACKS',
      title: 'Branch for Every Role You Target',
      subtitle: 'One master background. Multiple specialized presentations.',
      description:
        'Create specialized branches (e.g. Distributed Systems, AI/ML Platform, Engineering Management). Each track maintains tailored bullets and keyword emphasis without breaking other versions.',
      icon: GitBranch,
      highlight: 'Zero-Copy Role Specialization',
      points: [
        'Keep a "Main" branch as your source of truth',
        'Fork specialized tracks in one click for targeted applications',
        'Easily merge new achievements back into your main branch with 3-way smart resolver'
      ]
    },
    {
      badge: 'GROUNDED AI ALIGNMENT',
      title: 'AI Job Description Match — With Zero Hallucinations',
      subtitle: 'Grounded keyword alignment against any job description.',
      description:
        'Paste any job description to instantly analyze skill coverage. Our grounded AI suggests precise, incremental bullet improvements without inventing fake jobs or metrics.',
      icon: Sparkles,
      highlight: 'Provenance-Anchored AI',
      points: [
        'Instant ATS match score and keyword gap analysis',
        'Incremental bullet-level suggestions you can accept with a single click',
        'Transparent semantic keyword highlighting (exact vs semantic matches)'
      ]
    },
    {
      badge: 'LIFECYCLE & ANALYTICS',
      title: 'Track Applications & Measure What Works',
      subtitle: 'Connect every submitted resume version to real interview outcomes.',
      description:
        'Manage your job pipeline with the integrated Kanban tracker. View analytical response rates per resume branch to discover which version opens the most doors.',
      icon: Briefcase,
      highlight: 'Outcome-Driven Iteration',
      points: [
        'Kanban tracker linked directly to specific resume snapshots',
        'Branch-by-branch conversion analytics and interview yield rates',
        'High-contrast PDF export and print-ready typography'
      ]
    }
  ];

  const current = steps[currentStep];
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-[8px_8px_0px_0px_#121212] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                ONBOARDING // GUIDE (STEP {currentStep + 1} OF {steps.length})
              </span>
              <h2 className="font-serif-display text-lg font-bold italic tracking-tight text-[#121212]">
                {current.badge}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#121212] hover:opacity-60 transition-opacity"
            title="Close onboarding guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="px-6 py-2 bg-[#FAF8F5] border-b border-[#121212]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 transition-all ${
                  currentStep === i
                    ? 'w-8 bg-[#121212]'
                    : currentStep > i
                    ? 'w-4 bg-[#264634]'
                    : 'w-4 bg-[#121212]/20'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-[#121212]/60">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#FAF8F5]">
          <div className="space-y-2">
            <h3 className="font-serif-display text-2xl font-bold italic text-[#121212] leading-snug">
              {current.title}
            </h3>
            <p className="text-sm font-sans font-medium text-[#121212]/80">
              {current.subtitle}
            </p>
          </div>

          <p className="font-editorial-body text-sm text-[#121212] leading-relaxed italic border-l-2 border-[#121212] pl-3">
            {current.description}
          </p>

          {/* Feature Points */}
          <div className="bg-[#F4F1EA] border border-[#121212] p-4 space-y-2.5 shadow-[3px_3px_0px_0px_#121212]">
            <div className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/70 mb-1">
              Key Capabilities:
            </div>
            {current.points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#121212] font-sans">
                <CheckCircle2 className="w-4 h-4 text-[#264634] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>

          {/* Quick Choice on final step or bottom */}
          {currentStep === steps.length - 1 && (
            <div className="pt-2 space-y-3">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block">
                Choose How You'd Like to Begin:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onSelectOption('guided');
                    onClose();
                  }}
                  className="p-3 text-left border border-[#121212] bg-[#121212] text-[#F4F1EA] hover:bg-[#2A2A2A] transition-all shadow-[2px_2px_0px_0px_#121212] group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5" /> Guided Walkthrough
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-[11px] text-[#F4F1EA]/80 font-editorial-body italic">
                    Step-by-step interactive assistant on the main workspace.
                  </p>
                </button>

                <button
                  onClick={() => {
                    onSelectOption('sample');
                    onClose();
                  }}
                  className="p-3 text-left border border-[#121212] bg-[#FAF8F5] text-[#121212] hover:bg-[#EAE6DC] transition-all shadow-[2px_2px_0px_0px_#121212] group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Explore Sample Data
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-[11px] text-[#121212]/80 font-editorial-body italic">
                    Pre-loaded with Alex Rivera (Staff Systems Engineer).
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-[#121212] bg-[#F4F1EA] flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStep > 0) setCurrentStep(prev => prev - 1);
            }}
            disabled={currentStep === 0}
            className={`text-xs font-sans font-bold uppercase tracking-wider px-3 py-1.5 border border-[#121212] transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed bg-[#FAF8F5]'
                : 'bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] shadow-[2px_2px_0px_0px_#121212]'
            }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-sans font-bold uppercase tracking-wider px-3 py-1.5 text-[#121212]/70 hover:text-[#121212] transition-colors"
            >
              Skip Tour
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-wider border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer"
              >
                <span>Next Concept</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onSelectOption('sample');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-5 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-wider border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
