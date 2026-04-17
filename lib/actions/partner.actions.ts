"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import PartnerAccount from "@/lib/db/models/PartnerAccount";
import PartnerCommission from "@/lib/db/models/PartnerCommission";
import PartnerPayout from "@/lib/db/models/PartnerPayout";
import Offer from "@/lib/db/models/Offer";
import { revalidatePath } from "next/cache";
import { generateAffiliateCode } from "./user.actions";

async function ensurePartnerAccount(user: any) {
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
        console.log('Partner account generated for user:', user.clerkId);
    }
    return partnerAccount;
}

export async function getPartnerStats() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        await connectDB();
        const user = await User.findOne({ clerkId: clerkUser.id }).populate({
            path: 'referredBy',
            select: 'firstName lastName'
        });
        if (!user) return null;

        const partnerAccount = await ensurePartnerAccount(user);

        // --- Active Linking Sync ---
        // If the user hasn't been linked yet, check for the cookie right now
        if (!user.referredBy) {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            const refCode = cookieStore.get('p6_partner_ref')?.value;

            if (refCode) {
                const partner = await PartnerAccount.findOne({ affiliateCode: refCode });
                if (partner && partner.clerkId !== clerkUser.id) {
                    await User.findByIdAndUpdate(user._id, { referredBy: partner.userId });
                    user.referredBy = partner.userId;
                    console.log(`[getPartnerStats] Late-linked user ${user.clerkId} to ${partner.clerkId}`);
                }
            }
        }

        // Total Signups (Lifetime)
        const totalSignups = await User.countDocuments({ referredBy: user._id });

        // Commissions Summary
        const commissions = await PartnerCommission.find({ partnerId: partnerAccount._id });
        
        const stats = {
            totalSignups,
            totalEarnings: commissions.reduce((acc, curr) => acc + curr.amount, 0),
            pendingEarnings: commissions
                .filter(c => c.status === 'pending')
                .reduce((acc, curr) => acc + curr.amount, 0),
            availableBalance: partnerAccount.balance || 0,
            commissions: JSON.parse(JSON.stringify(commissions)),
            partnerAccount: JSON.parse(JSON.stringify(partnerAccount))
        };

        return stats;
    } catch (error) {
        console.error("Failed to fetch partner stats:", error);
        return null;
    }
}

export async function getPartnerLinks() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return [];

        await connectDB();
        const user = await User.findOne({ clerkId: clerkUser.id });
        if (!user) return [];

        const partnerAccount = await ensurePartnerAccount(user);

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kbusinessacademy.com';
        const affiliateCode = partnerAccount.affiliateCode;

        const mainLink = {
            name: "Platform Main Link",
            description: "Default referral link for the entire platform.",
            url: `${baseUrl}/?ref=${affiliateCode}`
        };

        // Fetch active offers to generate specific links
        const activeOffers = await Offer.find({ status: 'active' }).select('name slug');
        
        const offerLinks = activeOffers.map(offer => ({
            name: offer.name,
            description: "Direct link to this specific offer.",
            url: `${baseUrl}/offers/${offer.slug}?ref=${affiliateCode}`
        }));

        return [mainLink, ...offerLinks];
    } catch (error) {
        console.error("Failed to fetch partner links:", error);
        return [];
    }
}

export async function getPartnerNetwork() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return [];

        await connectDB();
        const user = await User.findOne({ clerkId: clerkUser.id });
        if (!user) return [];

        const signups = await User.find({ referredBy: user._id })
            .select('firstName lastName email createdAt')
            .sort({ createdAt: -1 });

        console.log(`[getPartnerNetwork] Found ${signups.length} signups for user ${clerkUser.id}`);

        return JSON.parse(JSON.stringify(signups));
    } catch (error) {
        console.error("Failed to fetch partner network:", error);
        return [];
    }
}

export async function getPartnerPayouts() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return [];

        await connectDB();
        const user = await User.findOne({ clerkId: clerkUser.id });
        if (!user) return [];

        const partnerAccount = await ensurePartnerAccount(user);

        const payouts = await PartnerPayout.find({ partnerId: partnerAccount._id })
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(payouts));
    } catch (error) {
        console.error("Failed to fetch partner payouts:", error);
        return [];
    }
}

export async function updatePartnerPayoutSettings(data: { email: string, method: string }) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        await connectDB();
        const user = await User.findOne({ clerkId: clerkUser.id });
        if (!user) return { success: false, error: "User not found" };

        const partnerAccount = await PartnerAccount.findOneAndUpdate(
            { userId: user._id },
            { 
                payoutEmail: data.email,
                payoutMethod: data.method 
            },
            { new: true }
        );

        if (!partnerAccount) return { success: false, error: "Partner account not found" };

        revalidatePath('/partner');
        return { success: true };
    } catch (error) {
        console.error("Failed to update payout settings:", error);
        return { success: false, error: "Update failed" };
    }
}
