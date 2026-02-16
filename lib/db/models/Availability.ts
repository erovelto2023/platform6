
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAvailability extends Document {
    businessId: string;
    dayOfWeek?: number;
    date?: Date;
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
        // For recurring rules (0-6)
        dayOfWeek: {
            type: Number,
            min: 0,
            max: 6,
        },
        // For specific date overrides
        date: {
            type: Date,
        },
        slots: [{
            startTime: String, // "09:00"
            endTime: String,   // "17:00"
        }],
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
