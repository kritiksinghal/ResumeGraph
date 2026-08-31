import React from 'react';
import {
  ArrowRightLeft,
  Plus,
  Minus,
  Layers,
  Columns,
  Brain,
  Tag
} from 'lucide-react';
import { ResumeVersion, SemanticDiffResult } from '../types/resume';
import { computeSemanticDiff } from '../utils/diffEngine';

interface SemanticDiffViewerProps {
  versions: ResumeVersion[];
  currentVersion: ResumeVersion;
}

export const SemanticDiffViewer: React.FC<SemanticDiffViewerProps> = ({
  versions,
  currentVersion
}) => {
  const [fromVersionId, setFromVersionId] = React.useState<string>(
    versions.length > 1 ? versions[0].id : currentVersion.id
  );
  const [toVersionId, setToVersionId] = React.useState<string>(currentVersion.id);
  const [activeLevel, setActiveLevel] = React.useState<'all' | 'level1' | 'level2' | 'level3' | 'level4'>('all');

  const fromVersion = versions.find(v => v.id === fromVersionId) || versions[0];
  const toVersion = versions.find(v => v.id === toVersionId) || currentVersion;

  const diffResult: SemanticDiffResult = React.useMemo(() => {
    if (!fromVersion || !toVersion) {
      return computeSemanticDiff(currentVersion.resumeData, currentVersion.resumeData);
    }
    return computeSemanticDiff(
      fromVersion.resumeData,
      toVersion.resumeData,
      fromVersion.branchId,
      toVersion.branchId
    );
  }, [fromVersion, toVersion, currentVersion]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F1EA]">
      {/* Diff Controls Header */}
      <div className="bg-[#F4F1EA] border-b border-[#121212] p-4 md:p-6 space-y-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                ANALYSIS // 4-LEVEL DELTA
              </span>
              <h2 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                Hierarchical Semantic Diff Engine
              </h2>
              <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
                Identify structured component modifications rather than raw character shifts.
              </p>
            </div>
          </div>

          {/* Semantic Shift Score Badge */}
          <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-2 border border-[#121212] shadow-[3px_3px_0px_0px_#121212]">
            <div className="text-right">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#121212]/60 block">
                Semantic Delta
              </span>
              <span className="text-sm font-mono font-bold text-[#121212]">
                {diffResult.stats.semanticShiftScore} / 100
              </span>
            </div>
            <div className="w-14 h-2.5 bg-[#EAE6DC] border border-[#121212] overflow-hidden">
              <div
                className="h-full bg-[#121212]"
                style={{ width: `${diffResult.stats.semanticShiftScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Version Pickers Bar */}
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#121212]/30 text-xs">
          <div className="flex items-center gap-2 flex-wrap font-sans font-medium text-[#121212]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/70">Compare Base:</span>
            <select
              value={fromVersionId}
              onChange={e => setFromVersionId(e.target.value)}
              className="bg-[#FAF8F5] border border-[#121212] px-2.5 py-1 text-[#121212] font-mono text-xs shadow-[2px_2px_0px_0px_#121212] focus:outline-none"
            >
              {versions.map(v => (
                <option key={v.id} value={v.id}>
                  {v.id} — {v.commitMessage.slice(0, 30)} ({v.branchId})
                </option>
              ))}
            </select>

            <span className="text-[#121212] font-bold px-1">→</span>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/70">Target Revision:</span>
            <select
              value={toVersionId}
              onChange={e => setToVersionId(e.target.value)}
              className="bg-[#FAF8F5] border border-[#121212] px-2.5 py-1 text-[#121212] font-mono text-xs shadow-[2px_2px_0px_0px_#121212] focus:outline-none"
            >
              {versions.map(v => (
                <option key={v.id} value={v.id}>
                  {v.id} — {v.commitMessage.slice(0, 30)} ({v.branchId})
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center bg-[#FAF8F5] p-0.5 border border-[#121212] shadow-[2px_2px_0px_0px_#121212]">
            <button
              onClick={() => setActiveLevel('all')}
              className={`px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.1em] transition-all ${
                activeLevel === 'all'
                  ? 'bg-[#121212] text-[#F4F1EA]'
                  : 'text-[#121212]/60 hover:text-[#121212]'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setActiveLevel('level1')}
              className={`px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.1em] transition-all ${
                activeLevel === 'level1'
                  ? 'bg-[#121212] text-[#F4F1EA]'
                  : 'text-[#121212]/60 hover:text-[#121212]'
              }`}
            >
              L1: Sections
            </button>
            <button
              onClick={() => setActiveLevel('level2')}
              className={`px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.1em] transition-all ${
                activeLevel === 'level2'
                  ? 'bg-[#121212] text-[#F4F1EA]'
                  : 'text-[#121212]/60 hover:text-[#121212]'
              }`}
            >
              L2: Entities
            </button>
            <button
              onClick={() => setActiveLevel('level3')}
              className={`px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.1em] transition-all ${
                activeLevel === 'level3'
                  ? 'bg-[#121212] text-[#F4F1EA]'
                  : 'text-[#121212]/60 hover:text-[#121212]'
              }`}
            >
              L3: Attributes
            </button>
            <button
              onClick={() => setActiveLevel('level4')}
              className={`px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.1em] transition-all ${
                activeLevel === 'level4'
                  ? 'bg-[#121212] text-[#F4F1EA]'
                  : 'text-[#121212]/60 hover:text-[#121212]'
              }`}
            >
              L4: Intent
            </button>
          </div>
        </div>
      </div>

      {/* Main Diff Content Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
        {/* Level 4: Semantic Meaning & Strategic Intent */}
        {(activeLevel === 'all' || activeLevel === 'level4') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
              <Brain className="w-4 h-4" />
              <span>Level 4 — Semantic Positioning & Strategic Trajectory</span>
            </div>

            {diffResult.level4_semanticMeaning.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diffResult.level4_semanticMeaning.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-[#121212]/20 pb-2">
                      <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 bg-[#121212] text-[#F4F1EA]">
                        {item.sectionKey}
                      </span>
                      <span className="text-[10px] text-[#264634] font-mono font-bold uppercase tracking-wider">
                        {item.confidence} Reliability
                      </span>
                    </div>

                    <p className="font-serif-display text-base font-bold italic text-[#121212] leading-snug">
                      "{item.interpretation}"
                    </p>

                    <div className="text-xs text-[#121212] bg-[#F4F1EA] p-3 border border-[#121212]/30 space-y-1 font-sans">
                      <div className="font-bold flex items-center gap-1">
                        <span>Recruiter Impact:</span> <span className="font-normal">{item.impact}</span>
                      </div>
                      <div className="text-[#121212]/70 italic font-editorial-body">{item.reasoning}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF8F5] border border-[#121212] p-4 text-xs text-[#121212]/60 italic font-editorial-body">
                No high-level narrative shifts detected between these revisions.
              </div>
            )}
          </div>
        )}

        {/* Level 1: Sections Overview */}
        {(activeLevel === 'all' || activeLevel === 'level1') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
              <Layers className="w-4 h-4" />
              <span>Level 1 — Section-Level Architecture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {diffResult.level1_sections.map(sec => {
                const isMod = sec.status === 'modified';
                const isAdd = sec.status === 'added';
                const isRem = sec.status === 'removed';

                return (
                  <div
                    key={sec.sectionKey}
                    className="bg-[#FAF8F5] border border-[#121212] p-4 shadow-[2px_2px_0px_0px_#121212] space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-[#121212]/20 pb-1.5">
                      <span className="font-bold text-xs text-[#121212] font-sans">{sec.sectionName}</span>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 border ${
                          isMod
                            ? 'bg-[#B8860B]/10 text-[#946B12] border-[#B8860B]'
                            : isAdd
                            ? 'bg-[#264634]/10 text-[#264634] border-[#264634]'
                            : isRem
                            ? 'bg-[#8B261D]/10 text-[#8B261D] border-[#8B261D]'
                            : 'bg-[#EAE6DC] text-[#121212]/60 border-[#121212]/30'
                        }`}
                      >
                        {sec.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#121212]/80 leading-snug font-editorial-body italic">{sec.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Level 2: Entity Level Changes */}
        {(activeLevel === 'all' || activeLevel === 'level2') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
              <Tag className="w-4 h-4" />
              <span>Level 2 — Entity-Level Insertions & Prunings</span>
            </div>

            {diffResult.level2_entities.length > 0 ? (
              <div className="space-y-2">
                {diffResult.level2_entities.map((entity, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF8F5] border border-[#121212] p-3.5 shadow-[2px_2px_0px_0px_#121212] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#121212] text-[#F4F1EA] font-semibold">
                        {entity.entityId}
                      </span>
                      <div>
                        <p className="font-serif-display font-bold text-sm text-[#121212] italic">{entity.title}</p>
                        <p className="text-[11px] text-[#121212]/70 font-sans">{entity.description}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border ${
                        entity.status === 'added'
                          ? 'bg-[#264634]/10 text-[#264634] border-[#264634]'
                          : entity.status === 'removed'
                          ? 'bg-[#8B261D]/10 text-[#8B261D] border-[#8B261D]'
                          : 'bg-[#B8860B]/10 text-[#946B12] border-[#B8860B]'
                      }`}
                    >
                      {entity.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#121212]/60 italic font-editorial-body">No entity-level additions or deletions found.</p>
            )}
          </div>
        )}

        {/* Level 3: Attribute & Bullet Detailed Diffs */}
        {(activeLevel === 'all' || activeLevel === 'level3') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
                <Columns className="w-4 h-4" />
                <span>Level 3 — Attribute & Bullet-Point Granular Delta</span>
              </div>
            </div>

            {diffResult.level3_attributes.length > 0 ? (
              <div className="space-y-3">
                {diffResult.level3_attributes.map((attr, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] border border-[#121212] shadow-[3px_3px_0px_0px_#121212] overflow-hidden text-xs">
                    <div className="bg-[#F4F1EA] px-4 py-2 border-b border-[#121212] flex items-center justify-between">
                      <span className="font-bold text-[#121212] font-sans">
                        {attr.entityTitle} <span className="text-[#121212]/60 font-normal font-editorial-body italic">({attr.attributeName})</span>
                      </span>
                      <span className="text-[9px] font-mono text-[#121212] font-bold uppercase">{attr.sectionKey}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#121212]">
                      {/* Old State */}
                      <div className="p-3.5 bg-[#8B261D]/5 space-y-1.5">
                        <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-[#8B261D] font-bold">
                          <Minus className="w-3 h-3" />
                          <span>{fromVersion.id} ({fromVersion.branchId})</span>
                        </div>
                        <p className="text-xs text-[#121212] font-sans bg-[#FAF8F5] p-2.5 border border-[#8B261D]/30 leading-relaxed">
                          {attr.oldValue}
                        </p>
                      </div>

                      {/* New State */}
                      <div className="p-3.5 bg-[#264634]/5 space-y-1.5">
                        <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-[#264634] font-bold">
                          <Plus className="w-3 h-3" />
                          <span>{toVersion.id} ({toVersion.branchId})</span>
                        </div>
                        <p className="text-xs text-[#121212] font-sans bg-[#FAF8F5] p-2.5 border border-[#264634]/30 leading-relaxed">
                          {attr.newValue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#121212]/60 italic font-editorial-body">No granular attribute differences found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
