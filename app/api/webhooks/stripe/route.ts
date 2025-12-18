import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/db/connect';
import Payment from '@/lib/db/models/Payment';
import User from '@/lib/db/models/User';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy'; // Fallback for build time

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-11-20.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET is not set");
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    await connectDB();

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            try {
                // Find user by email or Clerk ID from metadata
                const customerEmail = paymentIntent.receipt_email ||
                    paymentIntent.metadata?.email;
                const clerkId = paymentIntent.metadata?.clerkId;

                let user = null;
                if (clerkId) {
                    user = await User.findOne({ clerkId });
                } else if (customerEmail) {
                    user = await User.findOne({ email: customerEmail });
                }

                // Create payment record
                await Payment.create({
                    stripePaymentId: paymentIntent.id,
                    userId: user?._id,
                    clerkId: clerkId,
                    amount: paymentIntent.amount / 100, // Convert from cents
                    currency: paymentIntent.currency,
                    status: 'succeeded',
                    productType: paymentIntent.metadata?.productType || 'other',
                    productId: paymentIntent.metadata?.productId,
                    customerEmail: customerEmail,
                    metadata: paymentIntent.metadata,
                });

                console.log('Payment recorded:', paymentIntent.id);
            } catch (error) {
                console.error('Error recording payment:', error);
            }
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            try {
                await Payment.create({
                    stripePaymentId: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency,
                    status: 'failed',
                    customerEmail: paymentIntent.receipt_email,
                    metadata: paymentIntent.metadata,
                });

                console.log('Failed payment recorded:', paymentIntent.id);
            } catch (error) {
                console.error('Error recording failed payment:', error);
            }
            break;
        }

        case 'charge.refunded': {
            const charge = event.data.object as Stripe.Charge;

            try {
                // Update payment status to refunded
                await Payment.findOneAndUpdate(
                    { stripePaymentId: charge.payment_intent },
                    { status: 'refunded' }
                );

                console.log('Refund recorded:', charge.id);
            } catch (error) {
                console.error('Error recording refund:', error);
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
