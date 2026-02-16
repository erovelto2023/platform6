
'use server';

import connectToDatabase from "@/lib/db/connect";
import Availability, { IAvailability } from "@/lib/db/models/Availability";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { revalidatePath } from "next/cache";

export async function getAvailability() {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const availability = await Availability.find({ businessId }).sort({ dayOfWeek: 1 });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(availability)),
        };
    } catch (error) {
        console.error('[GET_AVAILABILITY]', error);
        return { success: false, error: 'Failed to fetch availability' };
    }
}

export async function updateAvailability(rules: Partial<IAvailability>[]) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        // This is a bulk update strategy: delete existing for this business and re-create
        // or update individually. For simplicity, we'll upsert based on dayOfWeek.

        for (const rule of rules) {
            if (rule.dayOfWeek !== undefined) {
                await Availability.findOneAndUpdate(
                    { businessId, dayOfWeek: rule.dayOfWeek },
                    {
                        businessId,
                        dayOfWeek: rule.dayOfWeek,
                        startTime: rule.startTime,
                        endTime: rule.endTime,
                        isActive: rule.isActive,
                    },
                    { upsert: true, new: true }
                );
            }
        }

        revalidatePath('/accounting/availability');
        return { success: true };
    } catch (error) {
        console.error('[UPDATE_AVAILABILITY]', error);
        return { success: false, error: 'Failed to update availability' };
    }
}
