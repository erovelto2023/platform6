
'use server';

import connectToDatabase from "@/lib/db/connect";
import Campaign from "@/lib/db/models/Campaign";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { revalidatePath } from "next/cache";

export async function createCampaign(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const userId = businessResult.data.userId;

        await connectToDatabase();

        const newCampaign = await Campaign.create({
            ...data,
            userId,
            status: data.status || 'planning'
        });

        revalidatePath('/calendar/content');
        return { success: true, data: JSON.parse(JSON.stringify(newCampaign)) };
    } catch (error) {
        console.error('[CREATE_CAMPAIGN]', error);
        return { success: false, error: 'Failed to create campaign' };
    }
}

export async function updateCampaign(id: string, data: any) {
    try {
        await connectToDatabase();
        const updatedCampaign = await Campaign.findByIdAndUpdate(id, data, { new: true });

        if (!updatedCampaign) {
            return { success: false, error: 'Campaign not found' };
        }

        revalidatePath('/calendar/content');
        return { success: true, data: JSON.parse(JSON.stringify(updatedCampaign)) };
    } catch (error) {
        console.error('[UPDATE_CAMPAIGN]', error);
        return { success: false, error: 'Failed to update campaign' };
    }
}

export async function deleteCampaign(id: string) {
    try {
        await connectToDatabase();
        await Campaign.findByIdAndDelete(id);
        revalidatePath('/calendar/content');
        return { success: true };
    } catch (error) {
        console.error('[DELETE_CAMPAIGN]', error);
        return { success: false, error: 'Failed to delete campaign' };
    }
}

export async function getCampaigns() {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) return { success: false, error: "Business not found" };
        const userId = businessResult.data.userId;

        await connectToDatabase();
        const campaigns = await Campaign.find({ userId }).sort({ createdAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(campaigns)) };
    } catch (error) {
        console.error('[GET_CAMPAIGNS]', error);
        return { success: false, error: 'Failed to fetch campaigns' };
    }
}
