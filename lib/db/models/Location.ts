import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    name: string;
    slug: string;
    type: 'state' | 'city';
    stateSlug?: string; // Parent state slug for cities
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['state', 'city'],
            required: true,
            index: true,
        },
        stateSlug: {
            type: String,
            index: true,
        },
        description: String,
        metaTitle: String,
        metaDescription: String,
        image: String,
    },
    {
        timestamps: true,
    }
);

// Compound index for city within a state
LocationSchema.index({ slug: 1, stateSlug: 1 });

const Location = mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);

export default Location;
