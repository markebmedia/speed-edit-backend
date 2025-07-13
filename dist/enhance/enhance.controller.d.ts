import { EnhanceService } from './enhance.service';
export declare class EnhanceController {
    private readonly enhanceService;
    constructor(enhanceService: EnhanceService);
    handleEnhancement(file: Express.Multer.File, imageType: string): Promise<{
        message: string;
        imageUrl: string;
    }>;
}
