
'use server';

import connectToDatabase from "@/lib/db/connect";
import Booking from "@/lib/db/models/Booking";
import Availability from "@/lib/db/models/Availability";
import Product from "@/lib/db/models/Product";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { revalidatePath } from "next/cache";
import { addMinutes, format, parse, isSameDay, setHours, setMinutes, isBefore, isAfter } from "date-fns";

// Helper to generate slots
export async function getAvailableSlots(date: Date, serviceId: string) {
    try {
        await connectToDatabase();

        // 1. Get Service Duration
        const service = await Product.findById(serviceId);
        if (!service || !service.duration) {
            return { success: false, error: 'Invalid service or missing duration' };
        }
        const duration = service.duration;

        // 2. Get Business ID from Service
        const businessId = service.businessId;

        // 3. Get Availability for the day of week
        const dayOfWeek = date.getDay();
        const availability = await Availability.findOne({ businessId, dayOfWeek });

        if (!availability || !availability.isActive) {
            return { success: true, data: [] }; // Closed today
        }

        // 4. Get existing bookings for that day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingBookings = await Booking.find({
            businessId,
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        });

        // 5. Generate Slots
        const slots: string[] = [];
        const [startHour, startMinute] = availability.startTime.split(':').map(Number);
        const [endHour, endMinute] = availability.endTime.split(':').map(Number);

        let currentSlot = setMinutes(setHours(new Date(date), startHour), startMinute);
        const limitTime = setMinutes(setHours(new Date(date), endHour), endMinute);

        while (isBefore(addMinutes(currentSlot, duration), limitTime) || format(addMinutes(currentSlot, duration), 'HH:mm') === format(limitTime, 'HH:mm')) {
            const slotEnd = addMinutes(currentSlot, duration);

            // Check collision
            const isColliding = existingBookings.some(booking => {
                const bStart = new Date(booking.startTime);
                const bEnd = new Date(booking.endTime);
                return (
                    (isAfter(currentSlot, bStart) && isBefore(currentSlot, bEnd)) || // Starts inside
                    (isAfter(slotEnd, bStart) && isBefore(slotEnd, bEnd)) || // Ends inside
                    (isBefore(currentSlot, bStart) && isAfter(slotEnd, bEnd)) || // Envelops
                    isSameDay(currentSlot, bStart) && format(currentSlot, 'HH:mm') === format(bStart, 'HH:mm') // Precise start match
                );
            });

            if (!isColliding) {
                slots.push(format(currentSlot, 'HH:mm'));
            }

            currentSlot = addMinutes(currentSlot, 30); // Step by 30 mins (could be configurable)
        }

        return { success: true, data: slots };

    } catch (error) {
        console.error('[GET_SLOTS]', error);
        return { success: false, error: 'Failed to generate slots' };
    }
}

export async function createBooking(data: any) {
    try {
        await connectToDatabase();

        // Basic validation
        const service = await Product.findById(data.serviceId);
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
            notes: data.notes
        });

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
