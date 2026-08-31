import React from 'react';
import { GitBranch, GitMerge, ArrowRightLeft, Lock, Sparkles, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { MilestoneFeature } from '../config/milestone';

interface MilestoneGateCardProps {
  feature: MilestoneFeature;
  onUnlockMilestone: () => void;
  onNavigateToCore: () => void;
}

export const MilestoneGateCard: React.FC<MilestoneGateCardProps> = ({
  feature,
  onUnlockMilestone,
  onNavigateToCore,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#F4F1EA]">
      <div className="max-w-2xl w-full bg-[#FAF8F5] border-2 border-[#121212] p-8 md:p-10 shadow-[6px_6px_0px_0px_#121212] relative overflow-hidden">
        {/* Editorial Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#264634]" />

        {/* Top Tag & Milestone Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 bg-[#121212] text-[#F4F1EA] tracking-wider">
              ROADMAP GATE
            </span>
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#946B12] flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Target: {feature.tier === 'showcase-2' ? 'Showcase 2 (Branching & Diff)' : 'Showcase 3 (Semantic Merge)'}
            </span>
          </div>

          <span className="text-[11px] font-mono text-[#121212]/60">
            Active Milestone: <strong className="text-[#121212]">Showcase 1</strong>
          </span>
        </div>

        {/* Heading */}
        <h3 className="font-serif-display text-3xl font-bold italic text-[#121212] mb-3 leading-tight">
          {feature.name}
        </h3>

        <p className="font-editorial-body text-base text-[#121212]/80 mb-6 leading-relaxed">
          {feature.description}
        </p>

        {/* Architecture Note Box */}
        <div className="bg-[#F4F1EA] border border-[#121212]/30 p-4 mb-6">
          <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#264634] mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#264634]" />
            Architecture Preserved in Codebase
          </h4>
          <p className="text-xs font-sans text-[#121212]/80 leading-normal">
            This capability (DAG graph visualization, deterministic AST diffing, 3-way semantic merge) is fully implemented in the React/TypeScript codebase and gated for the <strong>Showcase 1 demo scope</strong>. You can preview or unlock the full engine at any time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onUnlockMilestone}
            className="w-full sm:w-auto px-6 py-3 bg-[#264634] hover:bg-[#1b3225] text-[#FAF8F5] border border-[#121212] font-sans font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#121212] transition-all hover:shadow-[4px_4px_0px_0px_#121212] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#E5C378]" />
            <span>Unlock Full Suite (Preview Feature)</span>
          </button>

          <button
            onClick={onNavigateToCore}
            className="w-full sm:w-auto px-5 py-3 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] border border-[#121212] font-sans font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Return to Showcase 1 Editor</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
