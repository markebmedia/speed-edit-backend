import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Res,
  InternalServerErrorException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname, resolve } from 'path';
import { EnhanceService } from '../enhance/enhance.service';
import { Response } from 'express';

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
    if (!file) {
      console.error('❌ No file uploaded');
      throw new BadRequestException('No file uploaded');
    }

    if (!method || !['localcv', 'swinir', 'both'].includes(method)) {
      console.error('❌ Invalid enhancement method:', method);
      throw new BadRequestException('Invalid enhancement method');
    }

    console.log(`📥 Received file: ${file.originalname}, Method: ${method}`);

    try {
      const enhancedBuffer = await this.enhanceService.enhance(file.path, method);
      console.log('✅ Enhancement completed, sending response');

      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename=enhanced.jpg'
      });
      return res.send(enhancedBuffer);
    } catch (err: any) {
      console.error('❌ UploadController error:', err?.message || err);
      console.error(err?.stack || err);

      throw new InternalServerErrorException(
        'Enhancement failed: ' + (err?.message || 'Unknown error')
      );
    }
  }
}
