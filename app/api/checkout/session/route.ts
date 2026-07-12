import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import { Product, PaymentGateway } from '@/models';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any })
  : null;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'You must be signed in to purchase.' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findById(productId).populate('gatewayId');
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    let activeStripe = stripe;
    if (product.gatewayId) {
      if (product.gatewayId.type === 'simulate') {
        return NextResponse.json({
          error: 'This product is configured for simulated sandbox checkout. Use the simulated checkout option.',
          code: 'USE_SIMULATE_ENDPOINT',
        }, { status: 400 });
      }

      if (product.gatewayId.type === 'stripe' && product.gatewayId.stripeSecretKey) {
        activeStripe = new Stripe(product.gatewayId.stripeSecretKey, { apiVersion: '2025-01-27.acacia' as any });
      }
    }

    if (!activeStripe) {
      return NextResponse.json({
        error: 'Stripe is not configured for this product. Please contact the administrator.',
        code: 'STRIPE_NOT_CONFIGURED',
      }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const checkoutSession = await activeStripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: session.user.email!,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&productId=${product._id}`,
      cancel_url: `${origin}/checkout?productId=${product._id}`,
      metadata: {
        userId: (session.user as any).id,
        productId: product._id.toString(),
        gatewayId: product.gatewayId ? product.gatewayId._id.toString() : 'global',
      },
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error: any) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
