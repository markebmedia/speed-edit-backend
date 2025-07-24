import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { spawn } from 'child_process';

@Injectable()
export class EnhanceService {
  async enhance(filePath: string, method: 'swinir' | 'localcv' | 'both'): Promise<Buffer> {
    const tempOutputFilename = `${uuid()}.jpg`;
    const tempOutputPath = resolve(__dirname, '..', '..', 'temp_outputs', tempOutputFilename);

    const runPythonEnhancement = (scriptPath: string, inputPath: string, outputPath: string): Promise<void> => {
      return new Promise((resolveProcess, rejectProcess) => {
        const pythonProcess = spawn('python3', [scriptPath, '--input', inputPath, '--output', outputPath]);

        pythonProcess.stderr.on('data', (data) => {
          console.error(`❌ Python Error (${scriptPath}):`, data.toString());
        });

        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`❌ Python process (${scriptPath}) exited with code`, code);
            return rejectProcess(new InternalServerErrorException(`${scriptPath} failed`));
          }
          return resolveProcess();
        });
      });
    };

    try {
      if (method === 'swinir') {
        await runPythonEnhancement('src/swinir/enhance_swinir.py', filePath, tempOutputPath);
      } else if (method === 'localcv') {
        await runPythonEnhancement('src/utils/enhance_cv.py', filePath, tempOutputPath);
      } else if (method === 'both') {
        const intermediatePath = resolve(__dirname, '..', '..', 'temp_outputs', `${uuid()}-cv.jpg`);
        await runPythonEnhancement('src/utils/enhance_cv.py', filePath, intermediatePath);
        await runPythonEnhancement('src/swinir/enhance_swinir.py', intermediatePath, tempOutputPath);
        unlinkSync(intermediatePath); // Clean up intermediate
      }

      const enhancedBuffer = readFileSync(tempOutputPath);
      unlinkSync(filePath); // Remove original
      unlinkSync(tempOutputPath); // Remove final

      return enhancedBuffer;
    } catch (err) {
      console.error('❌ Enhancement failed:', err);
      throw new InternalServerErrorException('Failed to enhance image');
    }
  }
}







