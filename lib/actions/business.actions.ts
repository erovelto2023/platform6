'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Business from '../db/models/Business';
import { auth, currentUser } from '@clerk/nextjs/server';
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
        const user = await currentUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        await connectToDatabase();
        const business = await Business.create({
            userId: user.id,
            name: data.name,
            currency: data.currency || 'USD',
            email: user.emailAddresses[0]?.emailAddress || '',
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
        const user = await currentUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        let business;
        const cookieStore = await cookies();
        const activeBusinessId = cookieStore.get(BUSINESS_COOKIE_NAME)?.value;
        const userId = user.id;

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
                email: user.emailAddresses[0]?.emailAddress || '',
                currency: 'USD',
            });
        }

        // Ensure the cookie is set to the current business if it wasn't
        // Note: we cannot set cookies here if called from a Server Component.
        // We will handle default cookie setting in a Client Component (BusinessInitializer)
        // if (!activeBusinessId || activeBusinessId !== business._id.toString()) {
        //     cookieStore.set(BUSINESS_COOKIE_NAME, business._id.toString());
        // }

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

export async function updateCalendarSettings(settings: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        // If slug is being updated, check uniqueness
        if (settings.slug) {
            const existing = await Business.findOne({
                'calendarSettings.slug': settings.slug,
                _id: { $ne: businessId }
            });
            if (existing) {
                return { success: false, error: 'Booking URL slug is already taken' };
            }
        }

        const business = await Business.findByIdAndUpdate(
            businessId,
            { $set: { calendarSettings: settings } },
            { new: true }
        );

        revalidatePath('/calendar/settings');
        return { success: true, data: JSON.parse(JSON.stringify(business)) };
    } catch (error) {
        console.error('[UPDATE_CALENDAR_SETTINGS]', error);
        return { success: false, error: 'Failed to update calendar settings' };
    }
}
