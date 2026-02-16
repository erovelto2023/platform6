
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
        const userId = businessResult.data.userId;

        await connectToDatabase();

        const newOffer = await Offer.create({
            ...data,
            userId,
            status: data.status || 'draft'
        });

        revalidatePath('/calendar/content');
        return { success: true, data: JSON.parse(JSON.stringify(newOffer)) };
    } catch (error) {
        console.error('[CREATE_OFFER]', error);
        return { success: false, error: 'Failed to create offer' };
    }
}

export async function updateOffer(id: string, data: any) {
    try {
        await connectToDatabase();
        const updatedOffer = await Offer.findByIdAndUpdate(id, data, { new: true });

        if (!updatedOffer) {
            return { success: false, error: 'Offer not found' };
        }

        revalidatePath('/calendar/content');
        return { success: true, data: JSON.parse(JSON.stringify(updatedOffer)) };
    } catch (error) {
        console.error('[UPDATE_OFFER]', error);
        return { success: false, error: 'Failed to update offer' };
    }
}

export async function deleteOffer(id: string) {
    try {
        await connectToDatabase();
        await Offer.findByIdAndDelete(id);
        revalidatePath('/calendar/content');
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
        const userId = businessResult.data.userId;

        await connectToDatabase();
        const offers = await Offer.find({ userId }).sort({ createdAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(offers)) };
    } catch (error) {
        console.error('[GET_OFFERS]', error);
        return { success: false, error: 'Failed to fetch offers' };
    }
}
