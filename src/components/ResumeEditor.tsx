import React from 'react';
import {
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  BookMarked,
  FileText,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import {
  ResumeData,
  ExperienceItem,
  ProjectItem,
  SkillCategory,
  CertificationItem
} from '../types/resume';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onChange: (updated: ResumeData) => void;
  onOpenJdOptimizer: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  onChange,
  onOpenJdOptimizer
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('experience');

  // Generic updater
  const updateSection = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    onChange({
      ...resumeData,
      [key]: value
    });
  };

  // Helper to add new experience
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'New Organization Inc.',
      role: 'Staff Engineer',
      location: 'New York, NY',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected high-throughput distributed message brokers with sub-10ms p99 latency.',
        'Led engineering squad in zero-downtime database migration for 10M+ customer profiles.'
      ],
      techStack: ['Go', 'PostgreSQL', 'Kafka'],
      domain: 'Core Infrastructure'
    };
    updateSection('experience', [newExp, ...resumeData.experience]);
  };

  // Helper to add new project
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'Project Archive',
      tagline: 'High performance scalable ledger system',
      role: 'Lead Architect',
      startDate: '2024-01',
      endDate: '2024-06',
      bullets: [
        'Engineered immutable audit logging system reducing reconciliation anomalies by 98%.',
        'Implemented comprehensive automated test matrix achieving 96% branch coverage.'
      ],
      techStack: ['TypeScript', 'React', 'Node.js'],
      metrics: ['99.99% uptime']
    };
    updateSection('projects', [newProj, ...resumeData.projects]);
  };

  // Helper to add new skill category
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `skills-${Date.now()}`,
      categoryName: 'Domain Competencies',
      skills: [
        { name: 'Distributed Systems', level: 'Proficient' },
        { name: 'Query Optimization', level: 'Familiar' }
      ]
    };
    updateSection('skillCategories', [...resumeData.skillCategories, newCat]);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F4F1EA]">
      {/* Side Navigation for Structured Sections */}
      <aside className="w-full md:w-72 border-r border-[#121212] bg-[#F4F1EA] p-4 space-y-2 overflow-y-auto">
        <div className="px-2 py-1 text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-[#121212]/60">
          DOCUMENT SECTIONS
        </div>

        <div className="space-y-1">
          {[
            { id: 'profile', label: 'Candidate Profile', icon: User, count: null },
            { id: 'summary', label: 'Executive Summary', icon: FileText, count: null },
            { id: 'experience', label: 'Work Experience', icon: Briefcase, count: resumeData.experience.length },
            { id: 'projects', label: 'Technical Projects', icon: FolderGit2, count: resumeData.projects.length },
            { id: 'skills', label: 'Skills & Grounding', icon: Cpu, count: resumeData.skillCategories.reduce((acc, c) => acc + c.skills.length, 0) },
            { id: 'education', label: 'Education', icon: GraduationCap, count: resumeData.education.length },
            { id: 'certifications', label: 'Certifications', icon: Award, count: resumeData.certifications.length },
            { id: 'achievements', label: 'Achievements', icon: Award, count: resumeData.achievements.length },
            { id: 'publications', label: 'Publications', icon: BookMarked, count: resumeData.publications.length }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.1em] transition-all border ${
                  isActive
                    ? 'bg-[#121212] text-[#F4F1EA] border-[#121212] shadow-[2px_2px_0px_0px_#121212]'
                    : 'bg-[#FAF8F5] text-[#121212] border-[#121212]/30 hover:border-[#121212] hover:bg-[#EAE6DC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 border ${
                      isActive
                        ? 'border-[#F4F1EA] bg-[#F4F1EA]/10 text-[#F4F1EA]'
                        : 'border-[#121212]/30 bg-[#EAE6DC] text-[#121212]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Job Optimizer Box */}
        <div className="pt-4 mt-4 border-t border-[#121212]">
          <div className="bg-[#121212] text-[#F4F1EA] border border-[#121212] p-4 space-y-2.5 shadow-[3px_3px_0px_0px_#121212]">
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#F4F1EA]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Job Optimizer</span>
            </div>
            <p className="font-editorial-body text-xs text-[#F4F1EA]/80 leading-relaxed italic">
              "Tailor individual resume bullets against targeted job specifications with verified semantic grounding."
            </p>
            <button
              onClick={onOpenJdOptimizer}
              className="w-full py-2 px-3 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] font-sans font-bold text-[10px] uppercase tracking-[0.15em] border border-[#121212] shadow-[2px_2px_0px_0px_#FAF8F5] transition-all"
            >
              Analyze Target Job
            </button>
          </div>
        </div>
      </aside>

      {/* Editor Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#F4F1EA]">
        {/* Profile Section */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6">
            <div className="border-b border-[#121212] pb-3 flex justify-between items-baseline">
              <div>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-1">
                  SECTION 01
                </span>
                <h3 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                  Candidate & Contact Dossier
                </h3>
                <p className="font-editorial-body text-sm text-[#121212]/70 italic mt-0.5">
                  Top-level contact parameters printed uniformly across exported editions.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Full Legal / Professional Name
                </label>
                <input
                  type="text"
                  value={resumeData.profile.fullName}
                  onChange={e => updateSection('profile', { ...resumeData.profile, fullName: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Professional Title / Domain Focus
                </label>
                <input
                  type="text"
                  value={resumeData.profile.title}
                  onChange={e => updateSection('profile', { ...resumeData.profile, title: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resumeData.profile.email}
                  onChange={e => updateSection('profile', { ...resumeData.profile, email: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={resumeData.profile.phone}
                  onChange={e => updateSection('profile', { ...resumeData.profile, phone: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Primary Location
                </label>
                <input
                  type="text"
                  value={resumeData.profile.location}
                  onChange={e => updateSection('profile', { ...resumeData.profile, location: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Portfolio / Personal Website
                </label>
                <input
                  type="url"
                  value={resumeData.profile.website || ''}
                  onChange={e => updateSection('profile', { ...resumeData.profile, website: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={resumeData.profile.github || ''}
                  onChange={e => updateSection('profile', { ...resumeData.profile, github: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={resumeData.profile.linkedin || ''}
                  onChange={e => updateSection('profile', { ...resumeData.profile, linkedin: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary */}
        {activeTab === 'summary' && (
          <div className="max-w-3xl space-y-6">
            <div className="border-b border-[#121212] pb-3 flex justify-between items-baseline">
              <div>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-1">
                  SECTION 02
                </span>
                <h3 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                  Executive Positioning Summary
                </h3>
                <p className="font-editorial-body text-sm text-[#121212]/70 italic mt-0.5">
                  High-level thesis positioning customized specifically per track.
                </p>
              </div>
              <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 border border-[#121212] bg-[#FAF8F5] text-[#121212]">
                Focus: {resumeData.summary.toneFocus || 'General'}
              </span>
            </div>

            <div className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-4">
              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Tone / Specialization Tag
                </label>
                <input
                  type="text"
                  value={resumeData.summary.toneFocus || ''}
                  onChange={e => updateSection('summary', { ...resumeData.summary, toneFocus: e.target.value })}
                  placeholder="e.g. Distributed Systems & High-Throughput Infrastructure"
                  className="w-full bg-[#FAF8F5] border border-[#121212] px-3 py-2 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                  Summary Body
                </label>
                <textarea
                  rows={6}
                  value={resumeData.summary.text}
                  onChange={e => updateSection('summary', { ...resumeData.summary, text: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#121212] p-3 text-sm text-[#121212] font-editorial-body focus:outline-none focus:ring-1 focus:ring-[#121212] leading-relaxed"
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-[#121212]/60 mt-1">
                  <span>Aim for 3-4 impactful sentences describing core system capabilities.</span>
                  <span>{resumeData.summary.text.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Work Experience */}
        {activeTab === 'experience' && (
          <div className="max-w-4xl space-y-6">
            <div className="border-b border-[#121212] pb-3 flex justify-between items-baseline">
              <div>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-1">
                  SECTION 03
                </span>
                <h3 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                  Chronological Experience Entities
                </h3>
                <p className="font-editorial-body text-sm text-[#121212]/70 italic mt-0.5">
                  Semantic entity nodes tracked with stable immutable hash references.
                </p>
              </div>
              <button
                onClick={addExperience}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] text-xs font-sans font-bold uppercase tracking-[0.1em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-5">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#121212]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] px-2 py-0.5 bg-[#121212] text-[#F4F1EA] font-semibold tracking-wider">
                        {exp.id}
                      </span>
                      <span className="font-serif-display text-lg font-bold italic text-[#121212]">
                        {exp.company || 'Untitled Position'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const newExp = [...resumeData.experience];
                        newExp.splice(index, 1);
                        updateSection('experience', newExp);
                      }}
                      className="p-1 text-[#121212]/60 hover:text-red-700 hover:bg-[#EAE6DC] transition-colors"
                      title="Delete Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Company / Institution
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => {
                          const newExp = [...resumeData.experience];
                          newExp[index].company = e.target.value;
                          updateSection('experience', newExp);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={e => {
                          const newExp = [...resumeData.experience];
                          newExp[index].role = e.target.value;
                          updateSection('experience', newExp);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={e => {
                          const newExp = [...resumeData.experience];
                          newExp[index].location = e.target.value;
                          updateSection('experience', newExp);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Tenure Range
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={e => {
                            const newExp = [...resumeData.experience];
                            newExp[index].startDate = e.target.value;
                            updateSection('experience', newExp);
                          }}
                          placeholder="2023-01"
                          className="w-1/2 bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-mono focus:outline-none focus:ring-1 focus:ring-[#121212]"
                        />
                        <span className="text-[#121212]/50 text-xs">—</span>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={e => {
                            const newExp = [...resumeData.experience];
                            newExp[index].endDate = e.target.value;
                            updateSection('experience', newExp);
                          }}
                          placeholder="Present"
                          className="w-1/2 bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-mono focus:outline-none focus:ring-1 focus:ring-[#121212]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Technology Stack (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={exp.techStack.join(', ')}
                        onChange={e => {
                          const newExp = [...resumeData.experience];
                          newExp[index].techStack = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateSection('experience', newExp);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-mono focus:outline-none focus:ring-1 focus:ring-[#121212]"
                      />
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-[#121212]/20">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                        Accomplishments & Empirical Metrics
                      </label>
                      <button
                        onClick={() => {
                          const newExp = [...resumeData.experience];
                          newExp[index].bullets.push('Accomplished [X] by implementing [Y], resulting in [Z metric].');
                          updateSection('experience', newExp);
                        }}
                        className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </button>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-[#121212] font-serif-display font-bold text-sm mt-1">§</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={e => {
                            const newExp = [...resumeData.experience];
                            newExp[index].bullets[bIdx] = e.target.value;
                            updateSection('experience', newExp);
                          }}
                          className="flex-1 bg-[#FAF8F5] border border-[#121212]/40 p-2.5 text-xs text-[#121212] font-sans focus:outline-none focus:border-[#121212] leading-relaxed"
                        />
                        <button
                          onClick={() => {
                            const newExp = [...resumeData.experience];
                            newExp[index].bullets.splice(bIdx, 1);
                            updateSection('experience', newExp);
                          }}
                          className="p-1 text-[#121212]/40 hover:text-red-700 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Projects */}
        {activeTab === 'projects' && (
          <div className="max-w-4xl space-y-6">
            <div className="border-b border-[#121212] pb-3 flex justify-between items-baseline">
              <div>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-1">
                  SECTION 04
                </span>
                <h3 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                  Technical & Research Projects
                </h3>
                <p className="font-editorial-body text-sm text-[#121212]/70 italic mt-0.5">
                  Open-source contributions, system implementations, and experimental codebases.
                </p>
              </div>
              <button
                onClick={addProject}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] text-xs font-sans font-bold uppercase tracking-[0.1em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-5">
              {resumeData.projects.map((proj, index) => (
                <div
                  key={proj.id}
                  className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#121212]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] px-2 py-0.5 bg-[#121212] text-[#F4F1EA] font-semibold tracking-wider">
                        {proj.id}
                      </span>
                      <span className="font-serif-display text-lg font-bold italic text-[#121212]">
                        {proj.name}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const newProjs = [...resumeData.projects];
                        newProjs.splice(index, 1);
                        updateSection('projects', newProjs);
                      }}
                      className="p-1 text-[#121212]/60 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={e => {
                          const newP = [...resumeData.projects];
                          newP[index].name = e.target.value;
                          updateSection('projects', newP);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Architecture Tagline / One-Liner
                      </label>
                      <input
                        type="text"
                        value={proj.tagline}
                        onChange={e => {
                          const newP = [...resumeData.projects];
                          newP[index].tagline = e.target.value;
                          updateSection('projects', newP);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Code Repository / Artifact URL
                      </label>
                      <input
                        type="url"
                        value={proj.githubUrl || ''}
                        onChange={e => {
                          const newP = [...resumeData.projects];
                          newP[index].githubUrl = e.target.value;
                          updateSection('projects', newP);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-mono focus:outline-none focus:ring-1 focus:ring-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                        Tech Stack (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={proj.techStack.join(', ')}
                        onChange={e => {
                          const newP = [...resumeData.projects];
                          newP[index].techStack = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateSection('projects', newP);
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-mono focus:outline-none focus:ring-1 focus:ring-[#121212]"
                      />
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-[#121212]/20">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                        Technical Highlights
                      </label>
                      <button
                        onClick={() => {
                          const newP = [...resumeData.projects];
                          newP[index].bullets.push('Architected system resulting in high performance benchmarks.');
                          updateSection('projects', newP);
                        }}
                        className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Highlight
                      </button>
                    </div>

                    {proj.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-[#121212] font-serif-display font-bold text-sm mt-1">§</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={e => {
                            const newP = [...resumeData.projects];
                            newP[index].bullets[bIdx] = e.target.value;
                            updateSection('projects', newP);
                          }}
                          className="flex-1 bg-[#FAF8F5] border border-[#121212]/40 p-2.5 text-xs text-[#121212] font-sans focus:outline-none focus:border-[#121212] leading-relaxed"
                        />
                        <button
                          onClick={() => {
                            const newP = [...resumeData.projects];
                            newP[index].bullets.splice(bIdx, 1);
                            updateSection('projects', newP);
                          }}
                          className="p-1 text-[#121212]/40 hover:text-red-700 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Evidence */}
        {activeTab === 'skills' && (
          <div className="max-w-4xl space-y-6">
            <div className="border-b border-[#121212] pb-3 flex justify-between items-baseline">
              <div>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-1">
                  SECTION 05
                </span>
                <h3 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                  Skills Taxonomy & Grounding Registry
                </h3>
                <p className="font-editorial-body text-sm text-[#121212]/70 italic mt-0.5">
                  Verified evidence anchors prevent AI hallucinations and guarantee ATS keyword alignment.
                </p>
              </div>
              <button
                onClick={addSkillCategory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] text-xs font-sans font-bold uppercase tracking-[0.1em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-5">
              {resumeData.skillCategories.map((cat, cIdx) => (
                <div key={cat.id} className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-[#121212]/30 pb-2">
                    <input
                      type="text"
                      value={cat.categoryName}
                      onChange={e => {
                        const newCats = [...resumeData.skillCategories];
                        newCats[cIdx].categoryName = e.target.value;
                        updateSection('skillCategories', newCats);
                      }}
                      className="bg-transparent font-serif-display font-bold italic text-base text-[#121212] focus:outline-none focus:underline"
                    />
                    <button
                      onClick={() => {
                        const newCats = [...resumeData.skillCategories];
                        newCats.splice(cIdx, 1);
                        updateSection('skillCategories', newCats);
                      }}
                      className="text-[#121212]/50 hover:text-red-700 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cat.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-[#F4F1EA] p-2.5 border border-[#121212]/30 text-xs"
                      >
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={e => {
                              const newCats = [...resumeData.skillCategories];
                              newCats[cIdx].skills[sIdx].name = e.target.value;
                              updateSection('skillCategories', newCats);
                            }}
                            placeholder="Skill Name"
                            className="w-full bg-[#FAF8F5] border border-[#121212] px-2 py-1 text-[#121212] font-mono text-xs focus:outline-none"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <select
                            value={skill.level || 'Proficient'}
                            onChange={e => {
                              const newCats = [...resumeData.skillCategories];
                              newCats[cIdx].skills[sIdx].level = e.target.value as any;
                              updateSection('skillCategories', newCats);
                            }}
                            className="w-full bg-[#FAF8F5] border border-[#121212] px-2 py-1 text-[#121212] text-xs focus:outline-none font-sans font-medium"
                          >
                            <option value="Expert">Expert</option>
                            <option value="Proficient">Proficient</option>
                            <option value="Familiar">Familiar</option>
                          </select>
                        </div>

                        <div className="md:col-span-4">
                          <input
                            type="text"
                            value={skill.verifiedEvidence || ''}
                            onChange={e => {
                              const newCats = [...resumeData.skillCategories];
                              newCats[cIdx].skills[sIdx].verifiedEvidence = e.target.value;
                              updateSection('skillCategories', newCats);
                            }}
                            placeholder="Anchor: exp-101, proj-101"
                            className="w-full bg-[#FAF8F5] border border-[#121212] px-2 py-1 text-[#121212]/80 text-[11px] font-mono focus:outline-none"
                          />
                        </div>

                        <div className="md:col-span-1 flex justify-end">
                          <button
                            onClick={() => {
                              const newCats = [...resumeData.skillCategories];
                              newCats[cIdx].skills.splice(sIdx, 1);
                              updateSection('skillCategories', newCats);
                            }}
                            className="text-[#121212]/40 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newCats = [...resumeData.skillCategories];
                        newCats[cIdx].skills.push({ name: 'New Skill', level: 'Proficient' });
                        updateSection('skillCategories', newCats);
                      }}
                      className="text-xs font-sans font-bold uppercase tracking-wider text-[#121212] hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" /> Add Skill Entry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeTab === 'education' && (
          <div className="max-w-3xl space-y-6">
            <div className="border-b border-[#121212] pb-3 flex justify-between items-baseline">
              <div>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-1">
                  SECTION 06
                </span>
                <h3 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                  Academic Credentials
                </h3>
                <p className="font-editorial-body text-sm text-[#121212]/70 italic mt-0.5">
                  Degrees, institutions, and honors.
                </p>
              </div>
            </div>

            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                      Academic Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={e => {
                        const newE = [...resumeData.education];
                        newE[index].institution = e.target.value;
                        updateSection('education', newE);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                      Degree & Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={e => {
                        const newE = [...resumeData.education];
                        newE[index].degree = e.target.value;
                        updateSection('education', newE);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                      Date Range
                    </label>
                    <input
                      type="text"
                      value={`${edu.startDate} - ${edu.endDate}`}
                      onChange={e => {
                        const parts = e.target.value.split('-');
                        const newE = [...resumeData.education];
                        newE[index].startDate = parts[0]?.trim() || '';
                        newE[index].endDate = parts[1]?.trim() || '';
                        updateSection('education', newE);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                      GPA & Academic Honors
                    </label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={e => {
                        const newE = [...resumeData.education];
                        newE[index].gpa = e.target.value;
                        updateSection('education', newE);
                      }}
                      placeholder="e.g. 3.85 / 4.00"
                      className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {activeTab === 'certifications' && (
          <div className="max-w-3xl space-y-6">
            <div className="border-b border-[#121212] pb-3 flex justify-between items-baseline">
              <div>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-1">
                  SECTION 07
                </span>
                <h3 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                  Professional Certifications
                </h3>
                <p className="font-editorial-body text-sm text-[#121212]/70 italic mt-0.5">
                  Industry certifications (AWS, CKA, GCP, etc.).
                </p>
              </div>
              <button
                onClick={() => {
                  const newCert: CertificationItem = {
                    id: `cert-${Date.now()}`,
                    name: 'New Certification',
                    issuer: 'Issuing Body',
                    issueDate: '2024-01'
                  };
                  updateSection('certifications', [...resumeData.certifications, newCert]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] text-xs font-sans font-bold uppercase tracking-[0.1em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
              </button>
            </div>

            {resumeData.certifications.map((cert, index) => (
              <div key={cert.id} className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                      Certification Name
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={e => {
                        const newC = [...resumeData.certifications];
                        newC[index].name = e.target.value;
                        updateSection('certifications', newC);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block mb-1">
                      Issuing Authority
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={e => {
                        const newC = [...resumeData.certifications];
                        newC[index].issuer = e.target.value;
                        updateSection('certifications', newC);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Achievements & Publications */}
        {(activeTab === 'achievements' || activeTab === 'publications') && (
          <div className="max-w-3xl space-y-6">
            <div className="border-b border-[#121212] pb-3">
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block mb-1">
                SECTION 08
              </span>
              <h3 className="font-serif-display text-2xl font-bold italic tracking-tight text-[#121212]">
                {activeTab === 'achievements' ? 'Honors & Recognitions' : 'Publications & Posters'}
              </h3>
              <p className="font-editorial-body text-sm text-[#121212]/70 italic mt-0.5">
                Awards, conference proceedings, and academic contributions.
              </p>
            </div>

            {activeTab === 'achievements' &&
              resumeData.achievements.map((ach, idx) => (
                <div key={ach.id} className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-2">
                  <input
                    type="text"
                    value={ach.title}
                    onChange={e => {
                      const newA = [...resumeData.achievements];
                      newA[idx].title = e.target.value;
                      updateSection('achievements', newA);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-serif-display font-bold italic text-sm"
                  />
                  <textarea
                    rows={2}
                    value={ach.description}
                    onChange={e => {
                      const newA = [...resumeData.achievements];
                      newA[idx].description = e.target.value;
                      updateSection('achievements', newA);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#121212] p-2 text-xs text-[#121212] font-editorial-body"
                  />
                </div>
              ))}

            {activeTab === 'publications' &&
              resumeData.publications.map((pub, idx) => (
                <div key={pub.id} className="bg-[#FAF8F5] border border-[#121212] p-5 shadow-[3px_3px_0px_0px_#121212] space-y-2">
                  <input
                    type="text"
                    value={pub.title}
                    onChange={e => {
                      const newP = [...resumeData.publications];
                      newP[idx].title = e.target.value;
                      updateSection('publications', newP);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-serif-display font-bold italic text-sm"
                  />
                  <input
                    type="text"
                    value={pub.publisher}
                    onChange={e => {
                      const newP = [...resumeData.publications];
                      newP[idx].publisher = e.target.value;
                      updateSection('publications', newP);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#121212] px-2.5 py-1.5 text-xs text-[#121212] font-mono"
                  />
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
};
