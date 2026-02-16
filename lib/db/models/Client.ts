import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
    businessId: mongoose.Types.ObjectId;
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
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
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
        notes: String,
    },
    {
        timestamps: true,
    }
);

const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default Client;
