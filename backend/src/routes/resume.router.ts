import { Router } from 'express';
import {
  createResumeHandler,
  getResumeByIdHandler,
  listResumesHandler,
  updateResumeHandler,
  deleteResumeHandler,
} from '../controllers/resume.controller';

const resumeRouter = Router();

resumeRouter.post('/resumes', createResumeHandler);
resumeRouter.get('/resumes', listResumesHandler);
resumeRouter.get('/resumes/:id', getResumeByIdHandler);
resumeRouter.put('/resumes/:id', updateResumeHandler);
resumeRouter.delete('/resumes/:id', deleteResumeHandler);

export { resumeRouter };
