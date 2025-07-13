"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSwinIREnhancement = runSwinIREnhancement;
const child_process_1 = require("child_process");
async function runSwinIREnhancement(filePath) {
    return new Promise((resolve, reject) => {
        const cmd = `python3 ./SwinIR/enhance.py "${filePath}"`;
        (0, child_process_1.exec)(cmd, (err, stdout, stderr) => {
            if (err) {
                console.error('SwinIR error:', stderr || err.message);
                return reject(err);
            }
            console.log('SwinIR output:', stdout);
            resolve();
        });
    });
}
//# sourceMappingURL=swinirEnhancer.js.map