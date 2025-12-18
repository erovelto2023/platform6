import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String }, // URL to image
    location: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String, default: 'USA' }
    },
    comments: { type: String },
    wholesaleType: {
        type: String,
        enum: ['Dropshipper', 'Light Bulk', 'Both'],
        default: 'Both'
    },
    shippingRegions: [{ type: String }], // e.g., 'USA', 'Canada', 'Worldwide'
    shipMethods: [{ type: String }], // e.g., 'UPS', 'FedEx'
    categories: [{ type: String }], // e.g., 'Electronics', 'Home & Garden'
    products: [{ type: String }], // Summary list of products/keywords
    approvedChannels: [{ type: String }], // e.g., 'Amazon', 'eBay', 'Online Store'
    datafeedType: { type: String, default: 'None' }, // 'CSV', 'API', 'None'

    // Detailed Info
    contactInfo: {
        website: { type: String },
        contactName: { type: String },
        email: { type: String },
        phone: { type: String },
        fax: { type: String }
    },
    capabilities: {
        dropship: { type: Boolean, default: false },
        lightBulk: { type: Boolean, default: false },
        ebay: { type: Boolean, default: false },
        amazon: { type: Boolean, default: false }
    },
    accountSetup: {
        minOrder: { type: String }, // Kept for backward compatibility
        dropShipFee: { type: String },
        paymentMethods: [{ type: String }], // "Terms"
        orderingMethods: [{ type: String }], // "Ordering"
    },
    lightBulkDetails: {
        setupFee: { type: String },
        minFirstOrder: { type: String },
        minReorder: { type: String },
        priceBreaks: { type: String }
    },
    brands: [{ type: String }],
    images: [{ type: String }], // Product example images

    isCertified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);
