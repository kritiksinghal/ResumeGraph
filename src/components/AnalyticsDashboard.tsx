import React from 'react';
import {
  BarChart3,
  GitBranch,
  Layers,
  Zap
} from 'lucide-react';
import { ResumeVersion, ResumeBranch, JobApplication } from '../types/resume';

interface AnalyticsDashboardProps {
  versions: ResumeVersion[];
  branches: ResumeBranch[];
  applications: JobApplication[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  versions,
  branches,
  applications
}) => {
  const totalApps = applications.length;
  const interviews = applications.filter(
    a => a.status === 'interview' || a.status === 'offer'
  ).length;
  const offers = applications.filter(a => a.status === 'offer').length;

  const interviewRate = totalApps > 0 ? Math.round((interviews / totalApps) * 100) : 0;
  const offerRate = totalApps > 0 ? Math.round((offers / totalApps) * 100) : 0;

  // Compute branch breakdown
  const branchStats = branches.map(b => {
    const branchApps = applications.filter(a => a.branchId === b.id);
    const branchInterviews = branchApps.filter(
      a => a.status === 'interview' || a.status === 'offer'
    ).length;
    const rate = branchApps.length > 0 ? Math.round((branchInterviews / branchApps.length) * 100) : 0;
    return {
      name: b.name,
      displayName: b.displayName,
      color: b.color,
      apps: branchApps.length,
      interviews: branchInterviews,
      rate
    };
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F4F1EA] space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-[#121212] pb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
                DISPATCH // AUDIT
              </span>
              <h2 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                Resume Evolution & Empirical Conversion Ledger
              </h2>
              <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
                Empirical metrics evaluating version control velocity, semantic edits, and role branch interview rates.
              </p>
            </div>
          </div>

          <div className="font-mono text-xs text-[#121212] border border-[#121212] px-3 py-1 bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#121212]">
            Total Entries: {totalApps} Records
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F5] border border-[#121212] p-5 space-y-1 shadow-[3px_3px_0px_0px_#121212]">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/60 block">
              Interview Conversion
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif-display text-3xl font-bold italic text-[#121212]">{interviewRate}%</span>
              <span className="text-xs text-[#264634] font-mono font-bold">+{interviews} calls</span>
            </div>
            <p className="text-[11px] font-sans text-[#121212]/70">Across {totalApps} logged applications</p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#121212] p-5 space-y-1 shadow-[3px_3px_0px_0px_#121212]">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/60 block">
              Snapshot Velocity
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif-display text-3xl font-bold italic text-[#121212]">{versions.length}</span>
              <span className="text-xs text-[#121212]/80 font-mono font-bold">Revisions</span>
            </div>
            <p className="text-[11px] font-sans text-[#121212]/70">Immutable document checkpoints</p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#121212] p-5 space-y-1 shadow-[3px_3px_0px_0px_#121212]">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/60 block">
              Specialized Tracks
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif-display text-3xl font-bold italic text-[#121212]">{branches.length}</span>
              <span className="text-xs text-[#121212]/80 font-mono font-bold">Branches</span>
            </div>
            <p className="text-[11px] font-sans text-[#121212]/70">Targeting distinct archetypes</p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#121212] p-5 space-y-1 shadow-[3px_3px_0px_0px_#121212]">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#121212]/60 block">
              Offer Conversion
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-serif-display text-3xl font-bold italic text-[#121212]">{offerRate}%</span>
              <span className="text-xs text-[#264634] font-mono font-bold">{offers} offers</span>
            </div>
            <p className="text-[11px] font-sans text-[#121212]/70">From initial outreach</p>
          </div>
        </div>

        {/* Middle Section: Branch Performance Comparison & Section Mod Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Branch Performance (7 cols) */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#121212] p-6 space-y-4 shadow-[3px_3px_0px_0px_#121212]">
            <div className="flex items-center justify-between border-b border-[#121212]/20 pb-3">
              <h3 className="text-sm font-bold font-sans uppercase tracking-[0.15em] text-[#121212] flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span>Conversion Rate by Resume Track</span>
              </h3>
              <span className="text-[10px] font-mono text-[#121212]/60">Empirical Conversion</span>
            </div>

            <div className="space-y-4 pt-1">
              {branchStats.map(stat => (
                <div key={stat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 border border-[#121212]" style={{ backgroundColor: stat.color }} />
                      <span className="font-mono font-bold text-[#121212]">{stat.name}</span>
                      <span className="text-[#121212]/70 text-[11px] font-editorial-body italic">({stat.displayName})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#121212]/60 text-[11px]">{stat.apps} applications</span>
                      <span className="font-mono font-bold text-[#121212]">{stat.rate}%</span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-[#EAE6DC] border border-[#121212] overflow-hidden">
                    <div
                      className="h-full bg-[#121212] transition-all duration-500"
                      style={{ width: `${Math.max(4, stat.rate)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Edit Distribution (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#121212] p-6 space-y-4 shadow-[3px_3px_0px_0px_#121212]">
            <div className="border-b border-[#121212]/20 pb-3">
              <h3 className="text-sm font-bold font-sans uppercase tracking-[0.15em] text-[#121212] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Modification Frequency by Section</span>
              </h3>
            </div>

            <div className="space-y-3.5 text-xs pt-1 font-sans">
              {[
                { name: 'Work Experience Bullets', percentage: 42 },
                { name: 'Technical Projects & Metrics', percentage: 28 },
                { name: 'Executive Summary Statement', percentage: 18 },
                { name: 'Skills & Competencies', percentage: 12 }
              ].map(sec => (
                <div key={sec.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#121212]">{sec.name}</span>
                    <span className="font-mono font-bold text-[#121212]">{sec.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EAE6DC] border border-[#121212] overflow-hidden">
                    <div className="h-full bg-[#121212]" style={{ width: `${sec.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Keyword Density & Skill Evolution Radar */}
        <div className="bg-[#FAF8F5] border border-[#121212] p-6 space-y-4 shadow-[3px_3px_0px_0px_#121212]">
          <div className="flex items-center justify-between border-b border-[#121212]/20 pb-3">
            <h3 className="text-sm font-bold font-sans uppercase tracking-[0.15em] text-[#121212] flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Skill & Competency Keyword Frequency Growth</span>
            </h3>
            <span className="text-[10px] font-mono text-[#121212]/60">Across All Snapshots</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
            {[
              { skill: 'Go / Golang', count: 14, change: '+6' },
              { skill: 'Distributed Systems', count: 12, change: '+5' },
              { skill: 'Raft / Consensus', count: 8, change: '+4' },
              { skill: 'PyTorch / CUDA', count: 9, change: '+7' },
              { skill: 'Kubernetes', count: 11, change: '+3' },
              { skill: 'TypeScript / React', count: 15, change: '+2' }
            ].map(item => (
              <div key={item.skill} className="bg-[#F4F1EA] p-3.5 border border-[#121212] space-y-1 shadow-[2px_2px_0px_0px_#121212]">
                <span className="text-[10px] font-mono text-[#121212]/70 font-semibold block truncate">{item.skill}</span>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xl font-bold font-serif-display italic text-[#121212]">{item.count}</span>
                  <span className="text-[10px] font-mono text-[#264634] font-bold">{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
