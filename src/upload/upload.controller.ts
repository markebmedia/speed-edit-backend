import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EnhanceService } from '../enhance/enhance.service';
import { Response } from 'express';
import { extname, join } from 'path';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  constructor(private readonly enhanceService: EnhanceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async handleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    console.log('Image received:', file.originalname);

    try {
      const outputPath = await this.enhanceService.enhance(file.path);
      const filename = outputPath.split('/').pop();
      const resultUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/outputs/${filename}`;

      console.log('Enhanced image path:', resultUrl);

      return res.status(200).json({ enhancedUrl: resultUrl });
    } catch (err) {
      console.error('Enhancement failed:', err);
      return res.status(500).json({ message: 'Enhancement error' });
    } finally {
      // Clean up uploaded file
      fs.unlinkSync(file.path);
    }
  }
}
