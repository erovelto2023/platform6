import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any })
  : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not initialized' }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Fallback for simple local integration without verification (not recommended for production)
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata && metadata.userId && metadata.productId) {
      try {
        await dbConnect();
        const user = await User.findByIdAndUpdate(metadata.userId, {
          $addToSet: { hasAccess: metadata.productId },
          role: 'student'
        }, { new: true });

        if (user) {
          try {
            const { clerkClient } = await import('@clerk/nextjs/server');
            const client = await clerkClient();
            await client.users.updateUser(user.clerkId, {
              publicMetadata: {
                plan: 'student',
                role: 'student'
              }
            });
            console.log(`Successfully upgraded Clerk role to 'student' for user ${user.clerkId}`);
          } catch (clerkErr) {
            console.error('Failed to sync Clerk metadata in checkout webhook:', clerkErr);
          }
        }

        console.log(`Fulfillment success: User ${metadata.userId} gained access to ${metadata.productId}`);
      } catch (error) {
        console.error('Fulfillment database error:', error);
        return NextResponse.json({ error: 'Fulfillment database error' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
