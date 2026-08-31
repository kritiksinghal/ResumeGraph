import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Plus,
  Trash2,
  Layers,
  Wand2,
  FileText,
  Bot
} from 'lucide-react';
import { ResumeData, SkillCategory } from '../types/resume';

interface OnboardingWizardProps {
  onComplete: (userResume: ResumeData, targetRoleBranch: string) => void;
  onCancel: () => void;
  onUseSample: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onCancel,
  onUseSample
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [targetTitle, setTargetTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');

  // Primary Role Branching choice
  const [primaryBranchRole, setPrimaryBranchRole] = useState('Full-Stack Engineer');
  const [customBranchRole, setCustomBranchRole] = useState('');

  // Professional Summary
  const [summaryText, setSummaryText] = useState('');

  // Experience (1st Primary job)
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrentJob, setIsCurrentJob] = useState(true);
  const [bullet1, setBullet1] = useState('');
  const [bullet2, setBullet2] = useState('');
  const [bullet3, setBullet3] = useState('');

  // Skills
  const [languagesInput, setLanguagesInput] = useState('TypeScript, JavaScript, Python, SQL');
  const [frameworksInput, setFrameworksInput] = useState('React, Next.js, Node.js, Express, Tailwind CSS');
  const [toolsInput, setToolsInput] = useState('Git, Docker, AWS, PostgreSQL, Redis');

  // Quick preset roles
  const rolePresets = [
    { label: 'Full-Stack Software Engineer', branch: 'fullstack-eng' },
    { label: 'AI / Machine Learning Engineer', branch: 'aiml-eng' },
    { label: 'Backend & Distributed Systems', branch: 'backend-systems' },
    { label: 'Frontend / UI Systems Engineer', branch: 'frontend-eng' },
    { label: 'Product & Engineering Lead', branch: 'eng-lead' },
    { label: 'Custom Specialization...', branch: 'custom' }
  ];

  // Helper to generate a quick summary based on user title
  const handleAutoGenerateSummary = () => {
    const title = targetTitle || primaryBranchRole || 'Software Engineer';
    const name = fullName || 'Dedicated professional';
    setSummaryText(
      `${title} with a track record of architecting scalable applications and delivering high-impact features. Passionate about clean code, robust system design, and continuous technical growth.`
    );
  };

  const handleFinish = () => {
    const chosenRole = primaryBranchRole === 'Custom Specialization...' ? customBranchRole || 'Software Engineer' : primaryBranchRole;
    const finalFullName = fullName.trim() || 'Candidate Name';
    const finalTitle = targetTitle.trim() || chosenRole;

    // Parse skills into categories
    const languages = languagesInput.split(',').map(s => s.trim()).filter(Boolean);
    const frameworks = frameworksInput.split(',').map(s => s.trim()).filter(Boolean);
    const tools = toolsInput.split(',').map(s => s.trim()).filter(Boolean);

    const skillCategories: SkillCategory[] = [
      {
        id: 'cat-languages',
        categoryName: 'Languages & Core',
        skills: languages.map(l => ({ name: l, level: 'Proficient' }))
      },
      {
        id: 'cat-frameworks',
        categoryName: 'Frameworks & Libraries',
        skills: frameworks.map(f => ({ name: f, level: 'Proficient' }))
      },
      {
        id: 'cat-tools',
        categoryName: 'Infrastructure & Tools',
        skills: tools.map(t => ({ name: t, level: 'Proficient' }))
      }
    ];

    // Build experience list
    const experienceList = company.trim()
      ? [
          {
            id: `exp-${Date.now()}`,
            company: company.trim(),
            role: role.trim() || finalTitle,
            location: jobLocation.trim() || location.trim() || 'Remote',
            startDate: startDate.trim() || '2023',
            endDate: isCurrentJob ? 'Present' : (endDate.trim() || '2025'),
            current: isCurrentJob,
            bullets: [bullet1, bullet2, bullet3].filter(b => b.trim().length > 0),
            techStack: frameworks.slice(0, 3)
          }
        ]
      : [];

    const newResume: ResumeData = {
      id: `resume-${Date.now()}`,
      versionId: 'v1-initial',
      branchId: 'main',
      profile: {
        fullName: finalFullName,
        title: finalTitle,
        email: email.trim() || 'candidate@example.com',
        phone: phone.trim() || '+1 (555) 123-4567',
        location: location.trim() || 'San Francisco, CA',
        linkedin: linkedin.trim() || undefined,
        github: github.trim() || undefined,
        website: website.trim() || undefined
      },
      summary: {
        text: summaryText.trim() || `${finalTitle} focused on building resilient systems and clean architectures.`,
        toneFocus: 'Impact-driven'
      },
      experience: experienceList,
      education: [
        {
          id: `edu-${Date.now()}`,
          institution: 'University of Technology',
          degree: 'B.S. in Computer Science',
          fieldOfStudy: 'Computer Science',
          location: location.trim() || 'San Francisco, CA',
          startDate: '2019',
          endDate: '2023',
          coursework: ['Data Structures', 'Distributed Systems', 'Algorithms']
        }
      ],
      projects: [
        {
          id: `proj-${Date.now()}`,
          name: 'Core Application Engine',
          tagline: 'High-performance system architecture',
          bullets: ['Engineered scalable microservices processing high transaction throughput.', 'Implemented CI/CD automation reducing deployment cycles.'],
          techStack: languages.slice(0, 3)
        }
      ],
      skillCategories,
      certifications: [],
      achievements: [],
      publications: [],
      sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'publications'],
      visibleSections: {
        summary: true,
        experience: true,
        projects: true,
        skills: true,
        education: true,
        certifications: true,
        achievements: true,
        publications: true
      }
    };

