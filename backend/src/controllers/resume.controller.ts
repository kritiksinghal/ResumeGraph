import { Request, Response, NextFunction } from 'express';
import { resumeService } from '../services/resume.service';
import {
  createResumeRequestSchema,
  updateResumeRequestSchema,
} from '../schemas/resume.schema';
import { AppError } from '../middlewares/errorHandler';

export async function createResumeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = createResumeRequestSchema.parse(req.body);
    const result = await resumeService.createResume(
      validated.title,
      validated.data
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getResumeByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const result = await resumeService.getResumeById(id);

    if (!result) {
      throw new AppError(`Resume not found with id: ${id}`, 404);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function listResumesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const results = await resumeService.listResumes();

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateResumeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const validated = updateResumeRequestSchema.parse(req.body);
    const result = await resumeService.updateResume(id, validated);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteResumeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await resumeService.deleteResume(id);

    if (!deleted) {
      throw new AppError(`Resume not found with id: ${id}`, 404);
    }

    res.status(200).json({
      success: true,
      message: 'Resume successfully deleted',
    });
  } catch (error) {
    next(error);
  }
}
