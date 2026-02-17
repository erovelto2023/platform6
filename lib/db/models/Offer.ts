
import { Schema, model, models } from 'mongoose';

const OfferSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: Number,
    type: {
        type: String,
        enum: ['course', 'membership', 'coaching', 'affiliate', 'digital_product', 'service', 'other'],
        default: 'other',
    },
    funnelUrl: String,
    recurring: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'archived'],
        default: 'draft',
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    businessId: {
        type: String,
        required: true,
        index: true,
    },
}, { timestamps: true });

// Prevent Mongoose OverwriteModelError
if (models.Offer) {
    delete models.Offer;
}

const Offer = model('Offer', OfferSchema);

export default Offer;
