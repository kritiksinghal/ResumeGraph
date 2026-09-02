import { Router } from 'express';
import { healthRouter } from './health.router';
import { resumeRouter } from './resume.router';

const router = Router();

router.use(healthRouter);
router.use(resumeRouter);

export { router as apiRouter };
