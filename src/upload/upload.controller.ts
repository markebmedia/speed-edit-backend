// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname, resolve } from 'path';
import { EnhanceService } from '../enhance/enhance.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  constructor(private readonly enhanceService: EnhanceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './temp', // Save raw uploads temporarily
        filename: (req, file, cb) => {
          const uniqueName = `${uuid()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        }
      })
    })
  )
  async uploadAndEnhance(
    @UploadedFile() file: Express.Multer.File,
    @Body('method') method: 'localcv' | 'swinir' | 'both',
    @Res() res: Response
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!method || !['localcv', 'swinir', 'both'].includes(method)) {
      throw new BadRequestException('Invalid enhancement method');
    }

    try {
      const enhancedBuffer = await this.enhanceService.enhance(file.path, method);
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename=enhanced.jpg',
      });
      return res.send(enhancedBuffer);
    } catch (err) {
      console.error('❌ UploadController error:', err);
      return res.status(500).json({ error: 'Enhancement failed' });
    }
  }
}

