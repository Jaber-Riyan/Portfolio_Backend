import 'dotenv/config';
import http from 'http';
import app from './app';
import connectDB from '../config/database';
import { env } from '../config/env';
import { logger } from '../shared/logger/logger';
import { initializeKnowledgeBase } from '../utils/knowledgeInitializer';
import { initializeEmbedder } from '../modules/ai/embed';

const startServer = async (): Promise<void> => {
  await connectDB();

  await initializeEmbedder()

  await initializeKnowledgeBase()

  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
    logger.info(`Environment: ${env.nodeEnv}`);
    logger.info(`API Docs: http://localhost:${env.port}/api/docs`);
    logger.info(`Public API: http://localhost:${env.port}/public/all`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
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
