import { Schema, model, models } from 'mongoose';

const UserAffiliateCompanySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'AffiliateCompany', required: true },

    status: {
        type: String,
        enum: ['interested', 'applied', 'approved', 'rejected', 'active', 'paused'],
        default: 'interested'
    },
    affiliateId: { type: String }, // User's ID on the affiliate platform
    personalNotes: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },

    // Performance (Manual Tracking)
    totalEarnings: { type: Number, default: 0 },
    lastPayoutDate: { type: Date },
}, { timestamps: true });

// Ensure unique user-company pair
UserAffiliateCompanySchema.index({ userId: 1, companyId: 1 }, { unique: true });

const UserAffiliateCompany = models.UserAffiliateCompany || model('UserAffiliateCompany', UserAffiliateCompanySchema);

export default UserAffiliateCompany;
