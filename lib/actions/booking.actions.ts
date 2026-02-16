
'use server';

import connectToDatabase from "@/lib/db/connect";
import Booking from "@/lib/db/models/Booking";
import Availability from "@/lib/db/models/Availability";
import CalendarService from "@/lib/db/models/CalendarService";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { revalidatePath } from "next/cache";
import { addMinutes, format, parse, isSameDay, setHours, setMinutes, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";
import { sendBookingConfirmation } from "./email.actions";

// Helper to generate slots
export async function getAvailableSlots(date: Date | string, serviceId: string) {
    try {
        await connectToDatabase();
        const targetDate = new Date(date);

        // 1. Get Service Duration & Business
        const service = await CalendarService.findById(serviceId);
        if (!service || !service.duration) {
            return { success: false, error: 'Invalid service or missing duration' };
        }
        const duration = service.duration;
        const businessId = service.businessId;

        // 2. Get Business Settings for Buffer/Interval (optional optimization)
        // const business = await Business.findById(businessId);
        // const buffer = business?.calendarSettings?.bufferTime || 0;
        // const interval = business?.calendarSettings?.slotInterval || 30;
        const interval = 30; // Default for now

        // 3. Get Availability Logic
        // Priority: Date Override > Recurring Rule
        const pStart = startOfDay(targetDate);
        const pEnd = endOfDay(targetDate);

        // Fetch both potential rules
        const [dateOverride, recurringRule] = await Promise.all([
            Availability.findOne({
                businessId,
                date: { $gte: pStart, $lte: pEnd }
            }),
            Availability.findOne({
                businessId,
                dayOfWeek: targetDate.getDay(),
                date: null // Ensure it's a recurring rule
            })
        ]);

        const activeRule = dateOverride || recurringRule;

        if (!activeRule || !activeRule.isActive) {
            return { success: true, data: [] }; // Closed
        }

        // 4. Get existing bookings
        const dayStart = new Date(targetDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(targetDate);
        dayEnd.setHours(23, 59, 59, 999);

        const existingBookings = await Booking.find({
            businessId,
            startTime: { $gte: dayStart, $lte: dayEnd },
            status: { $ne: 'cancelled' }
        });

        // 5. Generate Slots
        const slots: string[] = [];

        // Handle legacy single start/end or new slots array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ruleAny = activeRule as any;
        const timeSlots = ruleAny.slots && ruleAny.slots.length > 0
            ? ruleAny.slots
            : (ruleAny.startTime && ruleAny.endTime ? [{ startTime: ruleAny.startTime, endTime: ruleAny.endTime }] : []);

        for (const slot of timeSlots) {
            const [startHour, startMinute] = slot.startTime.split(':').map(Number);
            const [endHour, endMinute] = slot.endTime.split(':').map(Number);

            let currentSlot = setMinutes(setHours(new Date(targetDate), startHour), startMinute);
            const limitTime = setMinutes(setHours(new Date(targetDate), endHour), endMinute);

            while (isBefore(addMinutes(currentSlot, duration), limitTime) || isSameDay(addMinutes(currentSlot, duration), limitTime) && format(addMinutes(currentSlot, duration), 'HH:mm') === format(limitTime, 'HH:mm')) {
                const slotEnd = addMinutes(currentSlot, duration);

                // Check collision
                const isColliding = existingBookings.some(booking => {
                    const bStart = new Date(booking.startTime);
                    const bEnd = new Date(booking.endTime);
                    // Add buffer check here if needed
                    return (
                        (isAfter(currentSlot, bStart) && isBefore(currentSlot, bEnd)) ||
                        (isAfter(slotEnd, bStart) && isBefore(slotEnd, bEnd)) ||
                        (isBefore(currentSlot, bStart) && isAfter(slotEnd, bEnd)) ||
                        isSameDay(currentSlot, bStart) && format(currentSlot, 'HH:mm') === format(bStart, 'HH:mm')
                    );
                });

                if (!isColliding) {
                    slots.push(format(currentSlot, 'HH:mm'));
                }

                currentSlot = addMinutes(currentSlot, interval);
            }
        }

        // Deduplicate and sort slots
        const uniqueSlots = Array.from(new Set(slots)).sort();

        return { success: true, data: uniqueSlots };

    } catch (error) {
        console.error('[GET_SLOTS]', error);
        return { success: false, error: 'Failed to generate slots' };
    }
}

export async function upsertAvailability(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        let query: any = { businessId };

        if (data.date) {
            // Date Override
            const pStart = startOfDay(new Date(data.date));
            const pEnd = endOfDay(new Date(data.date));
            query.date = { $gte: pStart, $lte: pEnd };
        } else {
            // Recurring Rule
            query.dayOfWeek = data.dayOfWeek;
            query.date = null;
        }

        const availability = await Availability.findOneAndUpdate(
            query,
            {
                ...data,
                businessId,
                // Ensure legacy fields are cleared or synced if using only slots
                // For now, let's keep slots as the source of truth
            },
            { new: true, upsert: true }
        );

        revalidatePath('/calendar/availability');
        return { success: true, data: JSON.parse(JSON.stringify(availability)) };
    } catch (error) {
        console.error('[UPSERT_AVAILABILITY]', error);
        return { success: false, error: 'Failed to save availability' };
    }
}

export async function getAvailabilityRules() {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        // Fetch recurring rules
        const recurring = await Availability.find({ businessId, date: null }).sort({ dayOfWeek: 1 });

        // Fetch future overrides
        const today = startOfDay(new Date());
        const overrides = await Availability.find({ businessId, date: { $gte: today } }).sort({ date: 1 });

        return {
            success: true,
            data: {
                recurring: JSON.parse(JSON.stringify(recurring)),
                overrides: JSON.parse(JSON.stringify(overrides))
            }
        };
    } catch (error) {
        console.error('[GET_AVAILABILITY]', error);
        return { success: false, error: 'Failed to fetch availability' };
    }
}

