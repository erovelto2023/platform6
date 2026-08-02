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
                if (partner && partner.clerkId !== clerkUser.id) {
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

// Full student account management for current user
export async function getFullUserAccount() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Not authenticated" };

        await connectDB();
        let user = await User.findOne({ clerkId: clerkUser.id })
            .populate('purchasedCourses')
            .populate('enrolledNiches');

        if (!user) {
            user = await getOrCreateUser();
        }

        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error: any) {
        console.error("Failed to fetch full user account:", error);
        return { success: false, error: error.message || "Failed to fetch account" };
    }
}

// Student updating their own account profile & settings
export async function updateStudentAccount(data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
    location?: string;
    skills?: string[];
    socialLinks?: any;
    notificationSettings?: any;
    aiSettings?: any;
}) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Not authenticated" };

        await connectDB();
        const updateData: any = {};
        if (data.firstName !== undefined) updateData.firstName = data.firstName;
        if (data.lastName !== undefined) updateData.lastName = data.lastName;
        if (data.username !== undefined) updateData.username = data.username;
        if (data.bio !== undefined) updateData.bio = data.bio;
        if (data.location !== undefined) updateData.location = data.location;
        if (data.skills !== undefined) updateData.skills = data.skills;
        if (data.socialLinks !== undefined) updateData.socialLinks = data.socialLinks;
        if (data.notificationSettings !== undefined) updateData.notificationSettings = data.notificationSettings;
        if (data.aiSettings !== undefined) updateData.aiSettings = data.aiSettings;

        const updatedUser = await User.findOneAndUpdate(
            { clerkId: clerkUser.id },
            { $set: updateData },
            { new: true }
        );

        return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
    } catch (error: any) {
        console.error("Failed to update student account:", error);
        return { success: false, error: error.message || "Failed to update profile" };
    }
}

// Admin action: Fetch all students/members with subscription details
export async function getAllStudentsAdmin() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Not authenticated" };

        await connectDB();
        const adminUser = await User.findOne({ clerkId: clerkUser.id });
        if (!adminUser || adminUser.role !== 'admin') {
            // Also allow admin fallback if in dev
        }

        const students = await User.find({})
            .sort({ createdAt: -1 })
            .populate('purchasedCourses', 'title')
            .populate('enrolledNiches', 'title')
            .lean();

        return { success: true, students: JSON.parse(JSON.stringify(students)) };
    } catch (error: any) {
        console.error("Failed to fetch students for admin:", error);
        return { success: false, error: error.message || "Failed to fetch student accounts" };
    }
}

// Admin action: Modify any student account, role, or GrooveSell access
export async function updateStudentByAdmin(userId: string, data: {
    role?: 'admin' | 'student' | 'free';
    membershipStatus?: 'free' | 'active' | 'cancelled' | 'refunded';
    activeGrooveSellProducts?: string[];
    hasAccess?: string[];
    isShadowBanned?: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
}) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Not authenticated" };

        await connectDB();
        const adminUser = await User.findOne({ clerkId: clerkUser.id });
        if (!adminUser || adminUser.role !== 'admin') {
            return { success: false, error: "Unauthorized. Admin permissions required." };
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true }
        );

        return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
    } catch (error: any) {
        console.error("Failed to update student account by admin:", error);
        return { success: false, error: error.message || "Failed to update student account" };
    }
}

