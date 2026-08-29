export interface PersonalInfo {
  fullName: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface LinkItem {
  id: string; // Backend-assigned UUID
  label: string;
  url: string;
}

export interface EducationItem {
  id: string; // Backend-assigned UUID
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string; // Backend-assigned UUID
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  highlights?: string[];
}

export interface ProjectItem {
  id: string; // Backend-assigned UUID
  name: string;
  role?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  highlights?: string[];
  technologies?: string[];
}

export interface SkillCategory {
  id: string; // Backend-assigned UUID
  category: string;
  skills: string[];
}

export interface CertificationItem {
  id: string; // Backend-assigned UUID
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  url?: string;
  credentialId?: string;
}

export interface AchievementItem {
  id: string; // Backend-assigned UUID
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface UnmappedSection {
  id: string; // Backend-assigned UUID
  title: string;
  content: string;
}

/**
 * Stored ResumeData contract (Phase 0).
 * Every repeatable entity has a mandatory, immutable backend-owned ID.
 */
export interface ResumeData {
  schemaVersion: 1;
  personalInfo: PersonalInfo;
  summary?: string;
  links: LinkItem[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  unmappedSections: UnmappedSection[];
}

// ---------------------------------------------------------------------------
// Client Input Types (IDs are omitted; backend owns ID generation)
// ---------------------------------------------------------------------------

export type CreateLinkInput = Omit<LinkItem, 'id'>;
export type CreateEducationInput = Omit<EducationItem, 'id'>;
export type CreateExperienceInput = Omit<ExperienceItem, 'id'>;
export type CreateProjectInput = Omit<ProjectItem, 'id'>;
export type CreateSkillCategoryInput = Omit<SkillCategory, 'id'>;
export type CreateCertificationInput = Omit<CertificationItem, 'id'>;
export type CreateAchievementInput = Omit<AchievementItem, 'id'>;
export type CreateUnmappedSectionInput = Omit<UnmappedSection, 'id'>;

export interface CreateResumeDataInput {
  personalInfo: PersonalInfo;
  summary?: string;
  links?: CreateLinkInput[];
  education?: CreateEducationInput[];
  experience?: CreateExperienceInput[];
  projects?: CreateProjectInput[];
  skills?: CreateSkillCategoryInput[];
  certifications?: CreateCertificationInput[];
  achievements?: CreateAchievementInput[];
  unmappedSections?: CreateUnmappedSectionInput[];
}

export type UpdateLinkInput = Partial<Omit<LinkItem, 'id'>> & { id?: string };
export type UpdateEducationInput = Partial<Omit<EducationItem, 'id'>> & { id?: string };
export type UpdateExperienceInput = Partial<Omit<ExperienceItem, 'id'>> & { id?: string };
export type UpdateProjectInput = Partial<Omit<ProjectItem, 'id'>> & { id?: string };
export type UpdateSkillCategoryInput = Partial<Omit<SkillCategory, 'id'>> & { id?: string };
export type UpdateCertificationInput = Partial<Omit<CertificationItem, 'id'>> & { id?: string };
export type UpdateAchievementInput = Partial<Omit<AchievementItem, 'id'>> & { id?: string };
export type UpdateUnmappedSectionInput = Partial<Omit<UnmappedSection, 'id'>> & { id?: string };

export interface UpdateResumeDataInput {
  personalInfo?: Partial<PersonalInfo>;
  summary?: string;
  links?: UpdateLinkInput[];
  education?: UpdateEducationInput[];
  experience?: UpdateExperienceInput[];
  projects?: UpdateProjectInput[];
  skills?: UpdateSkillCategoryInput[];
  certifications?: UpdateCertificationInput[];
  achievements?: UpdateAchievementInput[];
  unmappedSections?: UpdateUnmappedSectionInput[];
}

export interface ResumeEntity {
  id: string;
  title: string;
  schemaVersion: number;
  data: ResumeData;
  createdAt: Date;
  updatedAt: Date;
}
