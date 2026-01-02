"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";

export async function syncCurrentUser() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return { success: false, error: "Not authenticated" };
        }

        await connectDB();

        // Check if user exists in database
        let user = await User.findOne({ clerkId: clerkUser.id });

        if (!user) {
            // Create user if doesn't exist
            user = await User.create({
                clerkId: clerkUser.id,
                email: clerkUser.emailAddresses[0].emailAddress,
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                role: 'student',
            });

            console.log('User synced to database:', clerkUser.id);
        }

        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error('Error syncing user:', error);
        return { success: false, error: "Failed to sync user" };
    }
}

export async function updateAISettings(settings: any) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Not authenticated" };

        await connectDB();
        const user = await User.findOneAndUpdate(
            { clerkId: clerkUser.id },
            { aiSettings: settings },
            { new: true }
        );

        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error("Failed to update AI settings:", error);
        return { success: false, error: "Update failed" };
    }
}

export async function getUserSettings() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        await connectDB();
        const user = await User.findOne({ clerkId: clerkUser.id }).select('aiSettings');
        return user ? JSON.parse(JSON.stringify(user.aiSettings)) : null;
    } catch (error) {
        console.error("Failed to fetch user settings:", error);
        return null;
    }
}

export async function getCurrentUserRole() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            console.log('[getCurrentUserRole] No Clerk user found');
            return null;
        }

        const userEmail = clerkUser.emailAddresses[0].emailAddress;
        console.log('[getCurrentUserRole] Fetching role for:', userEmail);

        await connectDB();
        let user = await User.findOne({ clerkId: clerkUser.id }).select('role email');

        // If user doesn't exist in database, create them first
        if (!user) {
            console.log('[getCurrentUserRole] User not found in DB, creating with student role:', clerkUser.id);
            user = await User.create({
                clerkId: clerkUser.id,
                email: userEmail,
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                role: 'student',
            });
            console.log('[getCurrentUserRole] User auto-synced to database:', clerkUser.id);
        }

        const role = user?.role || 'student';
        console.log('[getCurrentUserRole] DB email:', user?.email, 'DB role:', role);
        console.log('[getCurrentUserRole] Returning role:', role, 'for user:', userEmail);
        return role;
    } catch (error) {
        console.error("[getCurrentUserRole] Failed to fetch user role:", error);
        // Return 'student' as safe default instead of throwing
        return 'student';
    }
}
