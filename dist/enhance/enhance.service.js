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
const path_1 = require("path");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const axios_1 = require("axios");
const FormData = require("form-data");
let EnhanceService = class EnhanceService {
    async enhance(filePath) {
        const form = new FormData();
        form.append('image', (0, fs_1.readFileSync)(filePath), {
            filename: 'input.jpg',
            contentType: 'image/jpeg',
        });
        try {
            const response = await axios_1.default.post('https://swinir-api.onrender.com/enhance', form, {
                headers: form.getHeaders(),
                responseType: 'arraybuffer',
                timeout: 30000,
            });
            const outputFilename = `${(0, uuid_1.v4)()}.jpg`;
            const outputDir = (0, path_1.resolve)(__dirname, '..', '..', 'public', 'outputs');
            const outputPath = (0, path_1.join)(outputDir, outputFilename);
            if (!(0, fs_1.existsSync)(outputDir)) {
                (0, fs_1.mkdirSync)(outputDir, { recursive: true });
            }
            const buffer = Buffer.from(response.data);
            const output = (0, fs_1.createWriteStream)(outputPath);
            output.write(buffer);
            output.end();
            console.log('✅ Enhanced image saved to:', outputPath);
            const publicUrl = `/outputs/${outputFilename}`;
            return publicUrl;
        }
        catch (error) {
            console.error('❌ Enhancement failed');
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Response:', error.response.data.toString('utf8'));
            }
            else {
                console.error('Message:', error.message);
            }
            throw new Error('AI enhancement failed');
        }
    }
};
exports.EnhanceService = EnhanceService;
exports.EnhanceService = EnhanceService = __decorate([
    (0, common_1.Injectable)()
], EnhanceService);
//# sourceMappingURL=enhance.service.js.map