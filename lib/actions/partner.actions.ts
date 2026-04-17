"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import PartnerAccount from "@/lib/db/models/PartnerAccount";
import PartnerCommission from "@/lib/db/models/PartnerCommission";
import PartnerPayout from "@/lib/db/models/PartnerPayout";
import Offer from "@/lib/db/models/Offer";

export async function getPartnerStats() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        await connectDB();
        const user = await User.findOne({ clerkId: clerkUser.id });
        if (!user) return null;

        const partnerAccount = await PartnerAccount.findOne({ userId: user._id });
        if (!partnerAccount) return null;

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

        const partnerAccount = await PartnerAccount.findOne({ userId: user._id });
        if (!partnerAccount) return [];

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://platform6.com';
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

        const partnerAccount = await PartnerAccount.findOne({ userId: user._id });
        if (!partnerAccount) return [];

        const payouts = await PartnerPayout.find({ partnerId: partnerAccount._id })
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(payouts));
    } catch (error) {
        console.error("Failed to fetch partner payouts:", error);
        return [];
    }
}
