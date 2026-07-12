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
    return true; // Bypass lock, allow everything
};

export const getUserRole = async (): Promise<Roles> => {
    const { userId } = await auth();

    if (!userId) {
        return 'free';
    }
    return 'admin'; // Bypass lock, allow everything
};
