
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICalendarService extends Document {
    businessId: string;
    name: string;
    description?: string;
    duration: number; // In minutes
    preBuffer: number; // Buffer before session
    postBuffer: number; // Buffer after session
    price: number;
    capacity: number; // Number of people who can book the same slot
    slug?: string;
    location?: string; // e.g. "Zoom", "Google Meet", "Office"
    cancellationPolicy?: string;
    color?: string; // Hex code for calendar display
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CalendarServiceSchema = new Schema(
    {
        businessId: {
            type: String,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        duration: {
            type: Number,
            required: true,
            default: 60,
        },
        preBuffer: {
            type: Number,
            default: 0,
        },
        postBuffer: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            default: 0,
        },
        capacity: {
            type: Number,
            default: 1, // Default to 1-on-1
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
        },
        location: {
            type: String, // "Zoom", "Phone", "123 Main St"
        },
        cancellationPolicy: {
            type: String,
        },
        color: {
            type: String,
            default: "#6366f1", // Default indigo
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const CalendarService: Model<ICalendarService> =
    mongoose.models.CalendarService || mongoose.model<ICalendarService>('CalendarService', CalendarServiceSchema);

export default CalendarService;
