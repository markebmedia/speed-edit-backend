import { Injectable } from '@nestjs/common';
import { join, resolve } from 'path';
import { createWriteStream, readFileSync, existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class EnhanceService {
  async enhance(filePath: string): Promise<string> {
    const form = new FormData();
    form.append('image', readFileSync(filePath), {
      filename: 'input.jpg',
      contentType: 'image/jpeg',
    });

    try {
      const response = await axios.post(
        'https://swinir-api.onrender.com/enhance',
        form,
        {
          headers: form.getHeaders(),
          responseType: 'arraybuffer',
          timeout: 30000,
        },
      );

      // Generate output path
      const outputFilename = `${uuid()}.jpg`;
      const outputDir = resolve(__dirname, '..', '..', 'public', 'outputs');
      const outputPath = join(outputDir, outputFilename);

      // Ensure output folder exists
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      // Save the enhanced image
      const buffer = Buffer.from(response.data as ArrayBuffer);
      const output = createWriteStream(outputPath);
      output.write(buffer);
      output.end();

      console.log('✅ Enhanced image saved to:', outputPath);

      // Return the public URL (e.g., http://localhost:3000/outputs/uuid.jpg)
      const publicUrl = `/outputs/${outputFilename}`;
      return publicUrl;
    } catch (error: any) {
      console.error('❌ Enhancement failed');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response:', error.response.data.toString('utf8'));
      } else {
        console.error('Message:', error.message);
      }
      throw new Error('AI enhancement failed');
    }
  }
}







