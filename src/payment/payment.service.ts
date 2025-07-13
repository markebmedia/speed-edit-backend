import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2022-11-15', // ✅ Safe supported version
    });
  }

  async createCheckoutSession(imageUrl: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Speed Edit Download',
              images: [imageUrl],
            },
            unit_amount: 199, // £1.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://www.markebmedia.com/speed-edit-upload?success=true`,
      cancel_url: `https://www.markebmedia.com/speed-edit-upload?cancelled=true`,
      metadata: { imageUrl },
    });

    return session.url;
  }

  async retrieveSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
}

