import React from 'react';
import {
  Briefcase,
  Plus,
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';
import { JobApplication, ResumeBranch, ResumeVersion, ApplicationStatus } from '../types/resume';

interface ApplicationTrackerProps {
  applications: JobApplication[];
  branches: ResumeBranch[];
  versions: ResumeVersion[];
  onUpdateApplication: (app: JobApplication) => void;
  onAddApplication: (app: JobApplication) => void;
  onDeleteApplication: (appId: string) => void;
  onViewVersion: (versionId: string) => void;
}

const STATUS_COLUMNS: { key: ApplicationStatus; label: string }[] = [
  { key: 'saved', label: '01. Saved Pipeline' },
  { key: 'applied', label: '02. Submitted' },
  { key: 'screening', label: '03. Recruiter Screen' },
  { key: 'interview', label: '04. Technical Loop' },
  { key: 'offer', label: '05. Offer Extended' },
  { key: 'rejected', label: '06. Concluded' }
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  branches,
  versions,
  onUpdateApplication,
  onAddApplication,
  onViewVersion
}) => {
  const [showAddModal, setShowAddModal] = React.useState(false);

  // New Application Form State
  const [company, setCompany] = React.useState('');
  const [role, setRole] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [salary, setSalary] = React.useState('');
  const [branchId, setBranchId] = React.useState(branches[0]?.id || 'main');
  const [versionId, setVersionId] = React.useState(versions[versions.length - 1]?.id || 'v1');
  const [matchScore] = React.useState(88);
  const [notes, setNotes] = React.useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      location: location || 'Remote',
      salaryRange: salary || '$160,000 - $195,000',
      branchId,
      versionId,
      atsMatchScore: matchScore,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          status: 'applied',
          note: 'Application submitted with linked resume snapshot.'
        }
      ],
      notes: notes || 'Tailored bullet points to target infrastructure requirements.'
    };

    onAddApplication(newApp);
    setCompany('');
    setRole('');
    setLocation('');
    setSalary('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleStatusChange = (app: JobApplication, nextStatus: ApplicationStatus) => {
    const updated: JobApplication = {
      ...app,
      status: nextStatus,
      timeline: [
        ...(app.timeline || []),
        {
          date: new Date().toISOString().split('T')[0],
          status: nextStatus,
          note: `Status moved to ${nextStatus}`
        }
      ]
    };
    onUpdateApplication(updated);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F1EA]">
      {/* Tracker Header */}
      <div className="bg-[#F4F1EA] border-b border-[#121212] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#121212] bg-[#FAF8F5] text-[#121212] shadow-[2px_2px_0px_0px_#121212]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-0.5">
              LEDGER // PIPELINE
            </span>
            <h2 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
              Opportunity Ledger & Snapshot Matrix
            </h2>
            <p className="font-editorial-body text-xs text-[#121212]/70 italic mt-0.5">
              Correlate interview conversion rates with exact resume branch & version snapshots.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-[0.15em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Application</span>
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto p-4 md:p-8 bg-[#EAE6DC]">
        <div className="flex gap-5 min-w-[1150px] h-full items-start">
          {STATUS_COLUMNS.map(col => {
            const appsInCol = applications.filter(a => a.status === col.key);

            return (
              <div
                key={col.key}
                className="w-72 flex-shrink-0 bg-[#F4F1EA] border border-[#121212] shadow-[3px_3px_0px_0px_#121212] flex flex-col max-h-full"
              >
                {/* Column Header */}
                <div className="p-3 bg-[#121212] text-[#F4F1EA] border-b border-[#121212] flex items-center justify-between">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em]">
                    {col.label}
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 bg-[#FAF8F5] text-[#121212]">
                    {appsInCol.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {appsInCol.map(app => {
                    const branch = branches.find(b => b.id === app.branchId);

                    return (
                      <div
                        key={app.id}
                        className="bg-[#FAF8F5] border border-[#121212] p-4 space-y-3 shadow-[2px_2px_0px_0px_#121212] transition-all"
                      >
                        <div className="flex items-start justify-between gap-1 border-b border-[#121212]/20 pb-2">
                          <div>
                            <h4 className="font-serif-display text-base font-bold italic text-[#121212]">
                              {app.company}
                            </h4>
                            <p className="text-[11px] font-sans text-[#121212]/70">{app.role}</p>
                          </div>

                          {app.atsMatchScore && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 border border-[#121212] bg-[#FAF8F5] text-[#121212]">
                              {app.atsMatchScore}% ATS
                            </span>
                          )}
                        </div>

                        {/* Linked Version Pill */}
                        <div className="flex items-center justify-between text-[10px] bg-[#F4F1EA] p-2 border border-[#121212]/30 font-mono">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className="w-2 h-2 border border-[#121212] shrink-0"
                              style={{ backgroundColor: branch?.color || '#121212' }}
                            />
                            <span className="text-[#121212] font-semibold truncate">{branch?.name}</span>
                          </div>
                          <span className="text-[#121212] font-bold">@{app.versionId}</span>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between text-[10px] text-[#121212]/60 font-sans">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {app.appliedDate}
                          </span>
                          <span>{app.location}</span>
                        </div>

                        {/* Quick Status Advance Trigger */}
                        <div className="pt-2 border-t border-[#121212]/20 flex items-center justify-between">
                          <select
                            value={app.status}
                            onChange={e => handleStatusChange(app, e.target.value as ApplicationStatus)}
                            className="bg-[#FAF8F5] border border-[#121212] px-2 py-0.5 text-[10px] text-[#121212] font-sans focus:outline-none"
                          >
                            <option value="saved">Saved</option>
                            <option value="applied">Applied</option>
                            <option value="screening">Screening</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Concluded</option>
                          </select>

                          <button
                            onClick={() => onViewVersion(app.versionId)}
                            className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] hover:underline flex items-center gap-0.5"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {appsInCol.length === 0 && (
                    <div className="text-center py-8 text-[#121212]/50 text-xs italic font-editorial-body">
                      No applications recorded
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-lg shadow-[8px_8px_0px_0px_#121212] overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
              <h3 className="font-serif-display font-bold text-base italic text-[#121212]">
                Log New Opportunity Application
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#121212] hover:opacity-70">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Stripe, Linear"
                    required
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Staff Infrastructure Engineer"
                    required
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                    Linked Resume Branch
                  </label>
                  <select
                    value={branchId}
                    onChange={e => setBranchId(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-2 text-xs text-[#121212] focus:outline-none"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.displayName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                    Version Snapshot
                  </label>
                  <select
                    value={versionId}
                    onChange={e => setVersionId(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-2 text-xs text-[#121212] font-mono focus:outline-none"
                  >
                    {versions.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.id} — {v.commitMessage.slice(0, 25)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco / Remote"
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                    Target Compensation
                  </label>
                  <input
                    type="text"
                    value={salary}
                    onChange={e => setSalary(e.target.value)}
                    placeholder="e.g. $180k - $220k + Equity"
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Strategy Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Tailored bullet points for distributed consensus and high availability..."
                  className="w-full bg-[#FAF8F5] border border-[#121212] p-2 text-xs text-[#121212] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#121212] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] border border-[#121212] font-sans font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] border border-[#121212] font-sans font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#121212]"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