    onComplete(newResume, chosenRole);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#121212] flex flex-col justify-between selection:bg-[#121212] selection:text-[#F4F1EA]">
      {/* Top Header */}
      <div className="border-b border-[#121212] bg-[#FAF8F5] px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#121212] text-[#F4F1EA] shadow-[2px_2px_0px_0px_#121212]">
            <Layers className="w-4 h-4 text-[#FAF8F5]" />
          </div>
          <div>
            <span className="font-sans text-[8px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block">
              ONBOARDING SETUP WIZARD
            </span>
            <h2 className="font-serif-display text-lg font-bold italic tracking-tight text-[#121212]">
              Building Your Personal Resume Engine
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onUseSample}
            className="text-xs font-editorial-body italic text-[#121212]/70 hover:text-[#121212] underline"
          >
            Or load sample engineer profile
          </button>
          <button
            onClick={onCancel}
            className="text-xs font-sans font-bold uppercase tracking-wider px-3 py-1 border border-[#121212]/40 hover:border-[#121212] bg-[#FAF8F5]"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-3xl mx-auto w-full p-4 md:p-8 flex-1 flex flex-col justify-center">
        <div className="bg-[#FAF8F5] border border-[#121212] shadow-[8px_8px_0px_0px_#121212] overflow-hidden flex flex-col">
          {/* Progress Indicator */}
          <div className="bg-[#F4F1EA] border-b border-[#121212] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  onClick={() => {
                    if (step < currentStep) setCurrentStep(step);
                  }}
                  className={`flex items-center justify-center w-7 h-7 text-xs font-mono font-bold border transition-all cursor-pointer ${
                    currentStep === step
                      ? 'bg-[#121212] text-[#F4F1EA] border-[#121212]'
                      : currentStep > step
                      ? 'bg-[#264634] text-[#F4F1EA] border-[#264634]'
                      : 'bg-[#FAF8F5] text-[#121212]/40 border-[#121212]/30'
                  }`}
                >
                  {currentStep > step ? <Check className="w-3.5 h-3.5" /> : step}
                </div>
              ))}
            </div>
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#121212]/70">
              STEP {currentStep} OF 5
            </span>
          </div>

          {/* Step Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* STEP 1: IDENTITY */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#946B12] block">
                    STEP 1: YOUR IDENTITY & CONTACT
                  </span>
                  <h3 className="font-serif-display text-2xl font-bold italic text-[#121212]">
                    Who is this resume for?
                  </h3>
                  <p className="font-editorial-body text-xs text-[#121212]/80 italic">
                    Let's personalize your document with your real name and contact links.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#121212]/40 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="e.g. Jane Doe, Alex Rivera"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none shadow-[2px_2px_0px_0px_#121212]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Current or Aspirational Title *
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-[#121212]/40 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="e.g. Senior Full-Stack Engineer, AI/ML Researcher, Tech Lead"
                        value={targetTitle}
                        onChange={e => setTargetTitle(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none shadow-[2px_2px_0px_0px_#121212]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#121212]/40 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none shadow-[2px_2px_0px_0px_#121212]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#121212]/40 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none shadow-[2px_2px_0px_0px_#121212]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Location (City, Country / Remote)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#121212]/40 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="San Francisco, CA or Remote"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none shadow-[2px_2px_0px_0px_#121212]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      LinkedIn Profile (Optional)
                    </label>
                    <div className="relative">
                      <Linkedin className="w-4 h-4 text-[#121212]/40 absolute left-3 top-2.5" />
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/janedoe"
                        value={linkedin}
                        onChange={e => setLinkedin(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none shadow-[2px_2px_0px_0px_#121212]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ROLE SPECIALIZATION & TARGET BRANCH */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#946B12] block">
                    STEP 2: TARGET ROLE & INITIAL BRANCH
                  </span>
                  <h3 className="font-serif-display text-2xl font-bold italic text-[#121212]">
                    What role are you targeting first?
                  </h3>
                  <p className="font-editorial-body text-xs text-[#121212]/80 italic">
                    We will initialize your <code>main</code> master branch and create your first specialized role track.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rolePresets.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setPrimaryBranchRole(preset.label)}
                      className={`p-3.5 text-left border transition-all shadow-[2px_2px_0px_0px_#121212] ${
                        primaryBranchRole === preset.label
                          ? 'bg-[#121212] text-[#F4F1EA] border-[#121212]'
                          : 'bg-[#F4F1EA] text-[#121212] border-[#121212] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sans text-xs font-bold uppercase tracking-wider">
                          {preset.label}
                        </span>
                        {primaryBranchRole === preset.label && (
                          <CheckCircle2 className="w-4 h-4 text-[#85B79D]" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono opacity-70">
                        track: {preset.branch}
                      </span>
                    </button>
                  ))}
                </div>

                {primaryBranchRole === 'Custom Specialization...' && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Specify Custom Track Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed Consensus Architect, Quant Developer"
                      value={customBranchRole}
                      onChange={e => setCustomBranchRole(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none shadow-[2px_2px_0px_0px_#121212]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: PROFESSIONAL SUMMARY */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#946B12] block">
                      STEP 3: PROFESSIONAL SUMMARY
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold italic text-[#121212]">
                      Your 2-Sentence Elevator Pitch
                    </h3>
                    <p className="font-editorial-body text-xs text-[#121212]/80 italic">
                      A concise overview of your technical background and engineering philosophy.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoGenerateSummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-[#121212] hover:text-[#F4F1EA] transition-all shadow-[2px_2px_0px_0px_#121212] shrink-0"
                  >
                    <Wand2 className="w-3 h-3 text-[#946B12]" />
                    <span>AI Draft Helper</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <textarea
                    rows={4}
                    placeholder="e.g. Full-Stack Software Engineer with 4+ years of experience architecting distributed cloud systems and delightful web interfaces..."
                    value={summaryText}
                    onChange={e => setSummaryText(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none leading-relaxed shadow-[2px_2px_0px_0px_#121212]"
                  />
                  <span className="text-[10px] font-editorial-body italic text-[#121212]/60">
                    Tip: You can refine or adapt this summary per role branch anytime!
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: PRIMARY EXPERIENCE */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#946B12] block">
                    STEP 4: LATEST EXPERIENCE
                  </span>
                  <h3 className="font-serif-display text-2xl font-bold italic text-[#121212]">
                    Add your most recent position
                  </h3>
                  <p className="font-editorial-body text-xs text-[#121212]/80 italic">
                    Add bullet points highlighting quantifiable business and architectural impact.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stripe, Acme Corp, Stealth Startup"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] text-xs font-sans shadow-[2px_2px_0px_0px_#121212]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Job Title / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] text-xs font-sans shadow-[2px_2px_0px_0px_#121212]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Start Year / Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2022 or Jan 2022"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] text-xs font-sans shadow-[2px_2px_0px_0px_#121212]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                        End Date
                      </label>
                      <label className="flex items-center gap-1 text-[10px] font-sans cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isCurrentJob}
                          onChange={e => setIsCurrentJob(e.target.checked)}
                          className="accent-[#121212]"
                        />
                        <span>Current Job</span>
                      </label>
                    </div>
                    {!isCurrentJob && (
                      <input
                        type="text"
                        placeholder="e.g. 2024"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] text-xs font-sans shadow-[2px_2px_0px_0px_#121212]"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212] block">
                    Achievement Bullets (Action Verb + Scope + Metric)
                  </label>
                  <input
                    type="text"
                    placeholder="• Architected microservices reducing p99 response times by 35%."
                    value={bullet1}
                    onChange={e => setBullet1(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] text-xs font-sans shadow-[1px_1px_0px_0px_#121212]"
                  />
                  <input
                    type="text"
                    placeholder="• Led migration to modern React/TypeScript stack across 12 product modules."
                    value={bullet2}
                    onChange={e => setBullet2(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] text-xs font-sans shadow-[1px_1px_0px_0px_#121212]"
                  />
                  <input
                    type="text"
                    placeholder="• Mentored 4 engineers and instituted comprehensive automated testing coverage."
                    value={bullet3}
                    onChange={e => setBullet3(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#121212] text-xs font-sans shadow-[1px_1px_0px_0px_#121212]"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: CORE SKILLS & SUPERPOWERS */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#946B12] block">
                    STEP 5: SKILLS & TECHNOLOGIES
                  </span>
                  <h3 className="font-serif-display text-2xl font-bold italic text-[#121212]">
                    What technologies do you use?
                  </h3>
                  <p className="font-editorial-body text-xs text-[#121212]/80 italic">
                    Comma-separated lists of your primary programming languages, frameworks, and infrastructure tools.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Languages & Core
                    </label>
                    <input
                      type="text"
                      value={languagesInput}
                      onChange={e => setLanguagesInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-mono text-[#121212] shadow-[2px_2px_0px_0px_#121212]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Frameworks & Libraries
                    </label>
                    <input
                      type="text"
                      value={frameworksInput}
                      onChange={e => setFrameworksInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-mono text-[#121212] shadow-[2px_2px_0px_0px_#121212]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#121212]">
                      Tools & Cloud Infrastructure
                    </label>
                    <input
                      type="text"
                      value={toolsInput}
                      onChange={e => setToolsInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-mono text-[#121212] shadow-[2px_2px_0px_0px_#121212]"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-[#F4F1EA] border border-[#121212] shadow-[2px_2px_0px_0px_#121212] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#264634] shrink-0" />
                  <p className="text-xs font-editorial-body italic text-[#121212]">
                    Ready to build your workspace centered on <strong>{fullName || 'Your Profile'}</strong>!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="px-6 py-4 border-t border-[#121212] bg-[#F4F1EA] flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStep > 1) setCurrentStep(prev => prev - 1);
              }}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider border border-[#121212] transition-all ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed bg-[#FAF8F5]'
                  : 'bg-[#FAF8F5] hover:bg-[#EAE6DC] text-[#121212] shadow-[2px_2px_0px_0px_#121212]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-5 py-1.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-wider border border-[#121212] shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2 bg-[#264634] hover:bg-[#1D3628] text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-wider border border-[#121212] shadow-[3px_3px_0px_0px_#121212] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Initialize My ResumeFlow &rarr;</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
