import { pgTable, uuid, varchar, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import type { ResumeData } from '../../types/resume';

export const resumes = pgTable('resumes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  schemaVersion: integer('schema_version').notNull().default(1),
  data: jsonb('data').$type<ResumeData>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ResumeSelect = typeof resumes.$inferSelect;
export type ResumeInsert = typeof resumes.$inferInsert;
