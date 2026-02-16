import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    taxId?: string;
    logo?: string;
    currency: string;
    calendarSettings?: {
        slug?: string;
        timezone?: string;
        bufferTime?: number;
        slotInterval?: number;
        requiresConfirmation?: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: String,
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        taxId: String,
        logo: String,
        currency: {
            type: String,
            default: 'USD',
        },
        calendarSettings: {
            slug: { type: String, unique: true, sparse: true },
            timezone: { type: String, default: 'UTC' },
            bufferTime: { type: Number, default: 0 },
            slotInterval: { type: Number, default: 30 },
            requiresConfirmation: { type: Boolean, default: false },
        },
    },
    {
        timestamps: true,
    }
);

const Business = mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);

export default Business;
