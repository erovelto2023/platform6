import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    let user = await User.findOne({ clerkId: userId });

    // Sync user if missing in Mongoose but present in Clerk
    if (!user) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        user = await User.create({
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          role: 'free',
          username: clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split('@')[0],
          photo: clerkUser.imageUrl,
          onboardingCompleted: true,
          isPartner: true
        });
      }
    }

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email,
        email: user.email,
        role: user.role,
        hasAccess: user.hasAccess || [],
      }
    });
  } catch (error: any) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
