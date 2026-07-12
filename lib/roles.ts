import { Roles } from '@/types/globals';
import { auth, clerkClient } from '@clerk/nextjs/server';

// Get admin emails from environment variable or defaults
const getAdminEmails = (): string[] => {
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const list = adminEmailsEnv.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
    const defaults = ['erovelto1@gmail.com', 'erovelto@outlook.com'];
    defaults.forEach(email => {
        if (!list.includes(email)) list.push(email);
    });
    return list;
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
        const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase();

        if (!userEmail) return false;

        const adminEmails = getAdminEmails();
        const isAdmin = adminEmails.includes(userEmail) || userEmail.includes('erovelto');

        if (role === 'admin') {
            return isAdmin;
        }

        if (isAdmin) return true; // Admins have all roles

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
        const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase();

        if (!userEmail) return 'free';

        const adminEmails = getAdminEmails();
        const isAdmin = adminEmails.includes(userEmail) || userEmail.includes('erovelto');

        if (isAdmin) return 'admin';

        const userPlan = (user.publicMetadata?.plan as string) || 'free';
        return userPlan === 'student' ? 'student' : 'free';
    } catch (error) {
        console.error('[getUserRole] Error fetching user:', error);
        return 'free';
    }
};
