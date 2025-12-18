import mongoose from "mongoose";

const KnowledgeSourceSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["url", "youtube", "text"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    title: String,
    extractedText: String,
    vectorized: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AffiliateBrandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        affiliateLink: {
            type: String,
            required: true,
        },
        productType: {
            type: String,
            enum: ["software", "physical", "service", "digital"],
            default: "software",
        },
        logoUrl: String,
        description: String,
        isActive: {
            type: Boolean,
            default: false,
        },
        knowledgeBase: [KnowledgeSourceSchema],
        // Extracted data from knowledge base
        features: [String],
        pricing: {
            plans: [
                {
                    name: String,
                    price: String,
                    features: [String],
                },
            ],
        },
        pros: [String],
        cons: [String],
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const AffiliateBrand =
    mongoose.models.AffiliateBrand ||
    mongoose.model("AffiliateBrand", AffiliateBrandSchema);

export default AffiliateBrand;
