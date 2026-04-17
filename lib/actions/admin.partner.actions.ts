"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import PartnerAccount from "@/lib/db/models/PartnerAccount";
import PartnerCommission from "@/lib/db/models/PartnerCommission";
import PartnerPayout from "@/lib/db/models/PartnerPayout";
import { revalidatePath } from "next/cache";

import { checkRole } from "@/lib/roles";

async function checkAdmin() {
    return await checkRole('admin');
}

export async function getAdminPartners() {
    if (!await checkAdmin()) return [];

    try {
        await connectDB();
        const partners = await PartnerAccount.find({})
            .populate({
                path: 'userId',
                select: 'firstName lastName email referredBy'
            })
            .populate({
                path: 'userId.referredBy',
                select: 'firstName lastName'
            })
            .lean();

        // For each partner, get commission summaries and network size
        const enhancedPartners = await Promise.all(partners.map(async (partner: any) => {
            const commissions = await PartnerCommission.find({ partnerId: partner._id });
            const referralCount = await User.countDocuments({ referredBy: partner.userId._id });
            
            const pendingAmount = commissions
                .filter(c => c.status === 'pending')
                .reduce((acc, curr) => acc + curr.amount, 0);
            
            return {
                ...partner,
                pendingAmount,
                referralCount
            };
        }));

        return JSON.parse(JSON.stringify(enhancedPartners));
    } catch (error) {
        console.error("Failed to fetch admin partners:", error);
        return [];
    }
}

export async function processPartnerPayout(partnerId: string, amount: number) {
    if (!await checkAdmin()) return { success: false, error: "Unauthorized" };

    try {
        await connectDB();
        const partnerAccount = await PartnerAccount.findById(partnerId);
        
        if (!partnerAccount) return { success: false, error: "Partner not found" };
        if (partnerAccount.balance < amount) return { success: false, error: "Insufficient balance" };
        if (amount < 10) return { success: false, error: "Minimum payout is $10.00" };

        // Create payout record
        await PartnerPayout.create({
            partnerId: partnerId,
            userId: partnerAccount.userId,
            amount,
            status: 'completed',
            payoutMethod: 'manual',
            notes: 'Processed by Admin'
        });

        // Deduct from balance
        partnerAccount.balance -= amount;
        await partnerAccount.save();

        revalidatePath('/partner');
        revalidatePath('/admin/partners');

        return { success: true };
    } catch (error) {
        console.error("Failed to process payout:", error);
        return { success: false, error: "Processing failed" };
    }
}

export async function finalizePartnerCommissions() {
    if (!await checkAdmin()) return { success: false, error: "Unauthorized" };

    try {
        await connectDB();
        const now = new Date();
        
        // Find all pending commissions where eligibleDate has passed
        const eligibleCommissions = await PartnerCommission.find({
            status: 'pending',
            eligibleDate: { $lte: now }
        });

        if (eligibleCommissions.length === 0) return { success: true, count: 0 };

        let processedCount = 0;
        for (const commission of eligibleCommissions) {
            // Update commission status
            commission.status = 'approved';
            await commission.save();

            // Add to partner balance
            await PartnerAccount.findByIdAndUpdate(commission.partnerId, {
                $inc: { balance: commission.amount }
            });
            processedCount++;
        }

        revalidatePath('/partner');
        return { success: true, count: processedCount };
    } catch (error) {
        console.error("Failed to finalize commissions:", error);
        return { success: false, error: "Finalization failed" };
    }
}

export async function updatePartnerCommissionSettings(partnerId: string, data: { type: 'percentage' | 'flat', value: number }) {
    if (!await checkAdmin()) return { success: false, error: "Unauthorized" };

    try {
        await connectDB();
        await PartnerAccount.findByIdAndUpdate(partnerId, {
            commissionType: data.type,
            commissionValue: data.value
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to update partner settings:", error);
        return { success: false, error: "Update failed" };
    }
}

export async function deletePartnerAccount(partnerId: string) {
    if (!await checkAdmin()) return { success: false, error: "Unauthorized" };

    try {
        await connectDB();
        
        // Find the partner account to get the userId
        const partner = await PartnerAccount.findById(partnerId);
        if (!partner) return { success: false, error: "Partner not found" };

        const userId = partner.userId;

        // 1. Delete the PartnerAccount
        await PartnerAccount.findByIdAndDelete(partnerId);

        // 2. Update the User model to remove partner status
        await User.findByIdAndUpdate(userId, { isPartner: false });

        revalidatePath('/admin/partners');
        revalidatePath('/partner');
        
        return { success: true };
    } catch (error) {
        console.error("Failed to delete partner account:", error);
        return { success: false, error: "Deletion failed" };
    }
}
