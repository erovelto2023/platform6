'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Business from '../db/models/Business';
import { auth } from '@clerk/nextjs/server';

export async function getOrCreateBusiness() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        let business = await Business.findOne({ userId });

        if (!business) {
            // Create default business profile
            business = await Business.create({
                userId,
                name: 'My Business',
                email: '',
                currency: 'USD',
            });
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(business)),
        };
    } catch (error) {
        console.error('[GET_OR_CREATE_BUSINESS]', error);
        return {
            success: false,
            error: 'Failed to get business profile',
        };
    }
}

export async function updateBusiness(data: any) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        const business = await Business.findOneAndUpdate(
            { userId },
            { $set: data },
            { new: true, upsert: true }
        );

        revalidatePath('/accounting');
        revalidatePath('/accounting/settings');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(business)),
        };
    } catch (error) {
        console.error('[UPDATE_BUSINESS]', error);
        return {
            success: false,
            error: 'Failed to update business profile',
        };
    }
}
