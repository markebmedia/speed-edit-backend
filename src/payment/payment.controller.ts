import { Controller, Post, Body, Res } from '@nestjs/common';
import Stripe from 'stripe';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
  });

  @Post('create-checkout')
  async createCheckout(
    @Body('imageUrl') imageUrl: string,
    @Res() res: Response
  ) {
    try {
      if (!imageUrl) {
        return res.status(400).json({ message: 'Missing imageUrl' });
      }

      console.log('Creating Stripe checkout for:', imageUrl);

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: 'Enhanced Property Image',
                images: [imageUrl],
              },
              unit_amount: 199, // £1.99
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });

      return res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Stripe checkout error:', error);
      return res.status(500).json({ message: 'Stripe checkout failed' });
    }
  }
}
