import 'dotenv/config';
import app from './app';
import connectDB from './config/database';
import { config } from './config';

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(`📡 Environment: ${config.nodeEnv}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
