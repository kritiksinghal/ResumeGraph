import React from 'react';
import { X, CheckCircle2, Lock, Sparkles, Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import { MilestoneId, MILESTONE_METADATA, MILESTONE_FEATURES } from '../config/milestone';

interface MilestoneInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMilestone: MilestoneId;
  onSelectMilestone: (milestone: MilestoneId) => void;
}

export const MilestoneInfoModal: React.FC<MilestoneInfoModalProps> = ({
  isOpen,
  onClose,
  currentMilestone,
  onSelectMilestone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF8F5] border-2 border-[#121212] w-full max-w-3xl shadow-[8px_8px_0px_0px_#121212] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Masthead */}
        <div className="border-b border-[#121212] bg-[#F4F1EA] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#121212] text-[#F4F1EA]">
              <Layers className="w-4 h-4 text-[#E5C378]" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block">
                ENGINEERING SCOPE & ROADMAP
              </span>
              <h3 className="font-serif-display text-xl font-bold italic text-[#121212]">
                Demo Milestone Scoping: Showcase 1
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#EAE6DC] border border-[#121212] text-[#121212] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Milestone Selection Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onSelectMilestone('showcase-1')}
              className={`p-4 border-2 text-left transition-all cursor-pointer ${
                currentMilestone === 'showcase-1'
                  ? 'border-[#264634] bg-[#264634]/5 shadow-[3px_3px_0px_0px_#264634]'
                  : 'border-[#121212]/30 bg-[#FAF8F5] hover:border-[#121212]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 bg-[#264634] text-[#FAF8F5]">
                  RECOMMENDED DEMO
                </span>
                {currentMilestone === 'showcase-1' && (
                  <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                )}
              </div>
              <h4 className="font-serif-display text-lg font-bold text-[#121212]">Showcase 1 (Curated)</h4>
              <p className="font-editorial-body text-xs text-[#121212]/75 mt-1">
                Focused scope: Master resume authoring, real-time ATS keywords, canvas ribbon motion, and LaTeX/PDF exports.
              </p>
            </button>

            <button
              onClick={() => onSelectMilestone('full')}
              className={`p-4 border-2 text-left transition-all cursor-pointer ${
                currentMilestone === 'full'
                  ? 'border-[#121212] bg-[#121212]/5 shadow-[3px_3px_0px_0px_#121212]'
                  : 'border-[#121212]/30 bg-[#FAF8F5] hover:border-[#121212]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 bg-[#121212] text-[#F4F1EA]">
                  ALL CAPABILITIES
                </span>
                {currentMilestone === 'full' && (
                  <CheckCircle2 className="w-4 h-4 text-[#121212]" />
                )}
              </div>
              <h4 className="font-serif-display text-lg font-bold text-[#121212]">Full Engine Suite</h4>
              <p className="font-editorial-body text-xs text-[#121212]/75 mt-1">
                Complete version-control engine: DAG branch graphs, 4-level AST diffing, 3-way merge, and tracker.
              </p>
            </button>
          </div>

          {/* Architectural Breakdown Table */}
          <div className="border border-[#121212] bg-[#FAF8F5]">
            <div className="px-4 py-2.5 bg-[#F4F1EA] border-b border-[#121212] flex items-center justify-between">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212]">
                Feature Matrix & Milestone Gating Status
              </span>
              <span className="font-mono text-[10px] text-[#264634] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side React/TS/Vite
              </span>
            </div>

            <div className="divide-y divide-[#121212]/15">
              {Object.values(MILESTONE_FEATURES).map(feat => {
                const isCore = feat.isCoreInShowcase1;
                return (
                  <div key={feat.id} className="p-3.5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-serif-display font-bold text-sm text-[#121212]">
                          {feat.name}
                        </p>
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.2 font-bold ${
                            isCore
                              ? 'bg-[#264634] text-[#FAF8F5]'
                              : 'bg-[#946B12]/20 text-[#946B12] border border-[#946B12]/40'
                          }`}
                        >
                          {isCore ? 'Showcase 1 Core' : feat.tier === 'showcase-2' ? 'Showcase 2 Gate' : 'Showcase 3 Gate'}
                        </span>
                      </div>
                      <p className="font-editorial-body text-xs text-[#121212]/70 mt-0.5">
                        {feat.description}
                      </p>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      {isCore || currentMilestone === 'full' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-[#264634]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-[#946B12]">
                          <Lock className="w-3.5 h-3.5" /> Gated
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#F4F1EA] p-4 border border-[#121212]/30 text-xs font-editorial-body italic text-[#121212]/80">
            <strong>Architecture Guarantee:</strong> No version-control logic has been discarded. All DAG algorithms, 4-level AST diffing models, and merge conflict resolvers remain compiled in the TypeScript codebase and are safely gated behind milestone identifiers.
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#121212] bg-[#F4F1EA] px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs font-mono text-[#121212]/70">
            Active: <strong>{currentMilestone === 'showcase-1' ? 'Showcase 1 (Curated)' : 'Full Suite'}</strong>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#121212] text-[#F4F1EA] hover:bg-[#2A2A2A] font-sans font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#121212] cursor-pointer"
          >
            Apply & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
