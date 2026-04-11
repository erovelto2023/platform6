"use server";

import connectDB from "@/lib/db/connect";
import Booking from "@/lib/db/models/Booking";
import Availability from "@/lib/db/models/Availability";
import CalendarService from "@/lib/db/models/CalendarService";
import { getActionContext } from "@/lib/actions/auth-utils";
import { revalidatePath } from "next/cache";
import { addMinutes, format, isBefore, isAfter, startOfDay, endOfDay, setHours, setMinutes } from "date-fns";
import { ActionResponse, BookingData } from "@/types/booking";
import { sendBookingConfirmation } from "./email.actions";
import Business from "@/lib/db/models/Business";
import { Types } from "mongoose";

/**
 * Generates available slots for a specific date and service.
 * Respects preBuffer, postBuffer, and capacity defined in the Service model.
 */
export async function getAvailableSlots(date: Date | string, serviceId: string): Promise<ActionResponse<string[]>> {
    try {
        await connectDB();
        const targetDate = new Date(date);

        // 1. Fetch Service Details
        const service = await CalendarService.findById(serviceId);
        if (!service) return { success: false, error: 'Service not found' };
        
        const businessId = service.businessId;
        const duration = service.duration || 60;
        const preBuffer = service.preBuffer || 0;
        const postBuffer = service.postBuffer || 0;
        const capacity = service.capacity || 1;

        // 2. Resolve Availability Rules (Date Override > Recurring)
        const pStart = startOfDay(targetDate);
        const pEnd = endOfDay(targetDate);

        const [dateOverride, recurringRule] = await Promise.all([
            Availability.findOne({ businessId, type: 'override', date: { $gte: pStart, $lte: pEnd } }),
            Availability.findOne({ businessId, type: 'recurring', dayOfWeek: targetDate.getDay() })
        ]);

        const activeRule = dateOverride || recurringRule;
        if (!activeRule || !activeRule.isActive) return { success: true, data: [] };

        // 3. Fetch Existing Bookings to Check Collisions
        const existingBookings = await Booking.find({
            businessId,
            startTime: { $gte: pStart, $lte: pEnd },
            status: { $in: ['pending', 'confirmed', 'attended'] }
        }).populate('serviceId');

        // 4. Generate Slots
        const availableSlots: string[] = [];
        const timeBlocks = activeRule.slots?.length ? activeRule.slots : [];

        for (const block of timeBlocks) {
            const [startH, startM] = block.startTime.split(':').map(Number);
            const [endH, endM] = block.endTime.split(':').map(Number);

            let currentPointer = setMinutes(setHours(new Date(targetDate), startH), startM);
            const limitTime = setMinutes(setHours(new Date(targetDate), endH), endM);

            while (isBefore(addMinutes(currentPointer, duration), limitTime) || 
                   format(addMinutes(currentPointer, duration), 'HH:mm') === format(limitTime, 'HH:mm')) {
                
                const slotStart = currentPointer;
                const slotEnd = addMinutes(currentPointer, duration);
                
                const overlappingBookings = existingBookings.filter(booking => {
                    const svc = booking.serviceId as any;
                    const bPre = svc?.preBuffer || 0;
                    const bPost = svc?.postBuffer || 0;
                    
                    const bStartWithBuffer = addMinutes(new Date(booking.startTime), -bPre);
                    const bEndWithBuffer = addMinutes(new Date(booking.endTime), bPost);
                    
                    return (isBefore(slotStart, bEndWithBuffer) && isAfter(slotEnd, bStartWithBuffer));
                });

                const sameServiceBookings = overlappingBookings.filter(b => b.serviceId._id.toString() === serviceId);
                const hasOtherServiceConflict = overlappingBookings.some(b => b.serviceId._id.toString() !== serviceId);

                if (!hasOtherServiceConflict && sameServiceBookings.length < capacity) {
                    availableSlots.push(format(slotStart, 'HH:mm'));
                }

                const increment = Math.min(duration, 30);
                currentPointer = addMinutes(currentPointer, increment);
            }
        }

        return { success: true, data: Array.from(new Set(availableSlots)).sort() };
    } catch (error) {
        console.error('[GET_AVAILABLE_SLOTS]', error);
        return { success: false, error: 'Failed to fetch slots' };
    }
}

