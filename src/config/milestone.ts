export type MilestoneId = 'showcase-1' | 'full';

export interface MilestoneFeature {
  id: string;
  name: string;
  description: string;
  tier: 'showcase-1' | 'showcase-2' | 'showcase-3';
  isCoreInShowcase1: boolean;
}

export const MILESTONE_FEATURES: Record<string, MilestoneFeature> = {
  masterProfile: {
    id: 'masterProfile',
    name: 'Canonical Master Profile',
    description: 'Structured single source of truth for all career accomplishments with local storage persistence.',
    tier: 'showcase-1',
    isCoreInShowcase1: true,
  },
  liveEditor: {
    id: 'liveEditor',
    name: 'Editorial Resume Editor',
    description: 'Structured modular editor with real-time validation, section reordering, and rich typography.',
    tier: 'showcase-1',
    isCoreInShowcase1: true,
  },
  resumePreview: {
    id: 'resumePreview',
    name: 'Paper-Grade Resume Preview & LaTeX/PDF Export',
    description: 'Print-perfect typography preview with instant client-side LaTeX source and PDF rendering.',
    tier: 'showcase-1',
    isCoreInShowcase1: true,
  },
  atsScoring: {
    id: 'atsScoring',
    name: 'Real-Time ATS Keyword Engine',
    description: 'Instant keyword matching, density scoring, and job description alignment analyzer.',
    tier: 'showcase-1',
    isCoreInShowcase1: true,
  },
  canvasMotion: {
    id: 'canvasMotion',
    name: 'HTML5 Canvas Ribbon Wave Simulation',
    description: 'Harmonic physics-driven laser ribbon background on dark obsidian/warm paper backdrop.',
    tier: 'showcase-1',
    isCoreInShowcase1: true,
  },
  dagVisualizer: {
    id: 'dagVisualizer',
    name: 'DAG Career Branch Visualizer',
    description: 'Interactive Directed Acyclic Graph tracking divergent career tracks and snapshot commits.',
    tier: 'showcase-2',
    isCoreInShowcase1: false,
  },
  semanticDiff: {
    id: 'semanticDiff',
    name: '4-Level Semantic AST Diff Engine',
    description: 'Deterministic AST comparison across entity, bullet, metric, and token layers.',
    tier: 'showcase-2',
    isCoreInShowcase1: false,
  },
  semanticMerge: {
    id: 'semanticMerge',
    name: '3-Way Semantic Branch Merging',
    description: 'Conflict-free merge algorithms reconciling divergent resume tracks back into master.',
    tier: 'showcase-3',
    isCoreInShowcase1: false,
  },
  appTracker: {
    id: 'appTracker',
    name: 'Application Pipeline Kanban',
    description: 'End-to-end job submission tracker linking specific commit hashes to company applications.',
    tier: 'showcase-2',
    isCoreInShowcase1: false,
  },
  analyticsDashboard: {
    id: 'analyticsDashboard',
    name: 'Trajectory & Keyword Analytics',
    description: 'Comprehensive historical charts and keyword distribution across resume iterations.',
    tier: 'showcase-2',
    isCoreInShowcase1: false,
  },
};

export const MILESTONE_METADATA = {
  'showcase-1': {
    id: 'showcase-1' as const,
    badge: 'Showcase 1 Demo',
    title: 'Showcase 1: Canonical Master & Editorial Engine',
    subtitle: 'Core client-side resume authoring, real-time ATS scoring, canvas ribbons, and LaTeX/PDF export.',
    description:
      'This demo showcases the foundational single-source profile system, live editorial rendering, client-side exports, and ATS keyword engine. Advanced version control (DAG branch graphs, 4-level AST diffing, 3-way merge) is gated for subsequent milestones.',
  },
  'full': {
    id: 'full' as const,
    badge: 'Full Suite (All Milestones Unlocked)',
    title: 'Full Version-Control Suite',
    subtitle: 'All version control paradigms: Multi-branch DAG, 4-level semantic diff, 3-way merge, and tracker.',
    description:
      'Complete career document calculus featuring Git-like branching, commit trees, AST diffing, merge resolution, and application tracking.',
  }
};
