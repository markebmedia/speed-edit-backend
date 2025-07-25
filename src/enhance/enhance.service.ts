import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { spawn } from 'child_process';

@Injectable()
export class EnhanceService {
  async enhance(filePath: string, method: 'swinir' | 'localcv' | 'both'): Promise<Buffer> {
    const tempOutputDir = resolve(__dirname, '..', '..', 'temp_outputs');
    const tempOutputFilename = `${uuid()}.jpg`;
    const tempOutputPath = resolve(tempOutputDir, tempOutputFilename);

    // ✅ Correct absolute script paths
    const swinirScript = resolve(__dirname, '..', 'swinir', 'enhance_swinir.py');
    const cvScript = resolve(__dirname, '..', 'utils', 'enhance_cv.py');

    // ✅ Runs a Python script and captures its stdout for the real output path
    const runPythonEnhancement = (scriptPath: string, inputPath: string, outputPath: string): Promise<string> => {
      return new Promise((resolveProcess, rejectProcess) => {
        console.log(`🚀 Running Python: ${scriptPath}`);
        const pythonProcess = spawn('python3', [scriptPath, inputPath, outputPath]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`❌ Python process (${scriptPath}) exited with code ${code}`);
            console.error(stderr || stdout);
            return rejectProcess(new InternalServerErrorException(`${scriptPath} failed`));
          }
          const outPath = stdout.trim() || outputPath;
          console.log(`✅ Python finished. Output: ${outPath}`);
          resolveProcess(outPath);
        });
      });
    };

    try {
      let finalOutputPath = tempOutputPath;

      if (method === 'swinir') {
        finalOutputPath = await runPythonEnhancement(swinirScript, filePath, tempOutputPath);
      } else if (method === 'localcv') {
        finalOutputPath = await runPythonEnhancement(cvScript, filePath, tempOutputPath);
      } else if (method === 'both') {
        const intermediatePath = resolve(tempOutputDir, `${uuid()}-cv.jpg`);
        const cvOut = await runPythonEnhancement(cvScript, filePath, intermediatePath);
        finalOutputPath = await runPythonEnhancement(swinirScript, cvOut, tempOutputPath);
        try {
          unlinkSync(cvOut);
        } catch (e) {
          console.warn(`⚠️ Could not remove intermediate file: ${cvOut}`);
        }
      }

      const enhancedBuffer = readFileSync(finalOutputPath);

      // ✅ Clean up
      try {
        unlinkSync(filePath);
      } catch (e) {
        console.warn(`⚠️ Could not remove input file: ${filePath}`);
      }

      try {
        unlinkSync(finalOutputPath);
      } catch (e) {
        console.warn(`⚠️ Could not remove output file: ${finalOutputPath}`);
      }

      return enhancedBuffer;
    } catch (err) {
      console.error('❌ Enhancement failed:', err);
      throw new InternalServerErrorException('Failed to enhance image');
    }
  }
}





