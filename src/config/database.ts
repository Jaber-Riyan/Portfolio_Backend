import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../shared/logger/logger';

let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: true,
      retryWrites: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err));

export default connectDB;
