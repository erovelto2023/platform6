
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
    businessId: string;
    serviceId: mongoose.Types.ObjectId;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    startTime: Date;
    endTime: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no-show';
    paymentStatus: 'unpaid' | 'paid' | 'refunded';
    capacityUsed: number;
    meetingLink?: string;
    notes?: string;
    internalNotes?: string;
    location?: string; // Add this!
    magicLinkToken?: string; // For self-service management
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema(
    {
        businessId: {
            type: String,
            required: true,
            index: true,
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: 'CalendarService',
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
        },
        startTime: {
            type: Date,
            required: true,
            index: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'attended', 'no-show'],
            default: 'confirmed',
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid', 'refunded'],
            default: 'unpaid',
        },
        capacityUsed: {
            type: Number,
            default: 1,
        },
        meetingLink: {
            type: String,
        },
        notes: {
            type: String,
        },
        internalNotes: {
            type: String,
        },
        location: {
            type: String, // Zoom, address, etc.
        },
        magicLinkToken: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
