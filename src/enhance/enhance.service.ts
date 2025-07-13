import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import FormData from 'form-data';

@Injectable()
export class EnhanceService {
  async enhanceImage(file: Express.Multer.File, imageType: string): Promise<string> {
    const filePath = path.resolve(file.path);
    const fileStream = fs.createReadStream(filePath);

    const form = new FormData();
    form.append('file', fileStream, {
      filename: path.basename(filePath),
      contentType: file.mimetype,
    });

    const response = await axios.post(
      'https://swinir-api.onrender.com/enhance',
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    const { enhanced_url } = response.data;
    return `https://swinir-api.onrender.com${enhanced_url}`;
  }
}


