import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';  // ✅ NEW
import { EnhanceService } from './enhance/enhance.service';
import { PaymentController } from './payment/payment.controller';

@Module({
  imports: [UploadModule],  // ✅ NEW
  controllers: [PaymentController],
  providers: [EnhanceService],
})
export class AppModule {}
