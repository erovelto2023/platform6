
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAvailability extends Document {
    businessId: string;
    dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
    startTime: string; // "09:00"
    endTime: string; // "17:00"
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
        dayOfWeek: {
            type: Number,
            required: true,
            min: 0,
            max: 6,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
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

// Compound index to ensure unique rules per day for a business (optional, but good for simple rules)
// AvailabilitySchema.index({ businessId: 1, dayOfWeek: 1 }, { unique: true });

const Availability: Model<IAvailability> =
    mongoose.models.Availability || mongoose.model<IAvailability>('Availability', AvailabilitySchema);

export default Availability;
