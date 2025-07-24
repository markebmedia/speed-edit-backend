import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS with full config to cover preflight requests
  app.enableCors({
    origin: '*', // or specify your frontend URL here
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204, // for legacy browser support
  });

  // Increase body size limits
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // Create temp folders if missing
  const tempDir = join(__dirname, '..', '..', 'temp');
  const tempOutDir = join(__dirname, '..', '..', 'temp_outputs');

  if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true });
  if (!existsSync(tempOutDir)) mkdirSync(tempOutDir, { recursive: true });

  // Serve static assets from /outputs (optional)
  app.useStaticAssets(join(__dirname, '..', '..', 'public', 'outputs'), {
    prefix: '/outputs',
  });

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();


