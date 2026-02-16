
'use server';

import { Resend } from 'resend';
import Business from '@/lib/db/models/Business';
import { BookingConfirmationEmail } from '@/emails/BookingConfirmationEmail';
import connectToDatabase from '@/lib/db/connect';
import { format } from 'date-fns';

export async function sendBookingConfirmation(
    businessId: string,
    bookingData: {
        customerEmail: string;
        customerName: string;
        serviceName: string;
        startTime: Date;
        location?: string;
    }
) {
    try {
        await connectToDatabase();

        // 1. Fetch Business Settings (including hidden API key)
        const business = await Business.findById(businessId).select('+emailSettings.apiKey');

        if (!business || !business.emailSettings?.apiKey) {
            console.warn(`[SEND_EMAIL] No API key found for business ${businessId}`);
            return { success: false, error: 'Email not configured' };
        }

        // 2. Initialize Resend
        const resend = new Resend(business.emailSettings.apiKey);

        // 3. Send Email
        const { data, error } = await resend.emails.send({
            from: business.emailSettings.fromEmail || 'onboarding@resend.dev',
            to: [bookingData.customerEmail],
            subject: `Booking Confirmed: ${bookingData.serviceName}`,
            react: BookingConfirmationEmail({
                customerName: bookingData.customerName,
                serviceName: bookingData.serviceName,
                date: format(new Date(bookingData.startTime), 'MMMM do, yyyy'),
                time: format(new Date(bookingData.startTime), 'h:mm a'),
                location: bookingData.location,
                businessName: business.name
            })
        });

        if (error) {
            console.error('[RESEND_ERROR]', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };

    } catch (error) {
        console.error('[SEND_BOOKING_EMAIL]', error);
        return { success: false, error: 'Failed to send email' };
    }
}
