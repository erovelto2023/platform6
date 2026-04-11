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
    emailSettings?: {
        provider: 'resend';
        apiKey: string;
        fromEmail: string;
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
        emailSettings: {
            provider: { type: String, default: 'resend' },
            apiKey: { type: String, select: false }, // Don't return API key by default
            fromEmail: { type: String, default: 'onboarding@resend.dev' },
        },
    },
    {
        timestamps: true,
    }
);

const Business = mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);

export default Business;
