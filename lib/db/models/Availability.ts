import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAvailability extends Document {
    businessId: string;
    type: 'recurring' | 'override';
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    date?: Date; // For specific date overrides
    slots: { startTime: string; endTime: string }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AvailabilitySchema = new Schema(
    {
        businessId: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['recurring', 'override'],
            default: 'recurring',
        },
        dayOfWeek: {
            type: Number,
            min: 0,
            max: 6,
        },
        date: {
            type: Date,
        },
        slots: [
            {
                startTime: { type: String, required: true }, // "09:00"
                endTime: { type: String, required: true },   // "17:00"
            }
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Availability: Model<IAvailability> =
    mongoose.models.Availability || mongoose.model<IAvailability>('Availability', AvailabilitySchema);

export default Availability;
