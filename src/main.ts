import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as bodyParser from 'body-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // 🔥 Global error logging
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error(err.stack);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ CORS
  app.enableCors({
    origin: '*', // TODO: Restrict to your frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  // ✅ Increase body size limits for large uploads
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // ✅ Ensure temp directories exist
  const tempDir = join(__dirname, '..', '..', 'temp');
  const tempOutDir = join(__dirname, '..', '..', 'temp_outputs');

  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
    console.log(`📂 Created temp dir: ${tempDir}`);
  }

  if (!existsSync(tempOutDir)) {
    mkdirSync(tempOutDir, { recursive: true });
    console.log(`📂 Created temp outputs dir: ${tempOutDir}`);
  }

  // ✅ Serve static outputs (if needed)
  app.useStaticAssets(join(__dirname, '..', '..', 'public', 'outputs'), {
    prefix: '/outputs',
  });

  // ✅ Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Backend running on port ${port}`, 'Bootstrap');
}

bootstrap();