/**
 * Bulk create availability for a range of dates or days.
 */
export async function batchCreateAvailability(data: {
    daysOfWeek?: number[],
    specificDates?: Date[],
    slots: { startTime: string; endTime: string }[]
}): Promise<ActionResponse> {
    try {
        const context = await getActionContext();
        if (!context.success || !context.data) return { success: false, error: 'Unauthorized' };
        const businessId = context.data.business._id;

        await connectDB();

        if (data.daysOfWeek) {
            for (const day of data.daysOfWeek) {
                await Availability.findOneAndUpdate(
                    { businessId, dayOfWeek: day, type: 'recurring' },
                    { businessId, dayOfWeek: day, slots: data.slots, isActive: true, type: 'recurring' },
                    { upsert: true }
                );
            }
        }

        if (data.specificDates) {
            for (const date of data.specificDates) {
                const pStart = startOfDay(new Date(date));
                await Availability.findOneAndUpdate(
                    { businessId, date: pStart, type: 'override' },
                    { businessId, date: pStart, slots: data.slots, isActive: true, type: 'override' },
                    { upsert: true }
                );
            }
        }

        revalidatePath('/calendar/availability');
        return { success: true };
    } catch (error) {
        console.error('[BATCH_CREATE_AVAILABILITY]', error);
        return { success: false, error: 'Failed to batch create' };
    }
}

/**
 * Upsert single availability rule (recurring or override)
 */
export async function upsertAvailability(data: any): Promise<ActionResponse> {
    try {
        const context = await getActionContext();
        if (!context.success || !context.data) return { success: false, error: 'Unauthorized' };
        const businessId = context.data.business._id;

        await connectDB();

        let query: any = { businessId };
        if (data.date) {
            const pStart = startOfDay(new Date(data.date));
            query.date = pStart;
            query.type = 'override';
        } else {
            query.dayOfWeek = data.dayOfWeek;
            query.type = 'recurring';
        }

        const availability = await Availability.findOneAndUpdate(
            query,
            { ...data, businessId, type: query.type },
            { new: true, upsert: true }
        );

        revalidatePath('/calendar/availability');
        return { success: true, data: JSON.parse(JSON.stringify(availability)) };
    } catch (error) {
        console.error('[UPSERT_AVAILABILITY]', error);
        return { success: false, error: 'Failed to save' };
    }
}

export async function createBooking(data: any): Promise<ActionResponse<BookingData>> {
    try {
        await connectDB();

        const service = await CalendarService.findById(data.serviceId);
        if (!service) return { success: false, error: 'Service not found' };

        const startTime = new Date(data.startTime);
        const duration = service.duration || 60;
        const endTime = addMinutes(startTime, duration);

        const magicLinkToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const booking = await Booking.create({
            businessId: service.businessId,
            serviceId: data.serviceId,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            startTime,
            endTime,
            notes: data.notes,
            status: data.status || 'confirmed',
            paymentStatus: data.paymentStatus || 'unpaid',
            capacityUsed: 1,
            magicLinkToken,
            location: service.location || data.location || 'Online'
        });

        try {
            await sendBookingConfirmation(service.businessId, {
                customerEmail: booking.customerEmail as string,
                customerName: booking.customerName as string,
                serviceName: service.name as string,
                startTime: booking.startTime as Date,
                location: (booking as any).location || service.location || 'Online',
                magicLink: `${process.env.NEXT_PUBLIC_APP_URL}/manage/${magicLinkToken}`
            });
        } catch (emailError) {
            console.warn('[EMAIL_FAILED]', emailError);
        }

        revalidatePath('/bookings');
        return { success: true, data: JSON.parse(JSON.stringify(booking)) };
    } catch (error) {
        console.error('[CREATE_BOOKING]', error);
        return { success: false, error: 'Failed to create booking' };
    }
}

