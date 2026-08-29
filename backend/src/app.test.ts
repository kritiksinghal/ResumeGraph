import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from './app';
import * as dbModule from './config/db';

describe('Application Foundation Tests', () => {
  const app = createApp();

  it('GET /health should return 200 OK with system status', async () => {
    vi.spyOn(dbModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: true,
    });

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'resumegraph-backend',
      database: {
        connected: true,
      },
    });
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.uptime).toBeTypeOf('number');
  });

  it('GET /api/health should also return 200 OK under /api prefix', async () => {
    vi.spyOn(dbModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: false,
      error: 'Mock DB offline',
    });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.database.connected).toBe(false);
    expect(response.body.database.error).toBe('Mock DB offline');
  });

  it('GET /unknown-route should return 404 NOT_FOUND', async () => {
    const response = await request(app).get('/unknown-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found: GET /unknown-route',
      },
    });
  });
});
