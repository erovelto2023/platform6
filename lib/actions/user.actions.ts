"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";

export async function getOrCreateUser() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return null;
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
                username: clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split('@')[0],
                photo: clerkUser.imageUrl,
                onboardingCompleted: true
            });

            console.log('User synced/created in database:', clerkUser.id);
        }

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Error in getOrCreateUser:', error);
        return null; // Handle error appropriately in calling component
    }
}

export async function syncCurrentUser() {
    const user = await getOrCreateUser();
    if (user) {
        return { success: true, user };
    }
    return { success: false, error: "Failed to sync user" };
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
        const user = await getOrCreateUser();
        return user?.role || 'student';
    } catch (error) {
        console.error("[getCurrentUserRole] Failed to fetch user role:", error);
        // Return 'student' as safe default instead of throwing
        return 'student';
    }
}
export async function updateUserPresence(userId: string) {
    try {
        await connectDB();
        await User.findByIdAndUpdate(userId, { lastActiveAt: new Date() });
        return { success: true };
    } catch (error) {
        console.error("Failed to update presence:", error);
        return { success: false };
    }
}

export async function getUsers() {
    try {
        await connectDB();
        const users = await User.find({}).select('firstName lastName profileImage lastActiveAt bio email role').lean();
        return { success: true, data: JSON.parse(JSON.stringify(users)) };
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function updateUserProfile(data: { firstName: string, lastName: string, bio: string }) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Not authenticated" };

        await connectDB();
        const user = await User.findOneAndUpdate(
            { clerkId: clerkUser.id },
            {
                firstName: data.firstName,
                lastName: data.lastName,
                bio: data.bio
            },
            { new: true }
        );

        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error("Failed to update user profile:", error);
        return { success: false, error: "Update failed" };
    }
}