export async function getBookings(): Promise<ActionResponse<BookingData[]>> {
    try {
        const context = await getActionContext();
        if (!context.success || !context.data) return { success: false, error: 'Unauthorized' };
        
        await connectDB();
        const bookings = await Booking.find({ businessId: context.data.business._id })
            .populate('serviceId', 'name duration preBuffer postBuffer color')
            .sort({ startTime: 1 });

        return { success: true, data: JSON.parse(JSON.stringify(bookings)) };
    } catch (error) {
        console.error('[GET_BOOKINGS]', error);
        return { success: false, error: 'Failed to fetch bookings' };
    }
}

export async function getAvailabilityRules(): Promise<ActionResponse<{ recurring: any[], overrides: any[] }>> {
    try {
        const context = await getActionContext();
        if (!context.success || !context.data) return { success: false, error: 'Unauthorized' };
        
        const businessId = context.data.business._id;
        await connectDB();

        const recurring = await Availability.find({ businessId, type: 'recurring' }).sort({ dayOfWeek: 1 });
        const overrides = await Availability.find({ businessId, type: 'override', date: { $gte: startOfDay(new Date()) } }).sort({ date: 1 });

        return {
            success: true,
            data: {
                recurring: JSON.parse(JSON.stringify(recurring)),
                overrides: JSON.parse(JSON.stringify(overrides))
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch rules' };
    }
}

export async function updateBooking(id: string, data: Partial<BookingData>): Promise<ActionResponse<BookingData>> {
    try {
        const context = await getActionContext();
        if (!context.success || !context.data) return { success: false, error: 'Unauthorized' };
        const businessId = context.data.business._id;

        await connectDB();

        const booking = await Booking.findOneAndUpdate(
            { _id: id, businessId },
            { $set: data },
            { new: true }
        ).populate('serviceId', 'name duration preBuffer postBuffer color');

        if (!booking) return { success: false, error: 'Booking not found or access denied' };

        revalidatePath('/bookings');
        return { success: true, data: JSON.parse(JSON.stringify(booking)) };
    } catch (error) {
        console.error('[UPDATE_BOOKING]', error);
        return { success: false, error: 'Failed to update booking' };
    }
}

export async function deleteBooking(id: string): Promise<ActionResponse> {
    try {
        const context = await getActionContext();
        if (!context.success || !context.data) return { success: false, error: 'Unauthorized' };
        const businessId = context.data.business._id;

        await connectDB();

        const result = await Booking.deleteOne({ _id: id, businessId });
        if (result.deletedCount === 0) return { success: false, error: 'Booking not found or access denied' };

        revalidatePath('/bookings');
        return { success: true };
    } catch (error) {
        console.error('[DELETE_BOOKING]', error);
        return { success: false, error: 'Failed to delete booking' };
    }
}

/**
 * Public discovery of a business by slug
 */
export async function getPublicBusinessBySlug(slug: string): Promise<ActionResponse<any>> {
    try {
        await connectDB();
        const business = await Business.findOne({ 'calendarSettings.slug': slug })
            .select('name logo calendarSettings color');
        
        if (!business) return { success: false, error: 'Business not found' };

        const services = await CalendarService.find({ businessId: business._id, isActive: true });

        return { 
            success: true, 
            data: { 
                business: JSON.parse(JSON.stringify(business)),
                services: JSON.parse(JSON.stringify(services))
            } 
        };
    } catch (error) {
        return { success: false, error: 'Failed to discover business' };
    }
}

/**
 * Public management of a booking via magic link token
 */
export async function getBookingByToken(token: string): Promise<ActionResponse<any>> {
    try {
        await connectDB();
        const booking = await Booking.findOne({ magicLinkToken: token })
            .populate('serviceId', 'name duration preBuffer postBuffer color location');
        
        if (!booking) return { success: false, error: 'Invalid or expired magic link' };

        return { success: true, data: JSON.parse(JSON.stringify(booking)) };
    } catch (error) {
        return { success: false, error: 'Failed to fetch booking' };
    }
}
