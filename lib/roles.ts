import { Roles } from '@/types/globals';
import { auth, clerkClient } from '@clerk/nextjs/server';

import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

// Hardcoded admin Clerk IDs
const ADMIN_CLERK_IDS = ['user_3Bj6dEmUZDloX8iV0KxAgq1PIMS'];

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

const checkIsAdmin = async (userId: string): Promise<boolean> => {
    if (ADMIN_CLERK_IDS.includes(userId)) {
        return true;
    }

    try {
        await connectDB();
        const dbUser = await User.findOne({ clerkId: userId }).lean();
        if (dbUser) {
            const emailLower = (dbUser.email || '').toLowerCase();
            const adminEmails = getAdminEmails();
            if (adminEmails.includes(emailLower) || emailLower.includes('erovelto') || dbUser.role === 'admin') {
                return true;
            }
        }
    } catch (dbErr) {
        console.error('[checkIsAdmin] Database check failed:', dbErr);
    }

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase();

        if (userEmail) {
            const adminEmails = getAdminEmails();
            if (adminEmails.includes(userEmail) || userEmail.includes('erovelto')) {
                return true;
            }
        }
    } catch (clerkErr) {
        console.error('[checkIsAdmin] Clerk check failed:', clerkErr);
    }

    return false;
};

export const checkRole = async (role: Roles) => {
    const { userId } = await auth();

    if (!userId) {
        console.log('[checkRole] No userId found');
        return false;
    }

    const isAdmin = await checkIsAdmin(userId);

    if (role === 'admin') {
        return isAdmin;
    }

    if (isAdmin) return true; // Admins have all roles

    try {
        await connectDB();
        const dbUser = await User.findOne({ clerkId: userId }).lean();
        const userPlan = dbUser?.role || 'free';
        
        if (role === 'student') return userPlan === 'student';
        if (role === 'free') return true;
    } catch (error) {
        console.error('[checkRole] DB fallback error:', error);
    }

    return false;
};

export const getUserRole = async (): Promise<Roles> => {
    const { userId } = await auth();

    if (!userId) {
        return 'free';
    }

    const isAdmin = await checkIsAdmin(userId);
    if (isAdmin) return 'admin';

    try {
        await connectDB();
        const dbUser = await User.findOne({ clerkId: userId }).lean();
        if (dbUser && dbUser.role) {
            return dbUser.role as Roles;
        }
    } catch (error) {
        console.error('[getUserRole] DB fallback error:', error);
    }

    return 'free';
};
