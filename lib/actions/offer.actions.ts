
'use server';

import connectToDatabase from "@/lib/db/connect";
import Offer from "@/lib/db/models/Offer";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { revalidatePath } from "next/cache";

export async function createOffer(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;
        const userId = businessResult.data.userId;

        await connectToDatabase();

        const slug = data.slug || data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const newOffer = await Offer.create({
            ...data,
            slug,
            userId,
            businessId,
            status: data.status || 'draft'
        });

        revalidatePath('/admin/offers');
        return { success: true, data: JSON.parse(JSON.stringify(newOffer)) };
    } catch (error: any) {
        console.error('[CREATE_OFFER]', error);
        return { success: false, error: error.message || 'Failed to create offer' };
    }
}

export async function updateOffer(id: string, data: any) {
    try {
        await connectToDatabase();
        if (data.name && !data.slug) {
             data.slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }
        
        const updatedOffer = await Offer.findByIdAndUpdate(id, data, { new: true });

        if (!updatedOffer) {
            return { success: false, error: 'Offer not found' };
        }

        revalidatePath('/admin/offers');
        revalidatePath(`/admin/offers/${id}`);
        if (updatedOffer.slug) {
            revalidatePath(`/offers/${updatedOffer.slug}`);
        }
        
        return { success: true, data: JSON.parse(JSON.stringify(updatedOffer)) };
    } catch (error: any) {
        console.error('[UPDATE_OFFER]', error);
        return { success: false, error: error.message || 'Failed to update offer' };
    }
}

export async function deleteOffer(id: string) {
    try {
        await connectToDatabase();
        const offer = await Offer.findByIdAndDelete(id);
        revalidatePath('/admin/offers');
        return { success: true };
    } catch (error) {
        console.error('[DELETE_OFFER]', error);
        return { success: false, error: 'Failed to delete offer' };
    }
}

export async function getOffers() {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) return { success: false, error: "Business not found" };
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const offers = await Offer.find({ businessId }).sort({ createdAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(offers)) };
    } catch (error) {
        console.error('[GET_OFFERS]', error);
        return { success: false, error: 'Failed to fetch offers' };
    }
}

export async function getOffer(id: string) {
    try {
        await connectToDatabase();
        const offer = await Offer.findById(id);
        if (!offer) return { success: false, error: 'Offer not found' };
        return { success: true, data: JSON.parse(JSON.stringify(offer)) };
    } catch (error) {
        console.error('[GET_OFFER]', error);
        return { success: false, error: 'Failed to fetch offer' };
    }
}

export async function getOfferBySlug(slug: string) {
    try {
        await connectToDatabase();
        const offer = await Offer.findOne({ slug });
        if (!offer) return { success: false, error: 'Offer not found' };
        return { success: true, data: JSON.parse(JSON.stringify(offer)) };
    } catch (error) {
        console.error('[GET_OFFER_BY_SLUG]', error);
        return { success: false, error: 'Failed to fetch offer' };
    }
}

export async function incrementOfferStats(id: string, type: 'view' | 'click', version?: 'A' | 'B') {
    try {
        await connectToDatabase();
        const update: any = {};
        if (type === 'view') {
            update.$inc = { views: 1 };
            if (version === 'A') update.$inc.viewsA = 1;
            if (version === 'B') update.$inc.viewsB = 1;
        } else {
            update.$inc = { clicks: 1 };
            if (version === 'A') update.$inc.clicksA = 1;
            if (version === 'B') update.$inc.clicksB = 1;
        }
        
        await Offer.findByIdAndUpdate(id, update);
        return { success: true };
    } catch (error) {
        console.error('[INCREMENT_STATS]', error);
        return { success: false };
    }
}
