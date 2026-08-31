export interface PersonalProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  customLinks?: { label: string; url: string }[];
}

export interface SummarySection {
  text: string;
  toneFocus?: string;
  highlights?: string[];
}

export interface ExperienceItem {
  id: string; // Stable entity identifier e.g. "exp-101"
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  techStack: string[];
  domain?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  role?: string;
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
  techStack: string[];
  metrics?: string[];
}

export interface SkillItem {
  name: string;
  level?: 'Expert' | 'Proficient' | 'Familiar';
  verifiedEvidence?: string; // Evidence anchor in projects/experience
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: SkillItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date?: string;
  metric?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  authors?: string[];
}

export interface ResumeData {
  id: string;
  versionId: string;
  branchId: string;
  profile: PersonalProfile;
  summary: SummarySection;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  publications: PublicationItem[];
  sectionOrder: string[];
  visibleSections: {
    summary: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
    certifications: boolean;
    achievements: boolean;
    publications: boolean;
  };
}

export interface ResumeBranch {
  id: string;
  name: string; // e.g. "master", "backend-eng", "aiml-specialist"
  displayName: string;
  color: string;
  description: string;
  targetRole: string;
  baseBranchId?: string;
  headVersionId: string;
  createdAt: string;
  updatedAt?: string;
  isDefault?: boolean;
}

export type CommitCategory = 'feat' | 'fix' | 'refactor' | 'ai-opt' | 'merge' | 'initial';

export interface ResumeVersion {
  id: string; // e.g. "v1", "v2", "v3", "v4-backend"
  branchId: string;
  parentVersionIds: string[]; // Supports multiple parents for merge nodes
  timestamp: string;
  author: string;
  commitMessage: string;
  changeSummary: string[];
  changeCategory: CommitCategory;
  resumeData: ResumeData;
  tags?: string[];
  isSnapshot?: boolean;
}

// 4-Level Semantic Diff Model
export interface DiffLevel1Section {
  sectionKey: string;
  sectionName: string;
  status: 'added' | 'removed' | 'modified' | 'unchanged';
  changeCount: number;
  summary: string;
}

export interface DiffLevel2Entity {
  sectionKey: string;
  entityId: string;
  title: string;
  status: 'added' | 'removed' | 'modified' | 'unchanged';
  description: string;
}

export interface DiffLevel3Attribute {
  sectionKey: string;
  entityTitle: string;
  attributeName: string;
  oldValue: string;
  newValue: string;
  type: 'text' | 'list_item_add' | 'list_item_remove' | 'tech_stack';
}

export interface DiffLevel4SemanticMeaning {
  sectionKey: string;
  interpretation: string;
  confidence: 'High' | 'Medium' | 'Low';
  impact: string;
  reasoning: string;
}

export interface SemanticDiffResult {
  fromVersionId: string;
  toVersionId: string;
  fromBranchName: string;
  toBranchName: string;
  level1_sections: DiffLevel1Section[];
  level2_entities: DiffLevel2Entity[];
  level3_attributes: DiffLevel3Attribute[];
  level4_semanticMeaning: DiffLevel4SemanticMeaning[];
  stats: {
    totalAdditions: number;
    totalDeletions: number;
    totalModifications: number;
    semanticShiftScore: number; // 0-100 score of narrative change
  };
}

// Semantic Merge & Conflict Model
export type ConflictType = 'duplicate' | 'contradictory_field' | 'conflicting_content' | 'summary_divergence';

export interface MergeConflictItem {
  id: string;
  sectionKey: string;
  entityId: string;
  title: string;
  type: ConflictType;
  description: string;
  sourceValue: any; // Changes coming from source branch
  targetValue: any; // Existing state in target branch
  baseValue?: any;   // Common ancestor state
  aiSuggestion?: {
    recommendation: 'accept_source' | 'accept_target' | 'synthesize';
    synthesizedValue?: any;
    rationale: string;
    confidence: number;
  };
  resolvedChoice: 'source' | 'target' | 'synthesize' | 'custom' | null;
  resolvedValue?: any;
  isResolved: boolean;
}

export interface MergeReport {
  sourceBranchId: string;
  targetBranchId: string;
  sourceVersionId: string;
  targetVersionId: string;
  baseVersionId?: string;
  canAutoMerge: boolean;
  autoMergedEntities: {
    sectionKey: string;
    entityId: string;
    title: string;
    action: 'added_from_source' | 'kept_from_target' | 'non_conflicting_update';
    detail: string;
  }[];
  conflicts: MergeConflictItem[];
}

// Job Description & ATS Analysis
export interface JobDescriptionAnalysis {
  id: string;
  jobTitle: string;
  company: string;
  rawText: string;
  extractedSkills: {
    required: string[];
    preferred: string[];
  };
  keyTechnologies: string[];
  coreResponsibilities: string[];
  experienceLevel: string;
  domainKeywords: string[];
  matchScore: number; // 0 - 100
  matchingBreakdown: {
    skill: string;
    status: 'exact_match' | 'semantic_match' | 'missing';
    foundIn: string[];
    semanticEquivalent?: string;
    priority: 'required' | 'preferred';
  }[];
  gapAnalysis: {
    criticalGaps: string[];
    keywordDeficits: string[];
    strongMatches: string[];
  };
  aiSuggestions: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  section: 'summary' | 'experience' | 'projects' | 'skills';
  entityId?: string;
  title: string;
  originalText?: string;
  suggestedText: string;
  reason: string;
  confidence: 'High' | 'Medium';
  groundedInEvidence: boolean; // Anti-hallucination rule
  evidenceSource?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
}

export interface AtsSuggestion {
  id: string;
  section: 'summary' | 'experience' | 'projects' | 'skills';
  entityId?: string;
  originalText?: string;
  proposedText: string;
  targetRole: string;
  rationale: string;
  groundingType: string;
  keywordsAddressed: string[];
}

export interface JdMatchReport {
  company: string;
  jobTitle: string;
  overallScore: number;
  matchedSkills: string[];
  semanticMatches: { resumeSkill: string; jdSkill: string }[];
  missingSkills: string[];
  suggestions: AtsSuggestion[];
}

// Application Tracker
export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Screening'
  | 'Online Assessment'
  | 'Interview'
  | 'Offer'
  | 'Accepted'
  | 'Rejected'
  | 'saved'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location?: string;
  salaryRange?: string;
  jobDescriptionId?: string;
  branchId?: string;
  versionId?: string;
  resumeBranchId?: string;
  resumeVersionId?: string;
  appliedDate: string;
  status: ApplicationStatus;
  notes: string | string[];
  atsMatchScore?: number;
  matchScore?: number;
  timeline: {
    status: ApplicationStatus;
    date: string;
    note?: string;
    notes?: string;
  }[];
}
