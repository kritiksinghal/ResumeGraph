import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'node:path';
import { AppError } from './errorHandler';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES } from '../services/extraction/document.service';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeAllowed = (ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype);
  const isExtAllowed = (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);

  if (isMimeAllowed || isExtAllowed) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Unsupported file format '${file.mimetype || ext}'. Only PDF (.pdf) and Word (.docx) files are supported.`,
        400
      )
    );
  }
}

const multerUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter,
}).single('resume');

/**
 * Express middleware for uploading a single resume document.
 */
export function uploadResumeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  multerUpload(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new AppError(
              `File size exceeds limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`,
              400
            )
          );
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(
            new AppError(
              `Unexpected field '${err.field}'. Please upload the file using field name 'resume'`,
              400
            )
          );
        }
        return next(new AppError(`Upload error: ${err.message}`, 400));
      }
      return next(err);
    }

    if (!req.file) {
      return next(new AppError('No resume file provided. Please attach a file under field name "resume"', 400));
    }

    next();
  });
}
