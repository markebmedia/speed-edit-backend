import { Response } from 'express';
import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createCheckout(imageUrl: string, res: Response): Promise<Response<any, Record<string, any>>>;
    paymentSuccess(sessionId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    paymentCancel(res: Response): Response<any, Record<string, any>>;
}
