'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Business from '../db/models/Business';
import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

const BUSINESS_COOKIE_NAME = 'accounting_business_id';

export async function getUserBusinesses() {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Unauthorized' };

        await connectToDatabase();
        const businesses = await Business.find({ userId });

        return { success: true, data: JSON.parse(JSON.stringify(businesses)) };
    } catch (error) {
        console.error('[GET_USER_BUSINESSES]', error);
        return { success: false, error: 'Failed to fetch businesses' };
    }
}

export async function createBusiness(data: { name: string, currency?: string }) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Unauthorized' };

        await connectToDatabase();
        const business = await Business.create({
            userId,
            name: data.name,
            currency: data.currency || 'USD',
            email: '', // Optional or default
        });

        return { success: true, data: JSON.parse(JSON.stringify(business)) };
    } catch (error) {
        console.error('[CREATE_BUSINESS]', error);
        return { success: false, error: 'Failed to create business' };
    }
}

export async function switchBusiness(businessId: string) {
    try {
        const cookieStore = await cookies();
        cookieStore.set(BUSINESS_COOKIE_NAME, businessId);
        return { success: true };
    } catch (error) {
        console.error('[SWITCH_BUSINESS]', error);
        return { success: false, error: 'Failed to switch business' };
    }
}

export async function getActiveBusinessId() {
    const cookieStore = await cookies();
    return cookieStore.get(BUSINESS_COOKIE_NAME)?.value;
}


export async function getOrCreateBusiness() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        let business;
        const cookieStore = await cookies();
        const activeBusinessId = cookieStore.get(BUSINESS_COOKIE_NAME)?.value;

        if (activeBusinessId) {
            business = await Business.findOne({ _id: activeBusinessId, userId });
        }

        if (!business) {
            // Fallback to first business
            business = await Business.findOne({ userId });
        }

        if (!business) {
            // Create default business profile
            business = await Business.create({
                userId,
                name: 'My Business',
                email: '',
                currency: 'USD',
            });
        }

        // Ensure the cookie is set to the current business if it wasn't
        if (!activeBusinessId || activeBusinessId !== business._id.toString()) {
            // We can't set cookies in a Server Component directly if it's not an Action or Route Handler?
            // Actually getOrCreateBusiness is an action, so we can set cookies.
            cookieStore.set(BUSINESS_COOKIE_NAME, business._id.toString());
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
