import { Module } from '@nestjs/common';
import { UploadController } from './upload/upload.controller';
import { EnhanceService } from './enhance/enhance.service';
import { PaymentController } from './payment/payment.controller'; // ✅ Add this

@Module({
  controllers: [UploadController, PaymentController], // ✅ Add here
  providers: [EnhanceService],
})
export class AppModule {}

