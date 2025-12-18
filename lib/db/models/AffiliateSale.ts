import { Schema, model, models } from 'mongoose';

const AffiliateSaleSchema = new Schema({
    userAffiliateId: { type: Schema.Types.ObjectId, ref: 'UserAffiliateCompany', required: true },
    userId: { type: String, required: true }, // Clerk ID
    dateOfSale: { type: Date, required: true },
    dateOfPayment: { type: Date },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    notes: { type: String }
}, { timestamps: true });

const AffiliateSale = models.AffiliateSale || model('AffiliateSale', AffiliateSaleSchema);
export default AffiliateSale;
