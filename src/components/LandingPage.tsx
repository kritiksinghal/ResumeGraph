import React, { useState } from 'react';
import { ResumeFlowBottomAnimation } from './ResumeFlowBottomAnimation';
import {
  Sparkles,
  GitBranch,
  GitCommit,
  GitMerge,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  BookOpen,
  Briefcase,
  ShieldCheck,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Cpu,
  Star,
  Globe,
  Sliders,
  Play
} from 'lucide-react';
import { MilestoneId } from '../config/milestone';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onGoogleSignIn: () => void;
  onExploreSample: () => void;
  onOpenResearch: () => void;
  milestone?: MilestoneId;
  onOpenMilestoneInfo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onGoogleSignIn,
  onExploreSample,
  onOpenResearch,
  milestone = 'showcase-1',
  onOpenMilestoneInfo
}) => {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'branch' | 'diff' | 'ats'>('branch');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#121212] flex flex-col selection:bg-[#121212] selection:text-[#F4F1EA]">
      {/* Masthead Header */}
      <header className="border-b border-[#121212] bg-[#FAF8F5] px-4 md:px-8 py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#121212] text-[#F4F1EA] shadow-[2px_2px_0px_0px_#121212]">
              <GitBranch className="w-5 h-5 text-[#FAF8F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[8px] font-bold uppercase tracking-[0.3em] text-[#121212]/60">
                  EST. 2026 // EDITION I
                </span>
                {onOpenMilestoneInfo && (
                  <button
                    onClick={onOpenMilestoneInfo}
                    className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-[#264634] text-[#FAF8F5] font-semibold tracking-wider hover:bg-[#1b3225] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Layers className="w-2.5 h-2.5 text-[#E5C378]" />
                    <span>Showcase 1 Demo</span>
                  </button>
                )}
              </div>
              <h1 className="font-serif-display text-xl font-bold tracking-tight text-[#121212]">
                ResumeFlow
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenMilestoneInfo && (
              <button
                onClick={onOpenMilestoneInfo}
                className="hidden md:flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#264634] hover:text-[#121212] px-3 py-1.5 border border-[#264634]/40 hover:border-[#121212] bg-[#FAF8F5] transition-all shadow-[1px_1px_0px_0px_#121212] cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#264634]" />
                <span>Milestone Scope</span>
              </button>
            )}

            <button
              onClick={onOpenResearch}
              className="hidden sm:flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#121212]/80 hover:text-[#121212] px-3 py-1.5 border border-[#121212]/30 hover:border-[#121212] bg-[#FAF8F5] transition-all shadow-[1px_1px_0px_0px_#121212]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Research Thesis</span>
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#121212] bg-[#FAF8F5] hover:bg-[#EAE6DC] px-3.5 py-1.5 border border-[#121212] transition-all shadow-[2px_2px_0px_0px_#121212] cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In</span>
            </button>

            <button
              onClick={onStartOnboarding}
              className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#F4F1EA] bg-[#121212] hover:bg-[#2A2A2A] px-4 py-1.5 border border-[#121212] transition-all shadow-[2px_2px_0px_0px_#121212] cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-[#121212] bg-[#F4F1EA] py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF8F5] border border-[#121212] shadow-[2px_2px_0px_0px_#121212]">
            <span className="w-2 h-2 rounded-full bg-[#264634] animate-pulse" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#121212]">
              The Semantic Career Evolution Engine
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#121212] leading-[1.1] max-w-4xl mx-auto">
            Stop renaming files <span className="italic font-normal underline decoration-[#946B12] decoration-2">resume_final_v3.pdf</span>.
            <br />
            Branch your career like code.
          </h2>

          {/* Subheading */}
          <p className="font-editorial-body text-base sm:text-lg md:text-xl text-[#121212]/80 max-w-2xl mx-auto italic leading-relaxed">
            One master career truth. Specialized role branches (AI/ML, Systems, Management).
            Grounded ATS keyword alignment without hallucinations, and 4-level semantic diffing.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              onClick={onStartOnboarding}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#121212] text-[#F4F1EA] hover:bg-[#2A2A2A] font-sans font-bold text-xs uppercase tracking-[0.15em] border border-[#121212] shadow-[4px_4px_0px_0px_#121212] flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-y-[-1px]"
            >
              <span>Build My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoogleSignIn}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#FAF8F5] text-[#121212] hover:bg-[#EAE6DC] font-sans font-bold text-xs uppercase tracking-[0.15em] border border-[#121212] shadow-[4px_4px_0px_0px_#121212] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={onExploreSample}
              className="text-xs font-editorial-body italic text-[#121212]/70 hover:text-[#121212] underline decoration-[#121212]/40 hover:decoration-[#121212]"
            >
              Or explore with pre-loaded Staff Systems Engineer sample data &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Feature Deep-Dive */}
      <section className="border-b border-[#121212] bg-[#FAF8F5] py-14 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block">
              THREE CORE ARCHITECTURAL PILLARS
            </span>
            <h3 className="font-serif-display text-3xl font-bold italic text-[#121212]">
              Engineered for Precision Career Management
            </h3>
          </div>

          {/* Interactive Switcher */}
          <div className="flex justify-center border-b border-[#121212]">
            <div className="inline-flex gap-1">
              <button
                onClick={() => setActiveInteractiveTab('branch')}
                className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-t border-l border-r border-[#121212] transition-all ${
                  activeInteractiveTab === 'branch'
                    ? 'bg-[#121212] text-[#F4F1EA] translate-y-[1px]'
                    : 'bg-[#F4F1EA] text-[#121212] hover:bg-[#FAF8F5]'
                }`}
              >
                1. Role Branching (DAG)
              </button>
              <button
                onClick={() => setActiveInteractiveTab('ats')}
                className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-t border-l border-r border-[#121212] transition-all ${
                  activeInteractiveTab === 'ats'
                    ? 'bg-[#121212] text-[#F4F1EA] translate-y-[1px]'
                    : 'bg-[#F4F1EA] text-[#121212] hover:bg-[#FAF8F5]'
                }`}
              >
                2. Grounded ATS AI
              </button>
              <button
                onClick={() => setActiveInteractiveTab('diff')}
                className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-t border-l border-r border-[#121212] transition-all ${
                  activeInteractiveTab === 'diff'
                    ? 'bg-[#121212] text-[#F4F1EA] translate-y-[1px]'
                    : 'bg-[#F4F1EA] text-[#121212] hover:bg-[#FAF8F5]'
                }`}
              >
                3. 4-Level Semantic Diff
              </button>
            </div>
          </div>

          {/* Tab 1: Role Branching */}
          {activeInteractiveTab === 'branch' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] text-[#F4F1EA] text-[9px] font-mono font-bold uppercase">
                  <GitBranch className="w-3 h-3 text-[#FAF8F5]" />
                  <span>Semantic Branching</span>
                </div>
                <h4 className="font-serif-display text-2xl font-bold italic text-[#121212]">
                  Target 5 Different Roles Without 5 Different Files
                </h4>
                <p className="font-editorial-body text-sm text-[#121212]/80 leading-relaxed italic">
                  Create dedicated branches for distinct role profiles (e.g. Distributed Systems vs. ML Engineering vs. Engineering Manager).
                  Each branch adapts bullet phrasing and tech highlights while maintaining shared master credentials.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>Single source of truth in <code>main</code> branch</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>3-way AST merge brings specialized wins back to master</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>Exact version commits with rollback checkpoints</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#121212] p-5 shadow-[6px_6px_0px_0px_#121212] space-y-3">
                <div className="flex items-center justify-between border-b border-[#121212] pb-2">
                  <span className="font-mono text-[10px] font-bold uppercase text-[#121212]">
                    active-tracks // visual tree
                  </span>
                  <span className="font-sans text-[10px] px-2 py-0.5 bg-[#264634] text-[#F4F1EA] font-bold">
                    3 Active Tracks
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-2.5 bg-[#F4F1EA] border border-[#121212] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#121212] rounded-full" />
                      <span className="font-bold">main (Master Truth)</span>
                    </div>
                    <span className="text-[10px] text-[#121212]/60">v3 (3 mins ago)</span>
                  </div>

                  <div className="pl-6 border-l-2 border-[#121212] space-y-2">
                    <div className="p-2.5 bg-[#FAF8F5] border border-[#121212] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#264634] rounded-full" />
                        <span className="font-bold text-[#264634]">aiml-specialist</span>
                      </div>
                      <span className="text-[10px] bg-[#264634]/10 text-[#264634] px-1.5 py-0.5 font-bold">
                        94% ATS Match
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#FAF8F5] border border-[#121212] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#946B12] rounded-full" />
                        <span className="font-bold text-[#946B12]">backend-systems</span>
                      </div>
                      <span className="text-[10px] bg-[#946B12]/10 text-[#946B12] px-1.5 py-0.5 font-bold">
                        88% ATS Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Grounded ATS AI */}
          {activeInteractiveTab === 'ats' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] text-[#F4F1EA] text-[9px] font-mono font-bold uppercase">
                  <Sparkles className="w-3 h-3 text-[#946B12]" />
                  <span>Anti-Hallucination AI</span>
                </div>
                <h4 className="font-serif-display text-2xl font-bold italic text-[#121212]">
                  Paste Any Job Description. Get Grounded Alignment.
                </h4>
                <p className="font-editorial-body text-sm text-[#121212]/80 leading-relaxed italic">
                  Unlike generic AI chatbots that invent fake companies or unverifiable claims, ResumeFlow uses strict evidence anchors.
                  It highlights keyword gaps and suggests incremental bullet improvements verified by your real experiences.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>Exact keyword coverage vs semantic skill parity</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>Accept or reject suggestions with 1-click preview</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>Zero whole-document destructive rewrites</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#121212] p-5 shadow-[6px_6px_0px_0px_#121212] space-y-3">
                <div className="flex items-center justify-between border-b border-[#121212] pb-2">
                  <span className="font-mono text-[10px] font-bold uppercase text-[#121212]">
                    ATS MATCH RADAR // TARGET: STAFF DISTRIBUTED SYSTEMS
                  </span>
                  <span className="font-mono text-xs font-bold text-[#264634]">
                    Match Score: 88%
                  </span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-[#264634] text-[#F4F1EA] text-[10px] font-bold">
                      ✓ Kafka (+3 hits)
                    </span>
                    <span className="px-2 py-0.5 bg-[#264634] text-[#F4F1EA] text-[10px] font-bold">
                      ✓ Kubernetes (+5 hits)
                    </span>
                    <span className="px-2 py-0.5 bg-[#264634] text-[#F4F1EA] text-[10px] font-bold">
                      ✓ Distributed Tracing (+2 hits)
                    </span>
                    <span className="px-2 py-0.5 bg-[#8B261D] text-[#F4F1EA] text-[10px] font-bold">
                      ✗ gRPC (Missing in bullets)
                    </span>
                  </div>

                  <div className="p-3 bg-[#F4F1EA] border border-[#121212] space-y-1.5 mt-2">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#946B12] block">
                      AI Suggested Incremental Bullet Improvement:
                    </span>
                    <p className="font-editorial-body text-xs italic text-[#121212]">
                      "Architected low-latency microservices with <mark className="bg-[#FAF8F5] px-1 font-bold border border-[#121212]/30">gRPC</mark> and Kafka, processing 140K req/s with 99.99% availability."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Semantic Diff */}
          {activeInteractiveTab === 'diff' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] text-[#F4F1EA] text-[9px] font-mono font-bold uppercase">
                  <Layers className="w-3 h-3 text-[#FAF8F5]" />
                  <span>4-Level Diffing</span>
                </div>
                <h4 className="font-serif-display text-2xl font-bold italic text-[#121212]">
                  Visual Proof of Every Evolution Step
                </h4>
                <p className="font-editorial-body text-sm text-[#121212]/80 leading-relaxed italic">
                  Forget line-based git diffs that choke on formatting. Our 4-level diff understands Resume Entities:
                  Sections, Roles, Metrics, and Semantic Intent.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>Level 1: Section structural additions & removals</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>Level 2: Job & Project entity tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#264634]" />
                    <span>Level 4: Semantic shift analysis (e.g. IC to Lead)</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#121212] p-5 shadow-[6px_6px_0px_0px_#121212] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#121212] pb-2">
                  <span className="font-bold uppercase text-[#121212]">
                    DIFF: v1-initial &rarr; v2-distributed-focus
                  </span>
                  <span className="text-[10px] text-[#264634] font-bold">
                    +4 Bullets | ~2 Techs Modified
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 bg-[#8B261D]/10 border-l-4 border-[#8B261D] text-[#8B261D]">
                    - Built backend server using Node.js and REST APIs.
                  </div>
                  <div className="p-2 bg-[#264634]/10 border-l-4 border-[#264634] text-[#264634]">
                    + Architected fault-tolerant streaming microservices handling 450M daily events with Kafka and Go.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="border-b border-[#121212] bg-[#F4F1EA] py-14 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#121212]/60 block">
              PARADIGM COMPARISON
            </span>
            <h3 className="font-serif-display text-3xl font-bold italic text-[#121212]">
              Why Traditional Resumes Fail Modern Engineers
            </h3>
          </div>

          <div className="overflow-x-auto border border-[#121212] shadow-[6px_6px_0px_0px_#121212]">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#121212] text-[#F4F1EA] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3.5 border-r border-[#FAF8F5]/20">Dimension</th>
                  <th className="p-3.5 border-r border-[#FAF8F5]/20">Google Docs / Word</th>
                  <th className="p-3.5 border-r border-[#FAF8F5]/20">Generic AI Chatbots</th>
                  <th className="p-3.5 bg-[#264634] text-[#FAF8F5]">ResumeFlow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#121212]/20 bg-[#FAF8F5]">
                <tr>
                  <td className="p-3.5 font-bold text-[#121212]">Multiple Target Roles</td>
                  <td className="p-3.5 text-[#121212]/70">Mess of 15 copy-pasted files</td>
                  <td className="p-3.5 text-[#121212]/70">Lost in transient chat sessions</td>
                  <td className="p-3.5 font-bold text-[#264634]">Git-Style Role Branches (DAG)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#121212]">Safety & Truth</td>
                  <td className="p-3.5 text-[#121212]/70">Manual truth check</td>
                  <td className="p-3.5 text-[#8B261D] font-bold">High hallucination danger</td>
                  <td className="p-3.5 font-bold text-[#264634]">Grounded Evidence Anchoring</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#121212]">Evolution Tracking</td>
                  <td className="p-3.5 text-[#121212]/70">Vague file timestamps</td>
                  <td className="p-3.5 text-[#121212]/70">None</td>
                  <td className="p-3.5 font-bold text-[#264634]">4-Level Semantic Diff</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#121212]">Outcome Feedback</td>
                  <td className="p-3.5 text-[#121212]/70">Disconnected spreadsheet</td>
                  <td className="p-3.5 text-[#121212]/70">None</td>
                  <td className="p-3.5 font-bold text-[#264634]">Integrated Kanban & Yield Analytics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-[#121212] text-[#F4F1EA] py-14 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="font-serif-display text-3xl sm:text-4xl font-bold italic">
            Ready to Take Control of Your Career Narrative?
          </h3>
          <p className="font-editorial-body text-base text-[#F4F1EA]/80 italic max-w-xl mx-auto leading-relaxed">
            Begin with a clean personalized setup. Step-by-step guidance, no clutter, zero confusion.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartOnboarding}
              className="px-6 py-3.5 bg-[#FAF8F5] text-[#121212] hover:bg-white font-sans font-bold text-xs uppercase tracking-[0.15em] border border-[#FAF8F5] shadow-[4px_4px_0px_0px_#FAF8F5] flex items-center gap-2 cursor-pointer transition-all hover:translate-y-[-1px]"
            >
              <span>Start Personal Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoogleSignIn}
              className="px-5 py-3.5 bg-transparent text-[#FAF8F5] hover:bg-[#2A2A2A] font-sans font-bold text-xs uppercase tracking-[0.15em] border border-[#FAF8F5]/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Sign In with Google</span>
            </button>
          </div>
        </div>
      </section>

      {/* Luminous Animated Flow Banner with "resumeflow" */}
      <ResumeFlowBottomAnimation
        onStartOnboarding={onStartOnboarding}
        onExploreSample={onExploreSample}
      />

      {/* Sign-In Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF8F5] border border-[#121212] w-full max-w-md p-6 shadow-[8px_8px_0px_0px_#121212] space-y-5">
            <div className="flex items-center justify-between border-b border-[#121212] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#121212] text-[#F4F1EA]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display font-bold text-lg italic text-[#121212]">
                  Welcome to ResumeFlow
                </h3>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-[#121212] hover:opacity-60 text-xs font-bold font-mono"
              >
                [ESC]
              </button>
            </div>

            <p className="font-editorial-body text-xs text-[#121212]/80 italic">
              Choose your preferred login method to save and sync your resume branches.
            </p>

            <div className="space-y-3">
              {/* Google Button */}
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  onGoogleSignIn();
                }}
                className="w-full py-3 px-4 bg-[#FAF8F5] hover:bg-[#EAE6DC] border border-[#121212] text-[#121212] font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[2px_2px_0px_0px_#121212] cursor-pointer transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-[1px] bg-[#121212]/20" />
                <span className="text-[10px] font-mono text-[#121212]/50 uppercase">or email</span>
                <div className="flex-1 h-[1px] bg-[#121212]/20" />
              </div>

              {/* Email Form */}
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email (e.g. jane@example.com)"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#121212] text-xs font-sans text-[#121212] focus:outline-none shadow-[2px_2px_0px_0px_#121212]"
                />
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    onStartOnboarding();
                  }}
                  className="w-full py-2.5 bg-[#121212] hover:bg-[#2A2A2A] text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-wider border border-[#121212] shadow-[2px_2px_0px_0px_#121212] cursor-pointer"
                >
                  Continue to Personal Setup &rarr;
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  onExploreSample();
                }}
                className="text-[11px] font-editorial-body italic text-[#121212]/70 hover:text-[#121212] underline"
              >
                Or skip and explore demo workspace directly
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
