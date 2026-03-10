
import { Schema, model, models } from 'mongoose';

const OfferSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    price: Number,
    type: {
        type: String,
        enum: ['course', 'membership', 'coaching', 'affiliate', 'digital_product', 'service', 'other', 'sales', 'upsell', 'downsell', 'thank-you'],
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
    // New Advanced Builder Fields
    description: String,
    keywords: String,
    headerCode: String,
    bodyCode: String,
    footerCode: String,
    isPublished: {
        type: Boolean,
        default: false
    },
    showInMarketplace: {
        type: Boolean,
        default: false
    },
    pageType: {
        type: String,
        enum: ['sales', 'upsell', 'downsell', 'thank-you'],
        default: 'sales'
    },
    buyUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    marketplaceTitle: String,
    marketplaceDescription: String,
    marketplaceImage: String,
    marketplaceColor: {
        type: String,
        default: '#3b82f6'
    },
    useColorAsDefault: {
        type: Boolean,
        default: true
    },
    marketplaceFeatures: {
        type: [String],
        default: ['Instant Access', 'Premium Content']
    },
    abEnabled: {
        type: Boolean,
        default: false
    },
    bodyCodeB: String,
    // Stats
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    viewsA: { type: Number, default: 0 },
    clicksA: { type: Number, default: 0 },
    viewsB: { type: Number, default: 0 },
    clicksB: { type: Number, default: 0 },
}, { timestamps: true });

// Prevent Mongoose OverwriteModelError
if (models.Offer) {
    delete models.Offer;
}

const Offer = model('Offer', OfferSchema);

export default Offer;
