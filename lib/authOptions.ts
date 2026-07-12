import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

// Clerk-backed mock of getServerSession for unified session handling
export async function getServerSession(options?: any) {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connectDB();
    let user = await User.findOne({ clerkId: userId });
    
    // Sync if user exists in Clerk but not in the local database
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

    if (!user) return null;

    const emailLower = user.email ? user.email.toLowerCase() : '';
    const adminEmails = ['erovelto1@gmail.com', 'erovelto@outlook.com'];
    const isAdmin = adminEmails.includes(emailLower) || emailLower.includes('erovelto') || user.role === 'admin';

    return {
      user: {
        id: user._id.toString(),
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email,
        email: user.email,
        role: isAdmin ? 'admin' : user.role,
        hasAccess: user.hasAccess || [],
      }
    };
  } catch (error) {
    console.error('Error in mock getServerSession (Clerk-backed):', error);
    return null;
  }
}

export const authOptions = {};
