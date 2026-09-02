import { createApp } from './app';
import { env } from './config/env';
import { pool, checkDatabaseConnection } from './config/db';

const app = createApp();

const server = app.listen(env.PORT, async () => {
  console.log(`🚀 ResumeGraph Backend running on http://localhost:${env.PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);

  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    console.log('✅ PostgreSQL connected successfully');
  } else {
    console.warn(`⚠️ PostgreSQL connection not ready: ${dbStatus.error}`);
  }
});

// Graceful shutdown handling
const handleShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('🔒 HTTP server closed');
    try {
      await pool.end();
      console.log('🔒 Database pool drained');
    } catch (err) {
      console.error('Error draining database pool:', err);
    }
    process.exit(0);
  });

  // Force close after 10s if graceful shutdown hangs
  setTimeout(() => {
    console.error('❌ Forced shutdown due to timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
