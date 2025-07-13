import Stripe from 'stripe';
export declare class PaymentService {
    private stripe;
    constructor();
    createCheckoutSession(imageUrl: string): Promise<string | null>;
    retrieveSession(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
