import { Schema, model, models } from 'mongoose';

const AffiliateProductSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'AffiliateCompany', required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String }, // SaaS, Physical, Course, etc.
    category: { type: String },

    // Pricing & Commission
    price: { type: String },
    commissionRate: { type: String },
    isRecurring: { type: Boolean, default: false },

    // Assets
    promotionalAssets: [{ type: String }], // URLs to banners, etc.

    isPublic: { type: Boolean, default: true },
}, { timestamps: true });

const AffiliateProduct = models.AffiliateProduct || model('AffiliateProduct', AffiliateProductSchema);

export default AffiliateProduct;
