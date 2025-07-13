// src/app.module.ts
import { Module } from '@nestjs/common';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class AppModule {}
