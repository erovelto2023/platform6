import { Schema, model, models } from 'mongoose';

const AmazonProductSchema = new Schema({
    asin: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: String },
    currency: { type: String },
    imageUrl: { type: String },
    productUrl: { type: String },
    rating: { type: String },
    reviewCount: { type: Number },
    isPrime: { type: Boolean, default: false },
    features: [{ type: String }],
    lastRefreshed: { type: Date, default: Date.now },
}, { timestamps: true });

const AmazonProduct = models.AmazonProduct || model('AmazonProduct', AmazonProductSchema);

export default AmazonProduct;
