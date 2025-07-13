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
const axios_1 = require("axios");
const path = require("path");
const fs = require("fs");
const form_data_1 = require("form-data");
let EnhanceService = class EnhanceService {
    async enhanceImage(file, imageType) {
        const filePath = path.resolve(file.path);
        const fileStream = fs.createReadStream(filePath);
        const form = new form_data_1.default();
        form.append('file', fileStream, {
            filename: path.basename(filePath),
            contentType: file.mimetype,
        });
        const response = await axios_1.default.post('https://swinir-api.onrender.com/enhance', form, {
            headers: form.getHeaders(),
            maxBodyLength: Infinity,
        });
        const { enhanced_url } = response.data;
        return `https://swinir-api.onrender.com${enhanced_url}`;
    }
};
exports.EnhanceService = EnhanceService;
exports.EnhanceService = EnhanceService = __decorate([
    (0, common_1.Injectable)()
], EnhanceService);
//# sourceMappingURL=enhance.service.js.map