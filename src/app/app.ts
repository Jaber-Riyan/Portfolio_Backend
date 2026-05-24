import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import { env } from '../config/env';
import apiRoutes, { publicRoute } from './routes';
import { globalErrorHandler } from '../shared/middleware/globalError';
import { notFoundHandler } from '../shared/middleware/notFound';
import { setupSwagger } from '../core/docs/swagger';
import { logger } from '../shared/logger/logger';

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: env.corsOrigin.split(',').map((o) => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(compression() as express.RequestHandler);
app.use(morgan(env.isDev ? 'dev' : 'combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.cookieSecret));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: env.isProd ? '7d' : 0,
}));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Portfolio CMS API',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

app.use('/api', apiRoutes);
app.use('/public', publicRoute);

setupSwagger(app);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
