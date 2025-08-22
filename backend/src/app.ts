import express, { json, Express } from 'express';
import cors from 'cors';
import { serve, setup } from 'swagger-ui-express';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import routes from './routes/index';
import errorHandler from '@middlewares/errorHandler';
import morganLogger from '@middlewares/morganLogger';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { ErrorRequestHandler } from 'express';

interface SwaggerDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, any>;
  };
}

const app: Express = express();

const loadSwaggerDoc = (): SwaggerDocument => {
  try {
    const filePath = join(__dirname, './docs/swagger.yaml');
    const fileContents = readFileSync(filePath, 'utf8');
    const document = load(fileContents) as SwaggerDocument;

    if (!document.openapi || !document.info || !document.paths) {
      throw new Error('Invalid Swagger document structure');
    }

    return document;
  } catch (error) {
    console.error('Failed to load Swagger document:', error);
    process.exit(1);
  }
};

const swaggerDocument: SwaggerDocument = loadSwaggerDoc();

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с этого IP, пожалуйста, попробуйте позже.',
  headers: true,
  statusCode: 429,
  skip: (req) => {
    return req.path === '/api-docs' || req.path.startsWith('/api-docs/');
  },
});

app.use(json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(morganLogger);
app.use(limiter);

app.use('/api-docs', serve, setup(swaggerDocument));

app.use('/api', routes);

app.use(errorHandler as ErrorRequestHandler);

export default app;
