import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { EnhanceService } from '../enhance/enhance.service';  // ✅ import service

@Module({
  controllers: [UploadController],
  providers: [EnhanceService],  // ✅ add as provider
})
export class UploadModule {}
