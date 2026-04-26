import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_cms',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
