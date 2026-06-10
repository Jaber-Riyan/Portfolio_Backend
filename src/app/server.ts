import 'dotenv/config';
import http from 'http';
import app from './app';
import connectDB from '../config/database';
import { env } from '../config/env';
import { logger } from '../shared/logger/logger';
// import { knowledgeService } from '../modules/knowledge/knowledge.service';
// import { chatService } from '../modules/chat/chat.service';

// const STALE_SESSION_SWEEP_INTERVAL_MS = 60 * 1000;

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
    logger.info(`Environment: ${env.nodeEnv}`);
    logger.info(`API Docs: http://localhost:${env.port}/api/docs`);
    logger.info(`Public API: http://localhost:${env.port}/public/all`);
  });

  // knowledgeService
  //   .syncAll()
  //   .catch((err) => logger.warn('[Knowledge] Startup sync failed:', err));

  // const sweepInterval = setInterval(
  //   () => chatService.cleanupStaleSessions().catch(() => null),
  //   STALE_SESSION_SWEEP_INTERVAL_MS,
  // );

  const shutdown = (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    // clearInterval(sweepInterval);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });
};

export default startServer;
