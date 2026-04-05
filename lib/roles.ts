import { Roles } from '@/types/globals';
import { auth, clerkClient } from '@clerk/nextjs/server';

// Get admin emails from environment variable
const getAdminEmails = (): string[] => {
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    return adminEmailsEnv.split(',').map(email => email.trim()).filter(Boolean);
};

export const checkRole = async (role: Roles) => {
    const { userId } = await auth();

    if (!userId) {
        console.log('[checkRole] No userId found');
        return false;
    }

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;

        // Admin check
        const adminEmails = getAdminEmails();
        const isAdmin = userEmail ? adminEmails.includes(userEmail) : false;
        
        if (role === 'admin') return isAdmin;
        if (isAdmin) return true; // Admins have all roles

        // const userPlan = (user.publicMetadata?.plan as string) || 'free';
        
        // if (role === 'student') return userPlan === 'student';
        // if (role === 'free') return true; // Everyone logged in is at least 'free'

        // return false;

        // Temporary Unlock All
        return true;
    } catch (error) {
        console.error('[checkRole] Error fetching user:', error);
        return false;
    }
};

export const getUserRole = async (): Promise<Roles> => {
    const { userId } = await auth();

    if (!userId) {
        return 'free';
    }

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;

        const adminEmails = getAdminEmails();
        const isAdmin = userEmail ? adminEmails.includes(userEmail) : false;

        if (isAdmin) return 'admin';

        // const userPlan = (user.publicMetadata?.plan as string) || 'free';
        // return userPlan === 'student' ? 'student' : 'free';

        // Temporary Unlock
        return 'student';
    } catch (error) {
        console.error('[getUserRole] Error fetching user:', error);
        return 'free';
    }
};
