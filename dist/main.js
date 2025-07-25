"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const fs_1 = require("fs");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204,
    });
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    const tempDir = (0, path_1.join)(__dirname, '..', '..', 'temp');
    const tempOutDir = (0, path_1.join)(__dirname, '..', '..', 'temp_outputs');
    if (!(0, fs_1.existsSync)(tempDir))
        (0, fs_1.mkdirSync)(tempDir, { recursive: true });
    if (!(0, fs_1.existsSync)(tempOutDir))
        (0, fs_1.mkdirSync)(tempOutDir, { recursive: true });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', '..', 'public', 'outputs'), {
        prefix: '/outputs',
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map