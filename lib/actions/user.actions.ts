"use server";

import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import PartnerAccount from "@/lib/db/models/PartnerAccount";

// Helper function to generate a random unique affiliate code
export async function generateAffiliateCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check for collision
    const existing = await PartnerAccount.findOne({ affiliateCode: code });
    if (existing) {
        return generateAffiliateCode(); // Recursive check
    }
    return code;
}

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
                role: 'free',
                username: clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split('@')[0],
                photo: clerkUser.imageUrl,
                onboardingCompleted: true,
                isPartner: true // Default to true as requested
            });
            console.log('User created in database via sync:', clerkUser.id);
        }

        // --- Referral Linking Logic ---
        // If the user hasn't been referred yet, check for the referral cookie
        if (!user.referredBy) {
            const cookieStore = await cookies();
            const refCode = cookieStore.get('p6_partner_ref')?.value;

            if (refCode) {
                // Find the referrer by their affiliate code
                const partner = await PartnerAccount.findOne({ affiliateCode: refCode });
                
                // Safety checks:
                // 1. Partner exists
                // 2. Not referring self
                // 3. Referred user is "newly" created (we don't want to attribute old users)
                // Note: We check if referredBy is null, which covers most cases. 
                // To be extra strict on "account creation" period:
                const isRecentlyCreated = (new Date().getTime() - new Date(user.createdAt).getTime()) < (24 * 60 * 60 * 1000); // 24 hours

                if (partner && partner.clerkId !== clerkUser.id && isRecentlyCreated) {
                    await User.findByIdAndUpdate(user._id, { referredBy: partner.userId });
                    user.referredBy = partner.userId; // Update local object for return
                    console.log(`User ${user.clerkId} linked to referrer ${partner.clerkId}`);
                }
            }
        }

        // Automatic PartnerAccount creation if missing
        let partnerAccount = await PartnerAccount.findOne({ userId: user._id });
        if (!partnerAccount) {
            const affiliateCode = await generateAffiliateCode();
            partnerAccount = await PartnerAccount.create({
                userId: user._id,
                clerkId: user.clerkId,
                affiliateCode: affiliateCode,
                status: 'active',
                commissionType: 'percentage',
                commissionValue: 45
            });
            console.log('Partner account generated for user:', user.clerkId, 'Code:', affiliateCode);
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
        const users = await User.find({}).select('firstName lastName profileImage lastActiveAt bio email role username').lean();
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
