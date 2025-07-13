"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCR3toJPEG = convertCR3toJPEG;
const child_process_1 = require("child_process");
const path = require("path");
async function convertCR3toJPEG(inputPath, outputDir) {
    return new Promise((resolve, reject) => {
        if (!inputPath) {
            return reject(new Error('Input path must be defined'));
        }
        if (!outputDir) {
            return reject(new Error('Output directory must be defined'));
        }
        const baseName = path.basename(inputPath, path.extname(inputPath));
        const ppmPath = path.join(outputDir, `${baseName}.ppm`);
        const jpgPath = path.join(outputDir, `${baseName}.jpg`);
        const dcrawCmd = `/opt/homebrew/bin/dcraw -c "${inputPath}" > "${ppmPath}"`;
        (0, child_process_1.exec)(dcrawCmd, (dcrawErr, dcrawStdout, dcrawStderr) => {
            if (dcrawErr) {
                console.error('dcraw error:', dcrawStderr || dcrawErr.message);
                return reject(new Error('Failed to convert CR3 to PPM with dcraw'));
            }
            const convertCmd = `/opt/homebrew/bin/convert "${ppmPath}" "${jpgPath}"`;
            (0, child_process_1.exec)(convertCmd, (convertErr, convertStdout, convertStderr) => {
                if (convertErr) {
                    console.error('imagemagick convert error:', convertStderr || convertErr.message);
                    return reject(new Error('Failed to convert PPM to JPEG with imagemagick'));
                }
                resolve(jpgPath);
            });
        });
    });
}
//# sourceMappingURL=cr3Converter.js.map