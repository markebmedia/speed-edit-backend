import {
  Controller,
  Post,
  Get,
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

// ✅ Define our own type so we don't rely on Express namespace
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};

@Controller('upload')
export class UploadController {
  constructor(private readonly enhanceService: EnhanceService) {}

  @Get('ping')
  ping() {
    return { message: 'Upload controller is alive' };
  }

  @Post('test-upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: resolve(__dirname, '..', '..', 'temp'),
        filename: (req, file, cb) => {
          const uniqueName = `${uuid()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        }
      })
    })
  )
  async uploadAndEnhance(
    @UploadedFile() file: MulterFile,
    @Body('method') method: 'localcv' | 'swinir' | 'both',
    @Res() res: Response
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!method || !['localcv', 'swinir', 'both'].includes(method)) {
      throw new BadRequestException('Invalid enhancement method');
    }

    try {
      const enhancedBuffer = await this.enhanceService.enhance(file.path, method);
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename=enhanced.jpg'
      });
      return res.send(enhancedBuffer);
    } catch (err) {
      console.error('❌ UploadController error:', err);
      return res.status(500).json({ error: 'Enhancement failed' });
    }
  }
}
