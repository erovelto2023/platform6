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
        const metadataRole = (user.publicMetadata?.role as string);
        const isAdminInMetadata = metadataRole === 'admin';
        
        if (role === 'admin') {
            return isAdmin || isAdminInMetadata;
        }

        if (isAdmin || isAdminInMetadata) return true; // Admins have all roles

        const userPlan = (user.publicMetadata?.plan as string) || 'free';
        
        if (role === 'student') return userPlan === 'student';
        if (role === 'free') return true;

        return false;
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
        const metadataRole = (user.publicMetadata?.role as string);

        if (isAdmin || metadataRole === 'admin') return 'admin';

        const userPlan = (user.publicMetadata?.plan as string) || 'free';
        return userPlan === 'student' ? 'student' : 'free';
    } catch (error) {
        console.error('[getUserRole] Error fetching user:', error);
        return 'free';
    }
};
