
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICalendarService extends Document {
    businessId: string;
    name: string;
    description?: string;
    duration: number; // In minutes
    price: number;
    slug?: string;
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
            default: 30,
        },
        price: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
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
