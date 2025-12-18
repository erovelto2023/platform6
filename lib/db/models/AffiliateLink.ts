import { Schema, model, models } from 'mongoose';

const AffiliateLinkSchema = new Schema({
    userAffiliateId: { type: Schema.Types.ObjectId, ref: 'UserAffiliateCompany', required: true },
    userId: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: 'link' }, // link, banner, coupon
    keywords: [{ type: String }],
    notes: { type: String }
}, { timestamps: true });

const AffiliateLink = models.AffiliateLink || model('AffiliateLink', AffiliateLinkSchema);
export default AffiliateLink;
