import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { writeFile, unlink } from 'fs/promises';
import * as fs from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as FormData from 'form-data';

@Injectable()
export class EnhanceService {
  async enhanceImage(file: Express.Multer.File, imageType: string): Promise<string> {
    const tempFileName = `${uuidv4()}-${file.originalname}`;
    const tempFilePath = join(__dirname, '../../temp', tempFileName);
    const enhancedFileName = `enhanced-${tempFileName}`;
    const enhancedFilePath = join(__dirname, '../../public/outputs', enhancedFileName);

    try {
      // 1. Save uploaded file temporarily
      await writeFile(tempFilePath, file.buffer);

      // 2. Prepare form and send to enhancement API
      const formData = new FormData();
      formData.append('file', fs.createReadStream(tempFilePath));
      formData.append('imageType', imageType);

      const response = await axios.post<ArrayBuffer>(
        'https://swinir-api.onrender.com/enhance',
        formData,
        {
          headers: formData.getHeaders(),
          responseType: 'arraybuffer',
        }
      );

      // 3. Convert ArrayBuffer to Buffer
      const enhancedBuffer = Buffer.from(new Uint8Array(response.data));

      // 4. Save enhanced image
      await writeFile(enhancedFilePath, enhancedBuffer);

      // 5. Return relative public URL
      return `/outputs/${enhancedFileName}`;
    } catch (error) {
      console.error('Enhancement error:', error);
      throw new Error('Image enhancement failed');
    } finally {
      // 6. Cleanup: delete temporary file
      try {
        await unlink(tempFilePath);
      } catch (e) {
        console.warn('Failed to delete temp file:', tempFilePath);
      }
    }
  }
}





