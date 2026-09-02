import { eq, desc } from 'drizzle-orm';
import { db } from '../config/db';
import { resumes } from '../db/schema';
import {
  CreateResumeDataInput,
  ResumeData,
  ResumeEntity,
  UpdateResumeDataInput,
} from '../types/resume';
import {
  assignResumeDataIds,
  normalizeResumeDataForUpdate,
  resumeDataSchema,
} from '../schemas/resume.schema';
import { AppError } from '../middlewares/errorHandler';

export class ResumeService {
  /**
   * Persists pre-validated ResumeData to PostgreSQL.
   */
  async persistStructuredResume(
    title: string,
    data: ResumeData
  ): Promise<ResumeEntity> {
    const validatedData = resumeDataSchema.parse(data);

    const [inserted] = await db
      .insert(resumes)
      .values({
        title,
        schemaVersion: validatedData.schemaVersion,
        data: validatedData,
      })
      .returning();

    return {
      id: inserted.id,
      title: inserted.title,
      schemaVersion: inserted.schemaVersion,
      data: inserted.data as ResumeData,
      createdAt: inserted.createdAt,
      updatedAt: inserted.updatedAt,
    };
  }

  /**
   * Creates a new resume with backend-generated UUIDs for all entities.
   */
  async createResume(
    title: string,
    dataInput: CreateResumeDataInput
  ): Promise<ResumeEntity> {
    const fullResumeData = assignResumeDataIds(dataInput);
    return this.persistStructuredResume(title, fullResumeData);
  }

  /**
   * Retrieves a single resume by its UUID.
   */
  async getResumeById(id: string): Promise<ResumeEntity | null> {
    const [record] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (!record) return null;

    return {
      id: record.id,
      title: record.title,
      schemaVersion: record.schemaVersion,
      data: record.data as ResumeData,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Lists all resumes sorted by most recently updated.
   */
  async listResumes(): Promise<ResumeEntity[]> {
    const records = await db
      .select()
      .from(resumes)
      .orderBy(desc(resumes.updatedAt));

    return records.map((record) => ({
      id: record.id,
      title: record.title,
      schemaVersion: record.schemaVersion,
      data: record.data as ResumeData,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));
  }

  /**
   * Updates an existing resume, preserving entity IDs and creating new UUIDs for new entities.
   */
  async updateResume(
    id: string,
    update: { title?: string; data?: UpdateResumeDataInput }
  ): Promise<ResumeEntity> {
    const existing = await this.getResumeById(id);
    if (!existing) {
      throw new AppError(`Resume not found with id: ${id}`, 404);
    }

    const updatedTitle = update.title ?? existing.title;
    let updatedData = existing.data;

    if (update.data) {
      const merged = normalizeResumeDataForUpdate(update.data, existing.data);
      updatedData = resumeDataSchema.parse(merged);
    }

    const [updated] = await db
      .update(resumes)
      .set({
        title: updatedTitle,
        data: updatedData,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, id))
      .returning();

    return {
      id: updated.id,
      title: updated.title,
      schemaVersion: updated.schemaVersion,
      data: updated.data as ResumeData,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Deletes a resume by its UUID.
   */
  async deleteResume(id: string): Promise<boolean> {
    const result = await db.delete(resumes).where(eq(resumes.id, id)).returning();
    return result.length > 0;
  }
}

export const resumeService = new ResumeService();
