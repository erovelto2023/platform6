
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
    businessId: string;
    serviceId: mongoose.Types.ObjectId;
    customerName: string;
    customerEmail: string;
    startTime: Date;
    endTime: Date;
    status: 'confirmed' | 'cancelled' | 'completed';
    notes?: string;
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
            enum: ['confirmed', 'cancelled', 'completed'],
            default: 'confirmed',
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
