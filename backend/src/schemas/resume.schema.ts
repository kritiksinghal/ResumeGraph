import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import {
  CreateResumeDataInput,
  ResumeData,
  UpdateResumeDataInput,
} from '../types/resume';
import { AppError } from '../middlewares/errorHandler';

// ============================================================================
// STORED CONTRACT SCHEMAS (Requires valid, non-empty entity IDs)
// ============================================================================

export const storedIdSchema = z
  .string()
  .min(1, 'Entity ID must be a non-empty string');

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  headline: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export const storedLinkItemSchema = z.object({
  id: storedIdSchema,
  label: z.string().min(1, 'Link label is required'),
  url: z.string().min(1, 'URL is required'),
});

export const storedEducationItemSchema = z.object({
  id: storedIdSchema,
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional().default(false),
  grade: z.string().optional(),
  description: z.string().optional(),
});

export const storedExperienceItemSchema = z.object({
  id: storedIdSchema,
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional().default([]),
});

export const storedProjectItemSchema = z.object({
  id: storedIdSchema,
  name: z.string().min(1, 'Project name is required'),
  role: z.string().optional(),
  url: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
});

export const storedSkillCategorySchema = z.object({
  id: storedIdSchema,
  category: z.string().min(1, 'Category name is required'),
  skills: z.array(z.string()).default([]),
});

export const storedCertificationItemSchema = z.object({
  id: storedIdSchema,
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  url: z.string().optional(),
  credentialId: z.string().optional(),
});

export const storedAchievementItemSchema = z.object({
  id: storedIdSchema,
  title: z.string().min(1, 'Achievement title is required'),
  issuer: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
});

export const storedUnmappedSectionSchema = z.object({
  id: storedIdSchema,
  title: z.string().min(1, 'Section title is required'),
  content: z.string().min(1, 'Section content is required'),
});

export const resumeDataSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  personalInfo: personalInfoSchema,
  summary: z.string().optional().default(''),
  links: z.array(storedLinkItemSchema).optional().default([]),
  education: z.array(storedEducationItemSchema).optional().default([]),
  experience: z.array(storedExperienceItemSchema).optional().default([]),
  projects: z.array(storedProjectItemSchema).optional().default([]),
  skills: z.array(storedSkillCategorySchema).optional().default([]),
  certifications: z.array(storedCertificationItemSchema).optional().default([]),
  achievements: z.array(storedAchievementItemSchema).optional().default([]),
  unmappedSections: z.array(storedUnmappedSectionSchema).optional().default([]),
});

// ============================================================================
// CLIENT CREATE INPUT SCHEMAS (IDs are strictly rejected)
// ============================================================================

export const createLinkInputSchema = storedLinkItemSchema.omit({ id: true }).strict();
export const createEducationInputSchema = storedEducationItemSchema.omit({ id: true }).strict();
export const createExperienceInputSchema = storedExperienceItemSchema.omit({ id: true }).strict();
export const createProjectInputSchema = storedProjectItemSchema.omit({ id: true }).strict();
export const createSkillCategoryInputSchema = storedSkillCategorySchema.omit({ id: true }).strict();
export const createCertificationInputSchema = storedCertificationItemSchema.omit({ id: true }).strict();
export const createAchievementInputSchema = storedAchievementItemSchema.omit({ id: true }).strict();
export const createUnmappedSectionInputSchema = storedUnmappedSectionSchema.omit({ id: true }).strict();

export const createResumeDataInputSchema = z
  .object({
    personalInfo: personalInfoSchema.strict(),
    summary: z.string().optional().default(''),
    links: z.array(createLinkInputSchema).optional().default([]),
    education: z.array(createEducationInputSchema).optional().default([]),
    experience: z.array(createExperienceInputSchema).optional().default([]),
    projects: z.array(createProjectInputSchema).optional().default([]),
    skills: z.array(createSkillCategoryInputSchema).optional().default([]),
    certifications: z.array(createCertificationInputSchema).optional().default([]),
    achievements: z.array(createAchievementInputSchema).optional().default([]),
    unmappedSections: z.array(createUnmappedSectionInputSchema).optional().default([]),
  })
  .strict();

export const createResumeRequestSchema = z
  .object({
    title: z.string().min(1, 'Resume title is required').max(255),
    data: createResumeDataInputSchema,
  })
  .strict();

// ============================================================================
// CLIENT UPDATE INPUT SCHEMAS (IDs are optional per entity)
// ============================================================================

export const updateLinkInputSchema = storedLinkItemSchema.omit({ id: true }).partial().extend({
  id: z.string().optional(),
}).strict();

export const updateEducationInputSchema = storedEducationItemSchema.omit({ id: true }).partial().extend({
  id: z.string().optional(),
}).strict();

export const updateExperienceInputSchema = storedExperienceItemSchema.omit({ id: true }).partial().extend({
  id: z.string().optional(),
}).strict();

export const updateProjectInputSchema = storedProjectItemSchema.omit({ id: true }).partial().extend({
  id: z.string().optional(),
}).strict();

export const updateSkillCategoryInputSchema = storedSkillCategorySchema.omit({ id: true }).partial().extend({
  id: z.string().optional(),
}).strict();

export const updateCertificationInputSchema = storedCertificationItemSchema.omit({ id: true }).partial().extend({
  id: z.string().optional(),
}).strict();

export const updateAchievementInputSchema = storedAchievementItemSchema.omit({ id: true }).partial().extend({
  id: z.string().optional(),
}).strict();

