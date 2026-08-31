import React from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePreview } from './components/ResumePreview';
import { SemanticDiffViewer } from './components/SemanticDiffViewer';
import { SemanticMergeModal } from './components/SemanticMergeModal';
import { JdOptimizerModal } from './components/JdOptimizerModal';
import { VersionTreeModal } from './components/VersionTreeModal';
import { BranchManagerModal } from './components/BranchManagerModal';
import { CommitModal } from './components/CommitModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ResearchInsightsModal } from './components/ResearchInsightsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { GuidedStepBanner } from './components/GuidedStepBanner';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { RobotCompanion } from './components/RobotCompanion';
import { MilestoneGateCard } from './components/MilestoneGateCard';
import { MilestoneInfoModal } from './components/MilestoneInfoModal';
import { MilestoneId, MILESTONE_FEATURES } from './config/milestone';

import {
  ResumeData,
  ResumeBranch,
  ResumeVersion,
  JobApplication
} from './types/resume';
import {
  INITIAL_BRANCHES,
  INITIAL_VERSIONS,
  INITIAL_APPLICATIONS,
  MASTER_RESUME_DATA
} from './data/initialData';

export default function App() {
  // App Mode: 'landing' | 'onboarding' | 'workspace'
  const [appMode, setAppMode] = React.useState<'landing' | 'onboarding' | 'workspace'>(() => {
    const hasOnboarded = localStorage.getItem('resumeflow_has_profile');
    return hasOnboarded === 'true' ? 'workspace' : 'landing';
  });

  // Milestone Gating State: 'showcase-1' | 'full'
  const [milestone, setMilestone] = React.useState<MilestoneId>(() => {
    const savedMilestone = localStorage.getItem('resumeflow_milestone');
    return (savedMilestone === 'full' ? 'full' : 'showcase-1') as MilestoneId;
  });
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = React.useState(false);

  // Sync Milestone to LocalStorage
  React.useEffect(() => {
    localStorage.setItem('resumeflow_milestone', milestone);
  }, [milestone]);

  // State Initialization from LocalStorage or Defaults
  const [branches, setBranches] = React.useState<ResumeBranch[]>(() => {
    const saved = localStorage.getItem('resumeflow_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [versions, setVersions] = React.useState<ResumeVersion[]>(() => {
    const saved = localStorage.getItem('resumeflow_versions');
    return saved ? JSON.parse(saved) : INITIAL_VERSIONS;
  });

  const [applications, setApplications] = React.useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('resumeflow_apps');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [currentBranchId, setCurrentBranchId] = React.useState<string>('main');

  // Guided step index (0 to 4)
  const [guidedStep, setGuidedStep] = React.useState<number>(0);

  // Find head version of the active branch
  const currentBranch = branches.find(b => b.id === currentBranchId) || branches[0];
  const branchVersions = versions.filter(v => v.branchId === currentBranch.id);
  const headVersion =
    branchVersions.length > 0 ? branchVersions[branchVersions.length - 1] : versions[0];

  const [currentVersionId, setCurrentVersionId] = React.useState<string>(headVersion.id);

  // Draft Resume in Editor
  const [draftResume, setDraftResume] = React.useState<ResumeData>(() => {
    const savedResume = localStorage.getItem('resumeflow_draft_resume');
    return savedResume ? JSON.parse(savedResume) : JSON.parse(JSON.stringify(headVersion.resumeData));
  });

  // Active View Tab inside Workspace
  const [activeView, setActiveView] = React.useState<
    'editor' | 'preview' | 'diff' | 'tracker' | 'analytics'
  >('editor');

  // Modals Visibility
  const [isVersionTreeOpen, setIsVersionTreeOpen] = React.useState(false);
  const [isCommitModalOpen, setIsCommitModalOpen] = React.useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = React.useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = React.useState(false);
  const [isBranchManagerOpen, setIsBranchManagerOpen] = React.useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = React.useState(false);
  const [isOnboardingGuideOpen, setIsOnboardingGuideOpen] = React.useState(false);

  // Sync to LocalStorage
  React.useEffect(() => {
    localStorage.setItem('resumeflow_branches', JSON.stringify(branches));
  }, [branches]);

  React.useEffect(() => {
    localStorage.setItem('resumeflow_versions', JSON.stringify(versions));
  }, [versions]);

  React.useEffect(() => {
    localStorage.setItem('resumeflow_apps', JSON.stringify(applications));
  }, [applications]);

  React.useEffect(() => {
    localStorage.setItem('resumeflow_draft_resume', JSON.stringify(draftResume));
  }, [draftResume]);

  // When completing the personalized onboarding wizard
  const handleCompleteOnboardingWizard = (userResume: ResumeData, targetRoleBranch: string) => {
    const authorName = userResume.profile.fullName || 'Candidate';
    const mainBranch: ResumeBranch = {
      id: 'main',
      name: 'main',
      displayName: 'Master Source of Truth',
      targetRole: userResume.profile.title || 'Master Profile',
      color: '#121212',
      createdAt: new Date().toISOString(),
      headVersionId: 'v1-initial',
      description: 'The master career record containing all verified accomplishments.'
    };

    const cleanBranchName = targetRoleBranch.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    const roleBranch: ResumeBranch = {
      id: `branch-${cleanBranchName}`,
      name: cleanBranchName || 'specialized-track',
      displayName: targetRoleBranch,
      targetRole: targetRoleBranch,
      color: '#264634',
      createdAt: new Date().toISOString(),
      headVersionId: 'v1-initial',
      description: `Specialized career track targeting ${targetRoleBranch} positions.`
    };

    const initialCommit: ResumeVersion = {
      id: 'v1-initial',
      branchId: 'main',
      parentVersionIds: [],
      timestamp: new Date().toISOString(),
      author: authorName,
      commitMessage: 'Initial commit: Personalized career master initialized',
      changeSummary: [
        'Created candidate profile record',
        'Initialized master skills and experience entries',
        `Configured initial ${targetRoleBranch} track`
      ],
      changeCategory: 'initial',
      resumeData: userResume,
      tags: ['root', 'initial-snapshot']
    };

    const initialApp: JobApplication = {
      id: `app-${Date.now()}`,
      company: 'Target Company',
      role: targetRoleBranch,
      branchId: roleBranch.id,
      versionId: 'v1-initial',
      resumeVersionId: 'v1-initial',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Saved',
      matchScore: 86,
      notes: 'Initial target application created during onboarding',
      timeline: [
        {
          status: 'Saved',
          date: new Date().toISOString().split('T')[0],
          note: 'Created during personalized onboarding'
        }
      ]
    };

    setBranches([mainBranch, roleBranch]);
    setVersions([initialCommit]);
    setApplications([initialApp]);
    setCurrentBranchId('main');
    setCurrentVersionId('v1-initial');
    setDraftResume(userResume);

    localStorage.setItem('resumeflow_has_profile', 'true');
    setAppMode('workspace');
    setActiveView('editor');
    setGuidedStep(0);

    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if canvas confetti not available
    }
  };

  // Google Sign-In simulation (fast setup with real user metadata if present)
  const handleGoogleSignIn = () => {
    setAppMode('onboarding');
  };

  // Switch to Staff Systems Sample Data
  const handleLoadSampleData = () => {
    setBranches(INITIAL_BRANCHES);
    setVersions(INITIAL_VERSIONS);
    setApplications(INITIAL_APPLICATIONS);
    setCurrentBranchId('main');
    setCurrentVersionId('v1');
    setDraftResume(JSON.parse(JSON.stringify(MASTER_RESUME_DATA)));
    localStorage.setItem('resumeflow_has_profile', 'true');
    setAppMode('workspace');
    setActiveView('editor');
    setGuidedStep(0);
  };

  // When branch changes, load its head version into editor
  const handleSelectBranch = (branchId: string) => {
    setCurrentBranchId(branchId);
    const targetBranch = branches.find(b => b.id === branchId) || branches[0];
    const bVersions = versions.filter(v => v.branchId === targetBranch.id);
    const bHead = bVersions.length > 0 ? bVersions[bVersions.length - 1] : versions[0];
    setCurrentVersionId(bHead.id);
    setDraftResume(JSON.parse(JSON.stringify(bHead.resumeData)));
  };

  // Check if draft has uncommitted changes compared to current loaded version
  const currentLoadedVersion =
    versions.find(v => v.id === currentVersionId) || headVersion;
  const hasUncommittedChanges =
    JSON.stringify(draftResume) !== JSON.stringify(currentLoadedVersion.resumeData);

  // Checkout historic version
  const handleCheckoutVersion = (version: ResumeVersion) => {
    setCurrentBranchId(version.branchId);
    setCurrentVersionId(version.id);
    setDraftResume(JSON.parse(JSON.stringify(version.resumeData)));
  };

  // Rollback to version by creating a new commit on active branch
  const handleRollbackToVersion = (version: ResumeVersion) => {
    const rollbackVersionId = `v${versions.length + 1}-restore`;
    const newVersion: ResumeVersion = {
      id: rollbackVersionId,
      branchId: currentBranchId,
      parentVersionIds: [headVersion.id],
      timestamp: new Date().toISOString(),
      author: draftResume.profile.fullName || 'Candidate',
      commitMessage: `Rollback: Restored document state to snapshot ${version.id}`,
      changeSummary: [
        `Reverted all sections to match commit ${version.id}`,
        `Original commit message: "${version.commitMessage}"`
      ],
      changeCategory: 'refactor',
      resumeData: JSON.parse(JSON.stringify(version.resumeData)),
      tags: ['rollback', `reverted-to-${version.id}`]
    };

    setVersions(prev => [...prev, newVersion]);
    setCurrentVersionId(newVersion.id);
    setDraftResume(JSON.parse(JSON.stringify(newVersion.resumeData)));
  };

  // Create new branch from existing version
  const handleCreateBranchFromVersion = (version: ResumeVersion) => {
    const newBranchId = `branch-${Date.now()}`;
    const newBranch: ResumeBranch = {
      id: newBranchId,
      name: `${version.branchId}-fork-${version.id}`,
      displayName: `Fork of ${version.branchId} (${version.id})`,
      targetRole: 'Specialized Track',
      color: '#946B12',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      headVersionId: version.id,
      description: `Forked from snapshot ${version.id}`
    };

    setBranches(prev => [...prev, newBranch]);
    setCurrentBranchId(newBranch.id);
    setCurrentVersionId(version.id);
    setDraftResume(JSON.parse(JSON.stringify(version.resumeData)));
  };

  // Create new commit from draft
  const handleCommit = (newVersion: ResumeVersion) => {
    setVersions(prev => [...prev, newVersion]);
    setBranches(prev =>
      prev.map(b => (b.id === currentBranchId ? { ...b, headVersionId: newVersion.id } : b))
    );
    setCurrentVersionId(newVersion.id);
    setDraftResume(JSON.parse(JSON.stringify(newVersion.resumeData)));
  };

  // Complete semantic merge
  const handleCompleteMerge = (newVersion: ResumeVersion, targetBranchId: string) => {
    setVersions(prev => [...prev, newVersion]);
    setBranches(prev =>
      prev.map(b => (b.id === targetBranchId ? { ...b, headVersionId: newVersion.id } : b))
    );
    setCurrentBranchId(targetBranchId);
    setCurrentVersionId(newVersion.id);
    setDraftResume(JSON.parse(JSON.stringify(newVersion.resumeData)));
  };

  // Apply suggestions from AI JD Optimizer
  const handleApplySuggestions = (updatedResume: ResumeData) => {
    setDraftResume(updatedResume);
  };

  // RENDER 1: Landing Page Mode
  if (appMode === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#121212]">
        <LandingPage
          onStartOnboarding={() => setAppMode('onboarding')}
          onGoogleSignIn={handleGoogleSignIn}
          onExploreSample={handleLoadSampleData}
          onOpenResearch={() => setIsResearchModalOpen(true)}
          milestone={milestone}
          onOpenMilestoneInfo={() => setIsMilestoneModalOpen(true)}
        />

        {/* Cursor Following Robot Scribe Companion */}
        <RobotCompanion
          userName={draftResume.profile.fullName || 'there'}
          currentView="landing"
          onOpenOnboarding={() => setAppMode('onboarding')}
        />

        <ResearchInsightsModal
          isOpen={isResearchModalOpen}
          onClose={() => setIsResearchModalOpen(false)}
        />

        <MilestoneInfoModal
          isOpen={isMilestoneModalOpen}
          onClose={() => setIsMilestoneModalOpen(false)}
          currentMilestone={milestone}
          onSelectMilestone={setMilestone}
        />
      </div>
    );
  }

  // RENDER 2: Multi-Step Personal Onboarding Wizard
  if (appMode === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#121212]">
        <OnboardingWizard
          onComplete={handleCompleteOnboardingWizard}
          onCancel={() => setAppMode('landing')}
          onUseSample={handleLoadSampleData}
        />

        {/* Cursor Following Robot Companion */}
        <RobotCompanion
          userName="there"
          currentView="onboarding"
        />

        <ResearchInsightsModal
          isOpen={isResearchModalOpen}
          onClose={() => setIsResearchModalOpen(false)}
        />

        <MilestoneInfoModal
          isOpen={isMilestoneModalOpen}
          onClose={() => setIsMilestoneModalOpen(false)}
          currentMilestone={milestone}
          onSelectMilestone={setMilestone}
        />
      </div>
    );
  }

  // RENDER 3: Main Workspace Mode
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#121212] font-sans selection:bg-[#121212] selection:text-[#F4F1EA]">
      {/* Top Main Navigation Header */}
      <Header
        userName={draftResume.profile.fullName || 'Candidate'}
        candidateTitle={draftResume.profile.title || 'Software Engineer'}
        branches={branches}
        currentBranch={currentBranch}
        currentVersion={currentLoadedVersion}
        onSelectBranch={handleSelectBranch}
        onOpenCommitModal={() => {
          setGuidedStep(2);
          setIsCommitModalOpen(true);
        }}
        onOpenVersionTree={() => setIsVersionTreeOpen(true)}
        onOpenDiffModal={() => setActiveView('diff')}
        onOpenMergeModal={() => setIsMergeModalOpen(true)}
        onOpenJdModal={() => {
          setGuidedStep(1);
          setIsJdModalOpen(true);
        }}
        onOpenBranchManager={() => {
          setGuidedStep(3);
          setIsBranchManagerOpen(true);
        }}
        onOpenAnalytics={() => setActiveView('analytics')}
        onOpenTracker={() => setActiveView('tracker')}
        onOpenResearch={() => setIsResearchModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingGuideOpen(true)}
        onOpenOnboardingWizard={() => setAppMode('onboarding')}
        onNavigateLanding={() => setAppMode('landing')}
        onResetToSample={handleLoadSampleData}
        activeView={activeView}
        setActiveView={setActiveView}
        hasUncommittedChanges={hasUncommittedChanges}
        milestone={milestone}
        onOpenMilestoneModal={() => setIsMilestoneModalOpen(true)}
      />

      {/* Guided Step Progress Banner */}
      <GuidedStepBanner
        currentStep={guidedStep}
        onSelectStep={setGuidedStep}
        onOpenEditor={() => {
          setGuidedStep(0);
          setActiveView('editor');
        }}
        onOpenJdOptimizer={() => {
          setGuidedStep(1);
          setIsJdModalOpen(true);
        }}
        onOpenCommitModal={() => {
          setGuidedStep(2);
          setIsCommitModalOpen(true);
        }}
        onOpenBranchManager={() => {
          setGuidedStep(3);
          setIsBranchManagerOpen(true);
        }}
        onOpenPreview={() => {
          setGuidedStep(4);
          setActiveView('preview');
        }}
        onReopenTour={() => setIsOnboardingGuideOpen(true)}
        hasUncommittedChanges={hasUncommittedChanges}
        branchCount={branches.length}
        versionCount={versions.length}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'editor' && (
          <ResumeEditor
            resumeData={draftResume}
            onChange={setDraftResume}
            onOpenJdOptimizer={() => setIsJdModalOpen(true)}
          />
        )}

        {activeView === 'preview' && (
          <ResumePreview
            resumeData={draftResume}
            branchName={currentBranch.name}
            versionId={currentLoadedVersion.id}
          />
        )}

        {activeView === 'diff' &&
          (milestone === 'showcase-1' ? (
            <MilestoneGateCard
              feature={MILESTONE_FEATURES.semanticDiff}
              onUnlockMilestone={() => setMilestone('full')}
              onNavigateToCore={() => setActiveView('editor')}
            />
          ) : (
            <SemanticDiffViewer
              versions={versions}
              currentVersion={currentLoadedVersion}
            />
          ))}

        {activeView === 'tracker' &&
          (milestone === 'showcase-1' ? (
            <MilestoneGateCard
              feature={MILESTONE_FEATURES.appTracker}
              onUnlockMilestone={() => setMilestone('full')}
              onNavigateToCore={() => setActiveView('editor')}
            />
          ) : (
            <ApplicationTracker
              applications={applications}
              branches={branches}
              versions={versions}
              onUpdateApplication={updated =>
                setApplications(prev => prev.map(a => (a.id === updated.id ? updated : a)))
              }
              onAddApplication={newApp => setApplications(prev => [newApp, ...prev])}
              onDeleteApplication={appId =>
                setApplications(prev => prev.filter(a => a.id !== appId))
              }
              onViewVersion={versionId => {
                const targetVer = versions.find(v => v.id === versionId);
                if (targetVer) {
                  handleCheckoutVersion(targetVer);
                  setActiveView('preview');
                }
              }}
            />
          ))}

        {activeView === 'analytics' &&
          (milestone === 'showcase-1' ? (
            <MilestoneGateCard
              feature={MILESTONE_FEATURES.analyticsDashboard}
              onUnlockMilestone={() => setMilestone('full')}
              onNavigateToCore={() => setActiveView('editor')}
            />
          ) : (
            <AnalyticsDashboard
              versions={versions}
              branches={branches}
              applications={applications}
            />
          ))}
      </main>

      {/* Interactive Cursor Following Robot Scribe Companion in Workspace */}
      <RobotCompanion
        userName={draftResume.profile.fullName || 'Candidate'}
        currentView={activeView}
        activeBranch={currentBranch.name}
        onOpenJdModal={() => setIsJdModalOpen(true)}
        onOpenCommitModal={() => setIsCommitModalOpen(true)}
        onOpenBranchManager={() => setIsBranchManagerOpen(true)}
        onOpenOnboarding={() => setIsOnboardingGuideOpen(true)}
        onNavigateLanding={() => setAppMode('landing')}
      />

      {/* Modals */}
      <VersionTreeModal
        isOpen={isVersionTreeOpen}
        onClose={() => setIsVersionTreeOpen(false)}
        versions={versions}
        branches={branches}
        currentVersionId={currentVersionId}
        onCheckoutVersion={handleCheckoutVersion}
        onRollbackToVersion={handleRollbackToVersion}
        onCompareWithVersion={() => {
          setIsVersionTreeOpen(false);
          setActiveView('diff');
        }}
        onCreateBranchFromVersion={handleCreateBranchFromVersion}
      />

      <CommitModal
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        currentBranch={currentBranch}
        headVersion={headVersion}
        draftResumeData={draftResume}
        onCommit={handleCommit}
      />

      <SemanticMergeModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        branches={branches}
        currentBranch={currentBranch}
        versions={versions}
        onCompleteMerge={handleCompleteMerge}
      />

      <JdOptimizerModal
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        resumeData={draftResume}
        onApplySuggestions={handleApplySuggestions}
      />

      <BranchManagerModal
        isOpen={isBranchManagerOpen}
        onClose={() => setIsBranchManagerOpen(false)}
        branches={branches}
        currentBranchId={currentBranchId}
        versions={versions}
        onSelectBranch={handleSelectBranch}
        onCreateBranch={newBranch => {
          setBranches(prev => [...prev, newBranch]);
          handleSelectBranch(newBranch.id);
        }}
      />

      <ResearchInsightsModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingGuideOpen}
        onClose={() => setIsOnboardingGuideOpen(false)}
        onSelectOption={option => {
          setIsOnboardingGuideOpen(false);
          if (option === 'fresh') {
            setAppMode('onboarding');
          } else if (option === 'sample') {
            handleLoadSampleData();
          }
        }}
      />

      <MilestoneInfoModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        currentMilestone={milestone}
        onSelectMilestone={setMilestone}
      />
    </div>
  );
}
