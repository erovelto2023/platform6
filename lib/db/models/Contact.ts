
import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    businessId: string;
    name: string;
    email: string;
    phone?: string;
    tags?: string[];
    notes?: string;
    totalBookings: number;
    lastBookingDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
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
        email: {
            type: String,
            required: true,
        },
        phone: String,
        tags: [String],
        notes: String,
        totalBookings: {
            type: Number,
            default: 0,
        },
        lastBookingDate: Date,
    },
    {
        timestamps: true,
    }
);

// Compound index for unique email per business
ContactSchema.index({ businessId: 1, email: 1 }, { unique: true });

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
