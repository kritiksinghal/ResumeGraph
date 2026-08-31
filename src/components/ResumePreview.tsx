import React from 'react';
import {
  Printer,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  FileJson
} from 'lucide-react';
import { ResumeData } from '../types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  branchName?: string;
  versionId?: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  branchName = 'main',
  versionId = 'v3'
}) => {
  const [template, setTemplate] = React.useState<'editorial' | 'modern' | 'minimal'>('editorial');
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);
  const [copied, setCopied] = React.useState(false);
  const [showJsonModal, setShowJsonModal] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let plain = `${resumeData.profile.fullName}\n${resumeData.profile.title}\n${resumeData.profile.email} | ${resumeData.profile.phone} | ${resumeData.profile.location}\n\n`;
    plain += `SUMMARY\n${resumeData.summary.text}\n\n`;
    plain += `EXPERIENCE\n`;
    resumeData.experience.forEach(e => {
      plain += `${e.role} — ${e.company} (${e.startDate} - ${e.endDate})\n`;
      e.bullets.forEach(b => (plain += `• ${b}\n`));
      plain += `\n`;
    });
    plain += `PROJECTS\n`;
    resumeData.projects.forEach(p => {
      plain += `${p.name} | ${p.tagline}\n`;
      p.bullets.forEach(b => (plain += `• ${b}\n`));
      plain += `\n`;
    });
    plain += `SKILLS\n`;
    resumeData.skillCategories.forEach(c => {
      plain += `${c.categoryName}: ${c.skills.map(s => s.name).join(', ')}\n`;
    });
    navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F1EA]">
      {/* Top Toolbar */}
      <div className="bg-[#F4F1EA] border-b border-[#121212] px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212]/60 hidden sm:inline">
            Print Layout:
          </span>
          <div className="flex items-center bg-[#FAF8F5] border border-[#121212] p-0.5 shadow-[2px_2px_0px_0px_#121212]">
            <button
              onClick={() => setTemplate('editorial')}
              className={`px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
                template === 'editorial'
                  ? 'bg-[#121212] text-[#F4F1EA]'
                  : 'text-[#121212]/70 hover:text-[#121212]'
              }`}
            >
              Editorial Broadside
            </button>
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
                template === 'modern'
                  ? 'bg-[#121212] text-[#F4F1EA]'
                  : 'text-[#121212]/70 hover:text-[#121212]'
              }`}
            >
              Modern Grotesque
            </button>
            <button
              onClick={() => setTemplate('minimal')}
              className={`px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
                template === 'minimal'
                  ? 'bg-[#121212] text-[#F4F1EA]'
                  : 'text-[#121212]/70 hover:text-[#121212]'
              }`}
            >
              Monochrome ATS
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#121212]/20 hidden md:block" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] px-2 py-1 border border-[#121212] shadow-[2px_2px_0px_0px_#121212] text-[#121212]">
            <button
              onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
              className="hover:bg-[#EAE6DC] p-0.5 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] font-bold w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
              className="hover:bg-[#EAE6DC] p-0.5 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="ml-1 text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 border border-[#121212] bg-[#FAF8F5] hover:bg-[#121212] hover:text-[#F4F1EA] transition-all"
            >
              100%
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] border border-[#121212] font-sans text-xs font-bold uppercase tracking-[0.1em] shadow-[2px_2px_0px_0px_#121212] transition-all"
            title="Copy ATS plaintext to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Plaintext'}</span>
          </button>

          <button
            onClick={() => setShowJsonModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] border border-[#121212] font-sans text-xs font-bold uppercase tracking-[0.1em] shadow-[2px_2px_0px_0px_#121212] transition-all"
            title="View or export structured semantic JSON"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JSON Tree</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-sans text-xs font-bold uppercase tracking-[0.15em] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all"
            title="Print or export high-resolution PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-4 md:p-10 flex justify-center bg-[#EAE6DC]">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 ease-out"
        >
          {/* Printable Resume Sheet Container */}
          <div
            id="printable-resume-page"
            className={`w-[816px] min-h-[1056px] bg-white text-[#121212] border border-[#121212] shadow-[6px_6px_0px_0px_#121212] p-12 print:p-0 print:border-none print:shadow-none print:w-full transition-all ${
              template === 'editorial'
                ? 'font-editorial-body'
                : template === 'minimal'
                ? 'font-mono-code'
                : 'font-sans'
            }`}
          >
            {/* Header / Personal Info */}
            <div className="pb-4 border-b border-[#121212]">
              <div className="flex justify-between items-baseline mb-1">
                <h1
                  className={`text-3xl font-bold tracking-tight text-[#121212] ${
                    template === 'editorial' ? 'font-serif-display uppercase tracking-wider' : 'font-sans'
                  }`}
                >
                  {resumeData.profile.fullName}
                </h1>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#121212]/60">
                  REF // {branchName.toUpperCase()}-{versionId}
                </span>
              </div>
              <p
                className={`text-sm font-semibold tracking-wide ${
                  template === 'editorial' ? 'italic font-serif-display text-[#121212]' : 'text-[#121212] font-medium'
                }`}
              >
                {resumeData.profile.title}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#121212]/80 mt-3 font-sans">
                <span>{resumeData.profile.email}</span>
                <span>•</span>
                <span>{resumeData.profile.phone}</span>
                <span>•</span>
                <span>{resumeData.profile.location}</span>
                {resumeData.profile.website && (
                  <>
                    <span>•</span>
                    <a href={resumeData.profile.website} className="text-[#121212] underline font-medium">
                      {resumeData.profile.website.replace('https://', '')}
                    </a>
                  </>
                )}
                {resumeData.profile.github && (
                  <>
                    <span>•</span>
                    <a href={resumeData.profile.github} className="text-[#121212] underline font-medium">
                      {resumeData.profile.github.replace('https://', '')}
                    </a>
                  </>
                )}
                {resumeData.profile.linkedin && (
                  <>
                    <span>•</span>
                    <a href={resumeData.profile.linkedin} className="text-[#121212] underline font-medium">
                      {resumeData.profile.linkedin.replace('https://', '')}
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Executive Summary */}
            {resumeData.summary?.text && (
              <div className="mt-5">
                <div className="flex items-baseline gap-2 pb-1 border-b border-[#121212] mb-2.5">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#121212]/60">01</span>
                  <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
                    Executive Summary
                  </h2>
                </div>
                <p className="text-xs text-[#121212]/90 leading-relaxed text-justify font-editorial-body italic">
                  "{resumeData.summary.text}"
                </p>
              </div>
            )}

            {/* Work Experience */}
            {resumeData.experience?.length > 0 && (
              <div className="mt-6">
                <div className="flex items-baseline gap-2 pb-1 border-b border-[#121212] mb-3">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#121212]/60">02</span>
                  <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
                    Professional Experience
                  </h2>
                </div>

                <div className="space-y-4">
                  {resumeData.experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-[#121212] font-sans">
                          {exp.role} <span className="font-serif-display italic font-normal text-[#121212]/70">— {exp.company}</span>
                        </span>
                        <span className="text-[11px] font-medium text-[#121212] font-mono">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#121212]/60 italic font-editorial-body mb-1">{exp.location}</div>

                      <ul className="list-disc pl-4 space-y-1 text-xs text-[#121212]/90 leading-normal font-sans">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>

                      {exp.techStack?.length > 0 && (
                        <div className="text-[10px] text-[#121212]/70 mt-1 font-mono">
                          <span className="font-bold text-[#121212]">Technologies:</span> {exp.techStack.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Projects */}
            {resumeData.projects?.length > 0 && (
              <div className="mt-6">
                <div className="flex items-baseline gap-2 pb-1 border-b border-[#121212] mb-3">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#121212]/60">03</span>
                  <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
                    Technical & Research Projects
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {resumeData.projects.map(proj => (
                    <div key={proj.id}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-[#121212] font-sans">
                          {proj.name}
                          {proj.tagline && (
                            <span className="font-normal font-editorial-body italic text-[#121212]/70"> | {proj.tagline}</span>
                          )}
                        </span>
                        {proj.startDate && (
                          <span className="text-[11px] font-medium text-[#121212] font-mono">
                            {proj.startDate} – {proj.endDate || 'Present'}
                          </span>
                        )}
                      </div>

                      <ul className="list-disc pl-4 space-y-1 text-xs text-[#121212]/90 leading-normal mt-1 font-sans">
                        {proj.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>

                      {proj.techStack?.length > 0 && (
                        <div className="text-[10px] text-[#121212]/70 mt-1 font-mono">
                          <span className="font-bold text-[#121212]">Stack:</span> {proj.techStack.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {resumeData.skillCategories?.length > 0 && (
              <div className="mt-6">
                <div className="flex items-baseline gap-2 pb-1 border-b border-[#121212] mb-2.5">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#121212]/60">04</span>
                  <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
                    Skills & Competencies
                  </h2>
                </div>

                <div className="space-y-1.5 text-xs text-[#121212] font-sans">
                  {resumeData.skillCategories.map(cat => (
                    <div key={cat.id} className="flex">
                      <span className="font-bold text-[#121212] w-48 shrink-0">{cat.categoryName}:</span>
                      <span className="text-[#121212]/90">{cat.skills.map(s => s.name).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education?.length > 0 && (
              <div className="mt-6">
                <div className="flex items-baseline gap-2 pb-1 border-b border-[#121212] mb-2.5">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#121212]/60">05</span>
                  <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#121212]">
                    Education & Credentials
                  </h2>
                </div>

                {resumeData.education.map(edu => (
                  <div key={edu.id} className="mb-2 font-sans">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-[#121212]">{edu.institution}</span>
                      <span className="text-[11px] font-medium text-[#121212] font-mono">
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                    <div className="text-xs text-[#121212]/80">
                      {edu.degree} {edu.gpa ? `— GPA: ${edu.gpa}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications & Publications */}
            {(resumeData.certifications?.length > 0 || resumeData.publications?.length > 0) && (
              <div className="mt-5 pt-3 border-t border-[#121212] text-xs text-[#121212] space-y-1.5 font-sans">
                {resumeData.certifications?.length > 0 && (
                  <div>
                    <span className="font-bold text-[#121212]">Certifications: </span>
                    <span>{resumeData.certifications.map(c => `${c.name} (${c.issuer})`).join('; ')}</span>
                  </div>
                )}
                {resumeData.publications?.length > 0 && (
                  <div>
                    <span className="font-bold text-[#121212]">Publications: </span>
                    <span className="font-editorial-body italic">{resumeData.publications.map(p => `"${p.title}" — ${p.publisher}`).join('; ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Micro Footer with Version Fingerprint */}
            <div className="mt-8 pt-2 border-t border-[#121212] flex items-center justify-between text-[9px] text-[#121212]/60 font-mono">
              <span>ResumeFlow Semantic Document Framework</span>
              <span>
                Track: {branchName} • Snapshot: {versionId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[8px_8px_0px_0px_#121212] overflow-hidden animate-fadeIn">
            <div className="px-5 py-3 border-b border-[#121212] flex items-center justify-between bg-[#F4F1EA]">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-[#121212]" />
                <span className="font-bold text-xs uppercase tracking-wider font-mono text-[#121212]">
                  Structured Semantic JSON Document
                </span>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-xs font-mono font-bold uppercase px-2 py-1 bg-[#121212] text-[#F4F1EA] border border-[#121212] shadow-[2px_2px_0px_0px_#121212]"
              >
                Close
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-auto font-mono text-xs text-[#121212] bg-[#FAF8F5] leading-relaxed border-t border-[#121212]/20">
              {JSON.stringify(resumeData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
