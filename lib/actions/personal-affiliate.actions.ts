"use server";

import connectDB from "@/lib/db/connect";
import PersonalAffiliateOffer from "@/lib/db/models/PersonalAffiliateOffer";
import { revalidatePath } from "next/cache";

export async function createPersonalOffer(data: any) {
    try {
        await connectDB();
        const offer = await PersonalAffiliateOffer.create(data);
        revalidatePath("/admin/affiliate-catalog");
        return { success: true, data: JSON.parse(JSON.stringify(offer)) };
    } catch (error: any) {
        console.error('[CREATE_PERSONAL_OFFER]', error);
        return { success: false, error: error.message };
    }
}

export async function getPersonalOffers() {
    try {
        await connectDB();
        const offers = await PersonalAffiliateOffer.find().sort({ createdAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(offers)) };
    } catch (error: any) {
        console.error('[GET_PERSONAL_OFFERS]', error);
        return { success: false, error: error.message };
    }
}

export async function updatePersonalOffer(id: string, data: any) {
    try {
        await connectDB();
        const offer = await PersonalAffiliateOffer.findByIdAndUpdate(id, data, { new: true });
        revalidatePath("/admin/affiliate-catalog");
        return { success: true, data: JSON.parse(JSON.stringify(offer)) };
    } catch (error: any) {
        console.error('[UPDATE_PERSONAL_OFFER]', error);
        return { success: false, error: error.message };
    }
}

export async function deletePersonalOffer(id: string) {
    try {
        await connectDB();
        await PersonalAffiliateOffer.findByIdAndDelete(id);
        revalidatePath("/admin/affiliate-catalog");
        return { success: true };
    } catch (error: any) {
        console.error('[DELETE_PERSONAL_OFFER]', error);
        return { success: false, error: error.message };
    }
}

export async function trackCatalogVisitByUrl(url: string) {
    try {
        await connectDB();
        // We look for any offer that has this URL as its destination
        // We use regex to handle potential trailing slashes or protocol differences
        const cleanUrl = url.split('?')[0].replace(/\/$/, "");
        
        await PersonalAffiliateOffer.updateMany(
            { 
                destinationLink: { 
                    $regex: cleanUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
                    $options: 'i' 
                } 
            },
            { $inc: { clicks: 1 } }
        );
        return { success: true };
    } catch (error) {
        console.error('[TRACK_CATALOG_VISIT]', error);
        return { success: false };
    }
}
