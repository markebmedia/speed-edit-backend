"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhanceService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const uuid_1 = require("uuid");
const child_process_1 = require("child_process");
let EnhanceService = class EnhanceService {
    async enhance(filePath, method) {
        const tempOutputFilename = `${(0, uuid_1.v4)()}.jpg`;
        const tempOutputPath = (0, path_1.resolve)(__dirname, '..', '..', 'temp_outputs', tempOutputFilename);
        const swinirScript = (0, path_1.resolve)(__dirname, '..', '..', 'src', 'swinir', 'enhance_swinir.py');
        const cvScript = (0, path_1.resolve)(__dirname, '..', '..', 'src', 'utils', 'enhance_cv.py');
        const runPythonEnhancement = (scriptPath, inputPath, outputPath) => {
            return new Promise((resolveProcess, rejectProcess) => {
                const pythonProcess = (0, child_process_1.spawn)('python3', [scriptPath, '--input', inputPath, '--output', outputPath]);
                pythonProcess.stderr.on('data', (data) => {
                    console.error(`❌ Python Error (${scriptPath}):`, data.toString());
                });
                pythonProcess.on('close', (code) => {
                    if (code !== 0) {
                        console.error(`❌ Python process (${scriptPath}) exited with code`, code);
                        return rejectProcess(new common_1.InternalServerErrorException(`${scriptPath} failed`));
                    }
                    return resolveProcess();
                });
            });
        };
        try {
            if (method === 'swinir') {
                await runPythonEnhancement(swinirScript, filePath, tempOutputPath);
            }
            else if (method === 'localcv') {
                await runPythonEnhancement(cvScript, filePath, tempOutputPath);
            }
            else if (method === 'both') {
                const intermediatePath = (0, path_1.resolve)(__dirname, '..', '..', 'temp_outputs', `${(0, uuid_1.v4)()}-cv.jpg`);
                await runPythonEnhancement(cvScript, filePath, intermediatePath);
                await runPythonEnhancement(swinirScript, intermediatePath, tempOutputPath);
                (0, fs_1.unlinkSync)(intermediatePath);
            }
            const enhancedBuffer = (0, fs_1.readFileSync)(tempOutputPath);
            (0, fs_1.unlinkSync)(filePath);
            (0, fs_1.unlinkSync)(tempOutputPath);
            return enhancedBuffer;
        }
        catch (err) {
            console.error('❌ Enhancement failed:', err);
            throw new common_1.InternalServerErrorException('Failed to enhance image');
        }
    }
};
exports.EnhanceService = EnhanceService;
exports.EnhanceService = EnhanceService = __decorate([
    (0, common_1.Injectable)()
], EnhanceService);
//# sourceMappingURL=enhance.service.js.map