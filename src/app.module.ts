import { Module } from '@nestjs/common';
import { UploadController } from './upload/upload.controller';
import { EnhanceService } from './enhance/enhance.service';
import { PaymentController } from './payment/payment.controller';

@Module({
  controllers: [UploadController, PaymentController],
  providers: [EnhanceService],
})
export class AppModule {}