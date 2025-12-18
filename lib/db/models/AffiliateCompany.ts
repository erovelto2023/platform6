import { Schema, model, models } from 'mongoose';

const AffiliateCompanySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String },
    description: { type: String },
    logo: { type: String },
    website: { type: String },

    // Market Data
    industry: { type: String },
    niches: [{ type: String }],
    keywords: [{ type: String }],
    targetAudience: { type: String },

    // Affiliate Program Details
    affiliateNetwork: { type: String }, // e.g., ShareASale, Impact, In-house
    signupUrl: { type: String },
    commissionType: { type: String, enum: ['percentage', 'flat', 'recurring', 'mixed'] },
    commissionRate: { type: String }, // e.g. "20%", "$50"
    cookieDuration: { type: Number }, // in days
    payoutThreshold: { type: Number },
    payoutFrequency: { type: String },

    // Trust & Stats
    trustScore: { type: Number, min: 0, max: 100, default: 50 },
    isVerified: { type: Boolean, default: false },

    // Admin
    isPublic: { type: Boolean, default: true },
    createdBy: { type: String }, // Clerk ID of creator (for custom companies)
    adminNotes: { type: String },
}, { timestamps: true });

AffiliateCompanySchema.index({ name: 'text', summary: 'text', niches: 'text' });

const AffiliateCompany = models.AffiliateCompany || model('AffiliateCompany', AffiliateCompanySchema);

export default AffiliateCompany;
