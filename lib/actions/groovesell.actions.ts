"use server";

import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import GrooveSellTransaction from "@/lib/db/models/GrooveSellTransaction";
import { currentUser } from "@clerk/nextjs/server";

export async function activateGrooveSellPurchaseFromThankYou(params: {
    email: string;
    firstName?: string;
    lastName?: string;
    productId?: string;
    productName?: string;
    transId?: string;
    amount?: number;
}) {
    try {
        await connectDB();
        const email = (params.email || "").toLowerCase().trim();
        if (!email) {
            return { success: false, error: "Missing email address" };
        }

        const productId = params.productId || "groovesell_main";
        const productName = params.productName || "K Business Academy Membership";
        const transactionId = params.transId || `GS_TY_${Date.now()}`;
        const amount = params.amount || 0;

        // 1. Log transaction in Mongo
        await GrooveSellTransaction.create({
            transactionId,
            event: "PURCHASE_THANK_YOU",
            buyerEmail: email,
            buyerName: `${params.firstName || ''} ${params.lastName || ''}`.trim() || email.split("@")[0],
            productId,
            productName,
            amount,
            currency: "USD",
            status: "completed",
            rawPayload: params
        });

        // 2. Find or Provision User
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                clerkId: `gs_user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                email,
                firstName: params.firstName || '',
                lastName: params.lastName || '',
                role: "student",
                membershipStatus: "active",
                grooveSellCustomerId: transactionId,
                activeGrooveSellProducts: [productId],
                hasAccess: [productId, "groovesell_member"]
            });
            console.log(`✅ Provisioned new student account from Thank You page: ${email}`);
        } else {
            user.role = "student";
            user.membershipStatus = "active";
            if (!user.activeGrooveSellProducts?.includes(productId)) {
                user.activeGrooveSellProducts = user.activeGrooveSellProducts || [];
                user.activeGrooveSellProducts.push(productId);
            }
            if (!user.hasAccess?.includes(productId)) {
                user.hasAccess = user.hasAccess || [];
                user.hasAccess.push(productId);
            }
            if (!user.hasAccess?.includes("groovesell_member")) {
                user.hasAccess = user.hasAccess || [];
                user.hasAccess.push("groovesell_member");
            }
            await user.save();
            console.log(`✅ Activated existing student account from Thank You page: ${email}`);
        }

        return {
            success: true,
            user: JSON.parse(JSON.stringify(user)),
            productName
        };
    } catch (error: any) {
        console.error("Error activating GrooveSell purchase from Thank You page:", error);
        return { success: false, error: error.message };
    }
}
