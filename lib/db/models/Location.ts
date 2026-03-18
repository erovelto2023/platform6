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
    stateData?: {
        capital?: string;
        nickname?: string;
        statehoodDate?: string;
        fipsCode?: string;
        demonym?: string;
        elevation?: { maxFeet: number; minFeet: number };
        timezone?: string;
        region?: string;
        division?: string;
        symbols?: {
            bird?: string;
            flower?: string;
            tree?: string;
            motto?: string;
            song?: string;
        };
        subdivisions?: string[];
    };
    legislativeData?: {
        jurisdictionId?: string;
        legislators: Array<{
            name: string;
            party?: string;
            chamber?: string;
            district?: string;
            email?: string;
            phone?: string;
            photo?: string;
            url?: string;
        }>;
        recentBills: Array<{
            identifier: string;
            title: string;
            status?: string;
            lastActionDate?: string;
            url?: string;
            subjects?: string[];
        }>;
    };
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
        stateData: {
            capital: String,
            nickname: String,
            statehoodDate: String,
            fipsCode: String,
            demonym: String,
            elevation: {
                maxFeet: Number,
                minFeet: Number,
            },
            timezone: String,
            region: String,
            division: String,
            symbols: {
                bird: String,
                flower: String,
                tree: String,
                motto: String,
                song: String,
            },
            subdivisions: [String],
        },
        legislativeData: {
            jurisdictionId: String,
            legislators: [{
                name: String,
                party: String,
                chamber: String,
                district: String,
                email: String,
                phone: String,
                photo: String,
                url: String,
            }],
            recentBills: [{
                identifier: String,
                title: String,
                status: String,
                lastActionDate: String,
                url: String,
                subjects: [String],
            }],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for city within a state
LocationSchema.index({ slug: 1, stateSlug: 1 });

const Location = mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);

export default Location;
