import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import PersonalAffiliateOffer from "@/lib/db/models/PersonalAffiliateOffer";

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await connectDB();

        const offer = await PersonalAffiliateOffer.findByIdAndUpdate(
            id,
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!offer || !offer.affiliateLink) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Standard redirect to the affiliate link
        return NextResponse.redirect(offer.affiliateLink);

    } catch (error) {
        console.error("[CLICK_TRACKING_ERROR]", error);
        return NextResponse.redirect(new URL("/", req.url));
    }
}