export async function createBooking(data: any) {
    try {
        await connectToDatabase();

        // Basic validation
        const service = await CalendarService.findById(data.serviceId);
        if (!service) return { success: false, error: 'Service not found' };

        // Calculate end time
        const startTime = new Date(data.startTime);
        const endTime = addMinutes(startTime, service.duration || 30);

        // Double check availability (race condition check omitted for MVP)

        const booking = await Booking.create({
            businessId: service.businessId,
            serviceId: data.serviceId,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            startTime,
            endTime,
            notes: data.notes,
            status: 'confirmed' // Auto-confirm for now, later use settings
        });

        // Update Contact Stats logic could go here (Phase 6)
        // updateContactStats(booking.customerEmail, booking.businessId)...

        // Send Confirmation Email
        await sendBookingConfirmation(
            service.businessId,
            {
                customerEmail: booking.customerEmail,
                customerName: booking.customerName,
                serviceName: service.name,
                startTime: booking.startTime,
                location: service.location
            }
        );

        return { success: true, data: JSON.parse(JSON.stringify(booking)) };
    } catch (error) {
        console.error('[CREATE_BOOKING]', error);
        return { success: false, error: 'Failed to create booking' };
    }
}

export async function getBookings() {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const bookings = await Booking.find({ businessId })
            .populate('serviceId', 'name')
            .sort({ startTime: 1 });

        return { success: true, data: JSON.parse(JSON.stringify(bookings)) };
    } catch (error) {
        console.error('[GET_BOOKINGS]', error);
        return { success: false, error: 'Failed to fetch bookings' };
    }
}
export async function updateBooking(id: string, data: any) {
    try {
        await connectToDatabase();

        // If rescheduling (changing time), validate availability
        if (data.startTime && data.endTime) {
            // simplified check for now, ideally re-run availability logic
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { ...data },
            { new: true }
        );

        revalidatePath('/calendar/bookings');
        return { success: true, data: JSON.parse(JSON.stringify(booking)) };
    } catch (error) {
        console.error('[UPDATE_BOOKING]', error);
        return { success: false, error: 'Failed to update booking' };
    }
}
