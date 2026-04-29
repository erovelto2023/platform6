import { Schema, model, models } from 'mongoose';

export interface IPersonalAffiliateOffer {
    _id: string;
    name: string;
    affiliateLink: string;
    price: string;
    commissionLevel: string;
    payoutAmount: string;
    network: string;
    notes?: string;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
}

const PersonalAffiliateOfferSchema = new Schema({
    name: { type: String, required: true },
    affiliateLink: { type: String, required: true },
    price: { type: String },
    commissionLevel: { type: String },
    payoutAmount: { type: String },
    network: { type: String },
    notes: { type: String },
    clicks: { type: Number, default: 0 },
}, { timestamps: true });

const PersonalAffiliateOffer = models.PersonalAffiliateOffer || model('PersonalAffiliateOffer', PersonalAffiliateOfferSchema);

export default PersonalAffiliateOffer;
