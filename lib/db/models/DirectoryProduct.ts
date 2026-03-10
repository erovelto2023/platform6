import mongoose, { Schema, Model } from 'mongoose';

export interface IReview {
    user: string;
    rating: number;
    comment: string;
    date: string;
    isApproved?: boolean; // For admin control
    isVerified?: boolean; // Verified purchase
    proofUrl?: string; // Screenshot URL
}

export interface IDirectoryProduct {
    id: number; // custom numeric ID
    name: string;
    slug: string; // URL-friendly version
    logoUrl?: string;
    niche: string;
    category: string;

    // Descriptions
    shortDescription?: string; // For cards
    description: string; // Full description (Markdown supported)

    // Affiliate & Revenue
    affiliateLink?: string;
    ctaButtonText?: string;
    commissionRate?: string; // Internal use
    affiliateNetwork?: string; // Internal use
    clicks: number; // Analytics
    affiliateEarnings: number; // Analytics

    // Classification & Pricing
    rating: number;
    reviewsCount: number;
    priceModel: string;
    startingPrice?: number; // Numeric for sorting
    freeTrialDuration?: string;
    deal?: string;
    dealExpiration?: Date; // For countdown
    skillLevel?: 'Beginner Friendly' | 'Intermediate' | 'Technical/Developer';

    // Details
    tags: string[];
    featured: boolean;
    logoColor: string; // Fallback if no logoUrl
    pros: string[];
    cons: string[];
    features: string[];
    supportedPlatforms?: string[];
    alternativeTo?: string; // SEO

    // Trust & Media
    videoUrl?: string;
    refundPolicy?: string;
    supportOptions?: string[];

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    lastUpdated?: Date;

    userReviews: IReview[];

    // Expansion Fields
    type?: 'tool' | 'resource' | 'course' | 'service' | 'platform' | 'community' | 'deal' | 'program' | 'media' | 'event' | 'other';
    resourceType?: string;
    author?: string;

    // Timestamps (Mongoose)
    createdAt?: Date;
    updatedAt?: Date;
}

const DirectoryProductSchema = new Schema<IDirectoryProduct>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    logoUrl: { type: String },
    niche: { type: String, required: true },
    category: { type: String, required: true },

    // Directory Type
    type: {
        type: String,
        enum: ['tool', 'resource', 'course', 'service', 'platform', 'community', 'deal', 'program', 'media', 'event', 'other'],
        default: 'tool'
    },
    resourceType: { type: String },
    author: { type: String },

    shortDescription: { type: String },
    description: { type: String, required: true },

    affiliateLink: { type: String },
    ctaButtonText: { type: String, default: 'Visit Website' },
    commissionRate: { type: String }, 
    affiliateNetwork: { type: String }, 
    clicks: { type: Number, default: 0 },
    affiliateEarnings: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    priceModel: { type: String, required: true },
    startingPrice: { type: Number },
    freeTrialDuration: { type: String },
    deal: { type: String },
    dealExpiration: { type: Date },
    skillLevel: {
        type: String,
        enum: ['Beginner Friendly', 'Intermediate', 'Technical/Developer'],
        default: 'Beginner Friendly'
    },

    tags: [String],
    featured: { type: Boolean, default: false },
    logoColor: { type: String, default: 'bg-blue-500' },
    pros: [String],
    cons: [String],
    features: [String],
    supportedPlatforms: [String],
    alternativeTo: { type: String },

    videoUrl: { type: String },
    refundPolicy: { type: String },
    supportOptions: [String],

    metaTitle: { type: String },
    metaDescription: { type: String },
    lastUpdated: { type: Date, default: Date.now },

    userReviews: [{
        user: String,
        rating: Number,
        comment: String,
        date: String,
        isApproved: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        proofUrl: { type: String }
    }]
}, { timestamps: true });

const DirectoryProduct: Model<IDirectoryProduct> = mongoose.models.DirectoryProduct || mongoose.model<IDirectoryProduct>('DirectoryProduct', DirectoryProductSchema);

export default DirectoryProduct;
