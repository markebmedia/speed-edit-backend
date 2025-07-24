import { Response } from 'express';
export declare class PaymentController {
    private stripe;
    createCheckout(imageUrl: string, res: Response): Promise<Response<any, Record<string, any>>>;
    cancelPage(res: Response): Response<any, Record<string, any>>;
}
