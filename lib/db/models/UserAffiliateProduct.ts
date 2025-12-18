import { Schema, model, models } from 'mongoose';

const UserAffiliateProductSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'AffiliateProduct', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'AffiliateCompany', required: true }, // Denormalized for easier querying

    affiliateLink: { type: String },
    couponCode: { type: String },
    status: { type: String, default: 'planned' },
    notes: { type: String },

    // Performance (Manual Tracking)
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
}, { timestamps: true });

UserAffiliateProductSchema.index({ userId: 1, productId: 1 }, { unique: true });

const UserAffiliateProduct = models.UserAffiliateProduct || model('UserAffiliateProduct', UserAffiliateProductSchema);

export default UserAffiliateProduct;