export const updateUnmappedSectionInputSchema = storedUnmappedSectionSchema.omit({ id: true }).partial().extend({
  id: z.string().optional(),
}).strict();

export const updateResumeDataInputSchema = z
  .object({
    personalInfo: personalInfoSchema.partial().strict().optional(),
    summary: z.string().optional(),
    links: z.array(updateLinkInputSchema).optional(),
    education: z.array(updateEducationInputSchema).optional(),
    experience: z.array(updateExperienceInputSchema).optional(),
    projects: z.array(updateProjectInputSchema).optional(),
    skills: z.array(updateSkillCategoryInputSchema).optional(),
    certifications: z.array(updateCertificationInputSchema).optional(),
    achievements: z.array(updateAchievementInputSchema).optional(),
    unmappedSections: z.array(updateUnmappedSectionInputSchema).optional(),
  })
  .strict();

export const updateResumeRequestSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    data: updateResumeDataInputSchema.optional(),
  })
  .strict();

// ============================================================================
// BACKEND-OWNED ID GENERATION HELPERS (Service Layer)
// ============================================================================

/**
 * Assigns backend UUIDs to all entities in a newly created ResumeData structure.
 */
export function assignResumeDataIds(input: CreateResumeDataInput): ResumeData {
  return {
    schemaVersion: 1,
    personalInfo: { ...input.personalInfo },
    summary: input.summary ?? '',
    links: (input.links ?? []).map((item) => ({
      ...item,
      id: randomUUID(),
    })),
    education: (input.education ?? []).map((item) => ({
      ...item,
      id: randomUUID(),
      isCurrent: item.isCurrent ?? false,
    })),
    experience: (input.experience ?? []).map((item) => ({
      ...item,
      id: randomUUID(),
      isCurrent: item.isCurrent ?? false,
      highlights: item.highlights ?? [],
    })),
    projects: (input.projects ?? []).map((item) => ({
      ...item,
      id: randomUUID(),
      isCurrent: item.isCurrent ?? false,
      highlights: item.highlights ?? [],
      technologies: item.technologies ?? [],
    })),
    skills: (input.skills ?? []).map((item) => ({
      ...item,
      id: randomUUID(),
      skills: item.skills ?? [],
    })),
    certifications: (input.certifications ?? []).map((item) => ({
      ...item,
      id: randomUUID(),
    })),
    achievements: (input.achievements ?? []).map((item) => ({
      ...item,
      id: randomUUID(),
    })),
    unmappedSections: (input.unmappedSections ?? []).map((item) => ({
      ...item,
      id: randomUUID(),
    })),
  };
}

/**
 * Merges updates into existing ResumeData.
 * - Existing entities MUST retain their backend-generated ID.
 * - Newly added entities (without an ID) receive a newly generated UUID.
 * - Matching is performed strictly by ID, never by array index, name, or content.
 */
export function normalizeResumeDataForUpdate(
  update: UpdateResumeDataInput,
  existing: ResumeData
): ResumeData {
  const mapCollection = <T extends { id?: string }, R extends { id: string }>(
    updatedItems: T[] | undefined,
    existingItems: R[],
    factory: (item: Omit<T, 'id'>) => R
  ): R[] => {
    if (!updatedItems) return existingItems;
    return updatedItems.map((item) => {
      if (item.id) {
        const found = existingItems.find((e) => e.id === item.id);
        if (!found) {
          throw new AppError(
            `Entity with id "${item.id}" does not exist in the resume. Omit the id to add a new entity.`,
            400
          );
        }
        const { id: _providedId, ...rest } = item;
        return { ...found, ...rest, id: found.id };
      }
      const { id: _omittedId, ...rest } = item;
      return factory(rest as Omit<T, 'id'>);
    });
  };

  return {
    schemaVersion: 1,
    personalInfo: update.personalInfo
      ? { ...existing.personalInfo, ...update.personalInfo }
      : existing.personalInfo,
    summary: update.summary !== undefined ? update.summary : existing.summary,
    links: mapCollection(update.links, existing.links, (item) => ({
      id: randomUUID(),
      label: item.label ?? '',
      url: item.url ?? '',
      ...item,
    })),
    education: mapCollection(update.education, existing.education, (item) => ({
      id: randomUUID(),
      institution: item.institution ?? '',
      isCurrent: item.isCurrent ?? false,
      ...item,
    })),
    experience: mapCollection(update.experience, existing.experience, (item) => ({
      id: randomUUID(),
      company: item.company ?? '',
      position: item.position ?? '',
      isCurrent: item.isCurrent ?? false,
      highlights: item.highlights ?? [],
      ...item,
    })),
    projects: mapCollection(update.projects, existing.projects, (item) => ({
      id: randomUUID(),
      name: item.name ?? '',
      isCurrent: item.isCurrent ?? false,
      highlights: item.highlights ?? [],
      technologies: item.technologies ?? [],
      ...item,
    })),
    skills: mapCollection(update.skills, existing.skills, (item) => ({
      id: randomUUID(),
      category: item.category ?? 'General',
      skills: item.skills ?? [],
      ...item,
    })),
    certifications: mapCollection(update.certifications, existing.certifications, (item) => ({
      id: randomUUID(),
      name: item.name ?? '',
      ...item,
    })),
    achievements: mapCollection(update.achievements, existing.achievements, (item) => ({
      id: randomUUID(),
      title: item.title ?? '',
      ...item,
    })),
    unmappedSections: mapCollection(update.unmappedSections, existing.unmappedSections, (item) => ({
      id: randomUUID(),
      title: item.title ?? '',
      content: item.content ?? '',
      ...item,
    })),
  };
}
