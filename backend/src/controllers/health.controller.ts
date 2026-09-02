import { Request, Response, NextFunction } from 'express';
import { checkDatabaseConnection } from '../config/db';
import { env } from '../config/env';

export async function getHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dbStatus = await checkDatabaseConnection();

    res.status(200).json({
      status: 'ok',
      service: 'resumegraph-backend',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbStatus.connected,
        ...(dbStatus.error ? { error: dbStatus.error } : {}),
      },
    });
  } catch (error) {
    next(error);
  }
}
