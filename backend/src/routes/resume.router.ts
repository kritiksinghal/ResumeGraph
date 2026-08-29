import { Router } from 'express';
import {
  createResumeHandler,
  getResumeByIdHandler,
  listResumesHandler,
  updateResumeHandler,
  deleteResumeHandler,
  uploadResumeHandler,
  structureResumeHandler,
} from '../controllers/resume.controller';
import { uploadResumeMiddleware } from '../middlewares/upload.middleware';

const resumeRouter = Router();

// Upload & extract raw text from PDF / DOCX
resumeRouter.post('/resumes/upload', uploadResumeMiddleware, uploadResumeHandler);

// AI Structuring from raw text
resumeRouter.post('/resumes/structure', structureResumeHandler);

// CRUD operations
resumeRouter.post('/resumes', createResumeHandler);
resumeRouter.get('/resumes', listResumesHandler);
resumeRouter.get('/resumes/:id', getResumeByIdHandler);
resumeRouter.put('/resumes/:id', updateResumeHandler);
resumeRouter.delete('/resumes/:id', deleteResumeHandler);

export { resumeRouter };
