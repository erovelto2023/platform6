
'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import CalendarService from '../db/models/CalendarService';
import { getOrCreateBusiness } from './business.actions';

export async function getCalendarServices() {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const services = await CalendarService.find({ businessId }).sort({ name: 1 });

        return { success: true, data: JSON.parse(JSON.stringify(services)) };
    } catch (error) {
        console.error('[GET_CALENDAR_SERVICES]', error);
        return { success: false, error: 'Failed to fetch services' };
    }
}

export async function getCalendarService(identifier: string) {
    try {
        // We might be looking up by public slug, so we can't restrict by businessId from auth/cookie
        // logic here needs to change.
        // Public booking page calls this. It doesn't have a business context?
        // Wait, the original code looked up `businessId` from `getOrCreateBusiness`.
        // If this is a PUBLIC page, `getOrCreateBusiness` might fail or return a default?
        // Let's re-read getOrCreateBusiness.

        await connectToDatabase();

        // Check if identifier is a valid ObjectId
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

        let service;
        if (isObjectId) {
            service = await CalendarService.findById(identifier);
        } else {
            service = await CalendarService.findOne({ slug: identifier });
        }

        if (!service) {
            return { success: false, error: 'Service not found' };
        }

        return { success: true, data: JSON.parse(JSON.stringify(service)) };
    } catch (error) {
        console.error('[GET_CALENDAR_SERVICE]', error);
        return { success: false, error: 'Failed to fetch service' };
    }
}

export async function createCalendarService(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const service = await CalendarService.create({
            ...data,
            businessId,
        });

        revalidatePath('/calendar/services');

        return { success: true, data: JSON.parse(JSON.stringify(service)) };
    } catch (error) {
        console.error('[CREATE_CALENDAR_SERVICE]', error);
        return { success: false, error: 'Failed to create service' };
    }
}

export async function updateCalendarService(id: string, data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const service = await CalendarService.findOneAndUpdate(
            { _id: id, businessId },
            data,
            { new: true }
        );

        if (!service) {
            return { success: false, error: 'Service not found' };
        }

        revalidatePath('/calendar/services');

        return { success: true, data: JSON.parse(JSON.stringify(service)) };
    } catch (error) {
        console.error('[UPDATE_CALENDAR_SERVICE]', error);
        return { success: false, error: 'Failed to update service' };
    }
}

export async function deleteCalendarService(id: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        await CalendarService.findOneAndDelete({ _id: id, businessId });

        revalidatePath('/calendar/services');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_CALENDAR_SERVICE]', error);
        return { success: false, error: 'Failed to delete service' };
    }
}
