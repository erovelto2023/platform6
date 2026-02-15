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

        console.log('[checkRole] User email:', userEmail);

        if (role === 'admin') {
            const adminEmails = getAdminEmails();
            const isAdmin = userEmail ? adminEmails.includes(userEmail) : false;
            console.log('[checkRole] Admin emails:', adminEmails);
            console.log('[checkRole] Is admin:', isAdmin);
            return isAdmin;
        }

        return role === 'student'; // Everyone is at least a student
    } catch (error) {
        console.error('[checkRole] Error fetching user:', error);
        return false;
    }
};

export const getUserRole = async (): Promise<Roles> => {
    const { userId } = await auth();

    if (!userId) {
        console.log('[getUserRole] No userId found, returning student');
        return 'student';
    }

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;

        const adminEmails = getAdminEmails();
        const isAdmin = userEmail ? adminEmails.includes(userEmail) : false;

        console.log('[getUserRole] User email:', userEmail);
        console.log('[getUserRole] Admin emails:', adminEmails);
        console.log('[getUserRole] Returning role:', isAdmin ? 'admin' : 'student');

        return isAdmin ? 'admin' : 'student';
    } catch (error) {
        console.error('[getUserRole] Error fetching user:', error);
        // Force return student on error to prevent layout crash
        return 'student';
    }
};
