"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeBracketedImages = mergeBracketedImages;
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = require("fs");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function mergeBracketedImages(inputPaths, outputPath) {
    for (const filePath of inputPaths) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`Input file does not exist: ${filePath}`);
        }
    }
    const cmd = `enfuse -o "${outputPath}" ${inputPaths.map(p => `"${p}"`).join(' ')}`;
    try {
        const { stdout, stderr } = await execAsync(cmd);
        if (stderr)
            console.warn('enfuse stderr:', stderr);
        return stdout;
    }
    catch (error) {
        console.error('Failed to merge bracketed images:', error);
        throw new Error(`Enfuse command failed: ${error.message || error}`);
    }
}
//# sourceMappingURL=mergeBracketed.js.map