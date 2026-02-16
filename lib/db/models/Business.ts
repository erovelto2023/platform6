import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
    userId: mongoose.Types.ObjectId;
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
    createdAt: Date;
    updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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
    },
    {
        timestamps: true,
    }
);

const Business = mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);

export default Business;
