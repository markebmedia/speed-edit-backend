import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { spawn } from 'child_process';

@Injectable()
export class EnhanceService {
  async enhance(filePath: string, method: 'swinir' | 'localcv' | 'both'): Promise<Buffer> {
    const tempOutputFilename = `${uuid()}.jpg`;
    const tempOutputPath = resolve(__dirname, '..', '..', 'temp_outputs', tempOutputFilename);

    // Absolute script paths
    const swinirScript = resolve(__dirname, '..', '..', 'src', 'swinir', 'enhance_swinir.py');
    const cvScript = resolve(__dirname, '..', '..', 'src', 'utils', 'enhance_cv.py');

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
        await runPythonEnhancement(swinirScript, filePath, tempOutputPath);
      } else if (method === 'localcv') {
        await runPythonEnhancement(cvScript, filePath, tempOutputPath);
      } else if (method === 'both') {
        const intermediatePath = resolve(__dirname, '..', '..', 'temp_outputs', `${uuid()}-cv.jpg`);
        await runPythonEnhancement(cvScript, filePath, intermediatePath);
        await runPythonEnhancement(swinirScript, intermediatePath, tempOutputPath);
        unlinkSync(intermediatePath);
      }

      const enhancedBuffer = readFileSync(tempOutputPath);
      unlinkSync(filePath);
      unlinkSync(tempOutputPath);

      return enhancedBuffer;
    } catch (err) {
      console.error('❌ Enhancement failed:', err);
      throw new InternalServerErrorException('Failed to enhance image');
    }
  }
}







