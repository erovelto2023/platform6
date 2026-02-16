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
            // Use select('+emailSettings.apiKey') to include the hidden field if needed for settings page
            // But usually we don't want to send it back to client in full.
            // For settings page, we might check if it exists but mask it.
            business = await Business.findOne({ _id: activeBusinessId, userId }).select('+emailSettings.apiKey');
        }

        if (!business) {
            // Fallback to first business
            business = await Business.findOne({ userId }).select('+emailSettings.apiKey');
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

        const businessData = JSON.parse(JSON.stringify(business));

        // MASK API KEY for client side security
        if (businessData.emailSettings?.apiKey) {
            businessData.emailSettings.apiKey = '********'; // Mask it
            businessData.emailSettings.isConfigured = true;
        } else {
            if (businessData.emailSettings) businessData.emailSettings.isConfigured = false;
        }


        return {
            success: true,
            data: businessData,
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

        const updateData: any = {
            'calendarSettings.slug': settings.slug,
            'calendarSettings.timezone': settings.timezone,
            'calendarSettings.bufferTime': settings.bufferTime,
            'calendarSettings.slotInterval': settings.slotInterval,
            'calendarSettings.requiresConfirmation': settings.requiresConfirmation,
        };

        const business = await Business.findByIdAndUpdate(
            businessId,
            { $set: updateData },
            { new: true }
        );

        revalidatePath('/calendar/settings');
        return { success: true, data: JSON.parse(JSON.stringify(business)) };
    } catch (error) {
        console.error('[UPDATE_CALENDAR_SETTINGS]', error);
        return { success: false, error: 'Failed to update calendar settings' };
    }
}

export async function updateEmailSettings(settings: { apiKey?: string; fromEmail: string }) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) return { success: false, error: 'Business not found' };
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const updateData: any = {
            'emailSettings.fromEmail': settings.fromEmail,
        };

        // Only update API key if provided (allow empty to keep existing)
        if (settings.apiKey && !settings.apiKey.includes('****')) {
            updateData['emailSettings.apiKey'] = settings.apiKey;
        }

        const business = await Business.findByIdAndUpdate(
            businessId,
            { $set: updateData },
            { new: true }
        );

        revalidatePath('/calendar/settings');
        return { success: true };
    } catch (error) {
        console.error('[UPDATE_EMAIL_SETTINGS]', error);
        return { success: false, error: 'Failed to update email settings' };
    }
}
